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
}

const API_URL = import.meta.env.VITE_AI_API_URL as string

export async function sendMessage(messages: ChatMessage[]): Promise<AiResponse> {
  if (!API_URL) {
    throw new Error('AI service not configured')
  }

  const response = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({ error: 'Unknown error' }))
    throw new Error(data.error || `API error ${response.status}`)
  }

  return response.json()
}
