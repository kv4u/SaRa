interface Env {
  GROQ_API_KEY: string
  ALLOWED_ORIGIN: string
}

interface ChatMessage {
  role: 'user' | 'model'
  text: string
}

interface TaskSuggestion {
  title: string
  duration: number
  priority: 'high' | 'medium' | 'low'
  deadline: 'today' | 'this_week' | 'this_month'
  category: string
}

const SYSTEM_PROMPT = `You are SaRa, a friendly ADHD-aware task planner assistant. Your job is to help users break down their goals into small, manageable micro-tasks (5-30 minutes each).

When the user describes what they need to do:
1. Respond conversationally with empathy and encouragement (2-3 sentences max).
2. Then output a JSON block with structured tasks.

The JSON block MUST be wrapped in \`\`\`json ... \`\`\` fences and contain an array of task objects with these fields:
- "title": short task name (string)
- "duration": estimated minutes, between 5-60 (number)
- "priority": "high" | "medium" | "low"
- "deadline": "today" | "this_week" | "this_month"
- "category": a short label like "cleaning", "work", "personal", etc.

Break large tasks into smaller steps. Prioritize by urgency. Be encouraging and keep language simple.

Example response:
That sounds like a productive plan! Let me break it down into bite-sized pieces for you.

\`\`\`json
[
  {"title": "Gather dirty laundry", "duration": 5, "priority": "high", "deadline": "today", "category": "cleaning"},
  {"title": "Start washing machine", "duration": 5, "priority": "high", "deadline": "today", "category": "cleaning"}
]
\`\`\`

Always include the JSON block when you identify tasks. If the user is just chatting without tasks, respond conversationally without JSON.`

// --- Rate limiter (in-memory, per-isolate) ---
const rateLimitMap = new Map<string, number[]>()
const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX = 10

function isRateLimited(ip: string): boolean {
  const now = Date.now()
  const timestamps = rateLimitMap.get(ip) || []
  const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)

  if (recent.length >= RATE_LIMIT_MAX) {
    rateLimitMap.set(ip, recent)
    return true
  }

  recent.push(now)
  rateLimitMap.set(ip, recent)
  return false
}

function cleanupRateLimit() {
  const now = Date.now()
  for (const [ip, timestamps] of rateLimitMap) {
    const recent = timestamps.filter((t) => now - t < RATE_LIMIT_WINDOW_MS)
    if (recent.length === 0) {
      rateLimitMap.delete(ip)
    } else {
      rateLimitMap.set(ip, recent)
    }
  }
}

function corsHeaders(origin: string, allowedOrigin: string): HeadersInit {
  const allowed = origin === allowedOrigin || origin === 'http://localhost:5173'
  return {
    'Access-Control-Allow-Origin': allowed ? origin : allowedOrigin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Max-Age': '86400',
  }
}

function buildGroqPayload(messages: ChatMessage[]) {
  return {
    model: 'llama-3.3-70b-versatile',
    messages: [
      { role: 'system', content: SYSTEM_PROMPT },
      ...messages.map((m) => ({
        role: m.role === 'user' ? 'user' as const : 'assistant' as const,
        content: m.text,
      })),
    ],
    temperature: 0.7,
    max_tokens: 2048,
  }
}

function extractTasks(text: string): TaskSuggestion[] {
  const jsonMatch = text.match(/```json\s*([\s\S]*?)```/)
  if (!jsonMatch) return []

  try {
    const parsed = JSON.parse(jsonMatch[1])
    if (!Array.isArray(parsed)) return []

    return parsed
      .filter(
        (t: any) =>
          typeof t.title === 'string' &&
          typeof t.duration === 'number' &&
          ['high', 'medium', 'low'].includes(t.priority) &&
          ['today', 'this_week', 'this_month'].includes(t.deadline)
      )
      .map((t: any) => ({
        title: t.title,
        duration: Math.max(1, Math.min(480, t.duration)),
        priority: t.priority,
        deadline: t.deadline,
        category: t.category || 'general',
      }))
  } catch {
    return []
  }
}

function stripJsonBlock(text: string): string {
  return text.replace(/```json\s*[\s\S]*?```/g, '').trim()
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const origin = request.headers.get('Origin') || ''
    const headers = corsHeaders(origin, env.ALLOWED_ORIGIN)

    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers })
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { ...headers, 'Content-Type': 'application/json' },
      })
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown'
    if (isRateLimited(ip)) {
      return new Response(
        JSON.stringify({ error: 'Too many requests. Please wait a minute.' }),
        { status: 429, headers: { ...headers, 'Content-Type': 'application/json' } }
      )
    }

    if (rateLimitMap.size > 100) cleanupRateLimit()

    try {
      const body = await request.json<{ messages: ChatMessage[] }>()
      if (!body.messages || !Array.isArray(body.messages)) {
        return new Response(
          JSON.stringify({ error: 'Invalid request: messages array required' }),
          { status: 400, headers: { ...headers, 'Content-Type': 'application/json' } }
        )
      }

      const messages = body.messages.slice(-20)

      const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${env.GROQ_API_KEY}`,
        },
        body: JSON.stringify(buildGroqPayload(messages)),
      })

      if (!groqResponse.ok) {
        const errText = await groqResponse.text()
        console.error('Groq API error:', groqResponse.status, errText)
        return new Response(
          JSON.stringify({ error: 'AI service temporarily unavailable' }),
          { status: 502, headers: { ...headers, 'Content-Type': 'application/json' } }
        )
      }

      const data: any = await groqResponse.json()
      const rawText = data.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response."

      const tasks = extractTasks(rawText)
      const text = stripJsonBlock(rawText)

      return new Response(
        JSON.stringify({ text, tasks }),
        { status: 200, headers: { ...headers, 'Content-Type': 'application/json' } }
      )
    } catch (err) {
      console.error('Worker error:', err)
      return new Response(
        JSON.stringify({ error: 'Internal server error' }),
        { status: 500, headers: { ...headers, 'Content-Type': 'application/json' } }
      )
    }
  },
}
