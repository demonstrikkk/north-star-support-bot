import { useEffect, useRef } from 'react'
import { AlertTriangle } from 'lucide-react'
import type { ChatAction, ChatEntry } from '../types/chat'
import { ChatComposer } from './ChatComposer'
import { MessageBubble } from './MessageBubble'
import { TypingIndicator } from './TypingIndicator'

export function ChatWorkspace({
  entries,
  isTyping,
  error,
  onSubmit,
  onAction,
}: {
  entries: ChatEntry[]
  isTyping: boolean
  error: string | null
  onSubmit: (message: string) => void
  onAction: (action: ChatAction) => void
}) {
  const bottomRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (typeof bottomRef.current?.scrollIntoView === 'function') {
      bottomRef.current.scrollIntoView({ behavior: 'smooth', block: 'end' })
    }
  }, [entries, isTyping])

  const latestActionEntryId = [...entries].reverse().find((entry) => entry.role === 'assistant' && entry.actions?.length)?.id

  return (
    <main className="flex min-w-0 flex-1 flex-col overflow-hidden">
      <div className="chat-scroll flex-1 overflow-y-auto px-3 py-5 sm:px-6 sm:py-7 lg:px-8">
        <div className="mx-auto flex w-full max-w-4xl flex-col gap-5">
          {entries.map((entry) => (
            <MessageBubble key={entry.id} entry={entry} onAction={onAction} actionsEnabled={entry.id === latestActionEntryId && !isTyping} />
          ))}
          {isTyping ? <TypingIndicator /> : null}
          {error ? (
            <div className="flex items-start gap-3 rounded-2xl border border-rose-300/20 bg-rose-400/10 p-4 text-sm text-rose-100">
              <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
              <div><p className="font-semibold">I’m having trouble reaching the support service.</p><p className="mt-1 text-rose-100/65">Please try again. Technical detail: {error}</p></div>
            </div>
          ) : null}
          <div ref={bottomRef} />
        </div>
      </div>
      <ChatComposer onSubmit={onSubmit} disabled={isTyping} isTyping={isTyping} />
    </main>
  )
}
