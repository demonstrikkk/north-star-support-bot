export type MessageType =
  | 'text'
  | 'welcome'
  | 'order_status'
  | 'policy_card'
  | 'shipping_card'
  | 'recommendation_question'
  | 'recommendation_result'
  | 'live_agent'
  | 'fallback'
  | 'error'
  | 'chat_ended'

export type ActionVariant = 'primary' | 'secondary' | 'ghost' | 'danger'

export interface ChatAction {
  label: string
  value: string
  icon?: string | null
  variant?: ActionVariant
}

export interface BotMessagePayload {
  type: MessageType
  text?: string | null
  title?: string | null
  subtitle?: string | null
  status?: string | null
  detail?: string | null
  data: Record<string, unknown>
}

export interface ChatResponse {
  session_id: string
  intent: string
  state: string
  messages: BotMessagePayload[]
  actions: ChatAction[]
}

export interface ChatEntry {
  id: string
  role: 'user' | 'assistant'
  content?: string
  payload?: BotMessagePayload
  actions?: ChatAction[]
  timestamp: Date
}
