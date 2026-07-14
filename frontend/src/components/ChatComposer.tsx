import { FormEvent, KeyboardEvent, useState } from 'react'
import { motion } from 'framer-motion'
import { SendHorizontal } from 'lucide-react'
import { cn } from '../lib/utils'

export function ChatComposer({ onSubmit, disabled, isTyping }: { onSubmit: (value: string) => void; disabled?: boolean; isTyping?: boolean }) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)

  const submit = () => {
    const trimmed = value.trim()
    if (!trimmed || disabled) return
    onSubmit(trimmed)
    setValue('')
  }

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    submit()
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      submit()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="relative px-3 pb-[max(.75rem,env(safe-area-inset-bottom))] pt-2 sm:px-5 sm:pb-4">
      <div className={cn('aurora-composer relative rounded-[1.45rem] p-px transition duration-500', (focused || isTyping) && 'aurora-composer-active')}>
        <div className="relative flex items-end gap-2 rounded-[1.4rem] border border-white/10 bg-[#07141f]/95 px-3 py-2.5 shadow-[0_18px_45px_rgba(0,0,0,.35)] backdrop-blur-2xl sm:px-4">
          <textarea
            value={value}
            onChange={(event) => setValue(event.target.value.slice(0, 2000))}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKeyDown}
            rows={1}
            aria-label="Message North Star Support Bot"
            placeholder="Type your message…"
            disabled={disabled}
            className="max-h-28 min-h-10 flex-1 resize-none bg-transparent px-1 py-2 text-sm leading-6 text-white outline-none placeholder:text-slate-600 disabled:cursor-not-allowed"
          />
          <motion.button
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            type="submit"
            disabled={disabled || !value.trim()}
            aria-label="Send message"
            className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-emerald-300/25 bg-emerald-400/12 text-emerald-100 transition hover:bg-emerald-400/20 disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            <SendHorizontal className="h-4 w-4" />
          </motion.button>
        </div>
      </div>
      <p className="mt-2 hidden text-center text-[10px] text-slate-700 sm:block">No API key required · responses use the provided project data only</p>
    </form>
  )
}
