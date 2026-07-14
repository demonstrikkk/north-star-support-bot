import { motion } from 'framer-motion'
import type { ChatEntry } from '../types/chat'
import { ActionButton } from './ActionButton'
import { MessageCard } from './MessageCards'

export function MessageBubble({ entry, onAction, actionsEnabled = true }: { entry: ChatEntry; onAction: (action: NonNullable<ChatEntry['actions']>[number]) => void; actionsEnabled?: boolean }) {
  const time = entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  if (entry.role === 'user') {
    return (
      <motion.div initial={{ opacity: 0, y: 8, x: 8 }} animate={{ opacity: 1, y: 0, x: 0 }} className="ml-auto max-w-[86%] sm:max-w-[72%]">
        <div className="rounded-2xl rounded-br-md border border-emerald-300/20 bg-gradient-to-br from-emerald-700/55 to-emerald-950/80 px-4 py-3 text-sm leading-6 text-emerald-50 shadow-[0_12px_32px_rgba(0,0,0,.18)]">
          {entry.content}
        </div>
        <p className="mt-1.5 text-right text-[11px] text-slate-600">{time}</p>
      </motion.div>
    )
  }
  return (
    <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="max-w-[96%] sm:max-w-[88%]">
      {entry.payload ? <MessageCard payload={entry.payload} /> : null}
      {entry.actions?.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {entry.actions.map((action) => (
            <ActionButton key={`${entry.id}-${action.value}`} action={action} disabled={!actionsEnabled} onClick={() => onAction(action)} />
          ))}
        </div>
      ) : null}
      <p className="mt-1.5 text-[11px] text-slate-600">{time}</p>
    </motion.div>
  )
}
