import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { resetSession, sendChat } from '../services/api'
import type { ChatAction, ChatEntry, ChatResponse } from '../types/chat'
import { uid } from '../lib/utils'

const STORAGE_KEY = 'north-star-session-id-v1'

function getSessionId() {
  const existing = window.sessionStorage.getItem(STORAGE_KEY)
  if (existing) return existing
  const created = crypto.randomUUID()
  window.sessionStorage.setItem(STORAGE_KEY, created)
  return created
}

function responseToEntry(response: ChatResponse): ChatEntry[] {
  return response.messages.map((payload, index) => ({
    id: uid(`assistant-${index}`),
    role: 'assistant',
    payload,
    actions: index === response.messages.length - 1 ? response.actions : [],
    timestamp: new Date(),
  }))
}

export function useChatSession() {
  const sessionId = useMemo(getSessionId, [])
  const [entries, setEntries] = useState<ChatEntry[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [chatEnded, setChatEnded] = useState(false)
  const requestIdRef = useRef(0)

  const appendResponse = useCallback((response: ChatResponse) => {
    setEntries((current) => [...current, ...responseToEntry(response)])
    if (response.state === 'chat_ended') {
      setChatEnded(true)
    }
  }, [])

  const run = useCallback(
    async (message = '', action: string | null = null, showUser = true, displayLabel?: string) => {
      const requestId = ++requestIdRef.current
      setError(null)
      if (showUser && message.trim()) {
        setEntries((current) => [
          ...current,
          {
            id: uid('user'),
            role: 'user',
            content: message.trim(),
            timestamp: new Date(),
          },
        ])
      }
      if (showUser && action) {
        const label = displayLabel ?? action
          .replace(/^intent_/, '')
          .replace(/^activity_/, '')
          .replace(/^pref_/, '')
          .replace(/^handoff_/, '')
          .replace(/_/g, ' ')
        setEntries((current) => [
          ...current,
          {
            id: uid('user-action'),
            role: 'user',
            content: label.charAt(0).toUpperCase() + label.slice(1),
            timestamp: new Date(),
          },
        ])
      }
      setIsTyping(true)
      try {
        const started = Date.now()
        const response = await sendChat(sessionId, message, action)
        const wait = Math.max(0, 380 - (Date.now() - started))
        if (wait) await new Promise((resolve) => window.setTimeout(resolve, wait))
        if (requestId === requestIdRef.current) appendResponse(response)
      } catch (caught) {
        const messageText = caught instanceof Error ? caught.message : 'Unknown support error'
        setError(messageText)
      } finally {
        if (requestId === requestIdRef.current) setIsTyping(false)
      }
    },
    [appendResponse, sessionId],
  )

  useEffect(() => {
    void run('', 'welcome', false)
  }, [run])

  const submitMessage = useCallback((message: string) => run(message, null, true), [run])

  const chooseAction = useCallback(
    (action: ChatAction) => {
      if (action.value === 'open_returns') {
        window.location.href = '/returns'
        return Promise.resolve()
      }
      return run('', action.value, true, action.label)
    },
    [run],
  )

  const endChat = useCallback(() => {
    return run('', 'end_chat', false)
  }, [run])

  const restart = useCallback(async () => {
    requestIdRef.current += 1
    setEntries([])
    setIsTyping(true)
    setError(null)
    setChatEnded(false)
    try {
      const response = await resetSession(sessionId)
      appendResponse(response)
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to restart the chat')
    } finally {
      setIsTyping(false)
    }
  }, [appendResponse, sessionId])

  return {
    entries,
    isTyping,
    error,
    chatEnded,
    submitMessage,
    chooseAction,
    endChat,
    restart,
  }
}
