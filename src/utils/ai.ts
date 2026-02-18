export interface AiTaskSuggestion {
  title: string
  duration: number
  priority: 'high' | 'medium' | 'low'
  deadline: 'today' | 'this_week' | 'this_month'
  category: string
}

export interface AiResponse {
  text: string
  tasks: AiTaskSuggestion[]
}

export interface ChatMessage {
  role: 'user' | 'model'
  text: string
  tasks?: AiTaskSuggestion[]
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

function buildGeminiPayload(messages: ChatMessage[]) {
  const contents = [
    { role: 'user', parts: [{ text: SYSTEM_PROMPT }] },
    { role: 'model', parts: [{ text: 'Understood! I\'m SaRa, your ADHD-friendly task planner. Tell me what you need to do and I\'ll help break it down!' }] },
    ...messages.map((m) => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }],
    })),
  ]

  return { contents }
}

function extractTasks(text: string): AiTaskSuggestion[] {
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

export async function sendMessage(
  messages: ChatMessage[],
  apiKey: string
): Promise<AiResponse> {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(buildGeminiPayload(messages)),
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`API error ${response.status}: ${err}`)
  }

  const data = await response.json()
  const rawText =
    data.candidates?.[0]?.content?.parts?.[0]?.text || 'Sorry, I couldn\'t generate a response.'

  const tasks = extractTasks(rawText)
  const cleanText = stripJsonBlock(rawText)

  return { text: cleanText, tasks }
}
