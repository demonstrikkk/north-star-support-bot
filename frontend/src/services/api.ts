import type { ChatResponse } from '../types/chat'

async function parseResponse(response: Response): Promise<ChatResponse> {
  if (!response.ok) {
    throw new Error(`Support service returned ${response.status}`)
  }
  return response.json() as Promise<ChatResponse>
}

export async function sendChat(
  sessionId: string,
  message = '',
  action: string | null = null,
): Promise<ChatResponse> {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ session_id: sessionId, message, action }),
  })
  return parseResponse(response)
}

export async function resetSession(sessionId: string): Promise<ChatResponse> {
  const response = await fetch(`/api/session/${encodeURIComponent(sessionId)}/reset`, {
    method: 'POST',
  })
  return parseResponse(response)
}
