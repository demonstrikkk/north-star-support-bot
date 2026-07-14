import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { SendHorizontal, Sparkles } from 'lucide-react'
import { cn } from '../lib/utils'

export function ChatComposer({ onSubmit, disabled, isTyping }: { onSubmit: (value: string) => void; disabled?: boolean; isTyping?: boolean }) {
  const [value, setValue] = useState('')
  const [focused, setFocused] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  useEffect(() => {
    const textarea = textareaRef.current
    if (!textarea) return
    textarea.style.height = '0px'
    textarea.style.height = `${Math.min(textarea.scrollHeight, 112)}px`
  }, [value])

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

  const isActive = focused || isTyping || value.trim().length > 0

  return (
    <form onSubmit={handleSubmit} className="relative px-3 pb-[max(.75rem,env(safe-area-inset-bottom))] pt-2 sm:px-5 sm:pb-4">
      <div className={cn('aurora-composer relative rounded-[2rem] p-[1px]', isActive && 'aurora-composer-active')}>
        <div className="gemini-input-inner relative z-[1] flex items-end gap-3 rounded-[calc(2rem-1px)] border border-white/6 bg-[#161a20]/96 px-4 py-3 shadow-[0_18px_45px_rgba(0,0,0,.32)] backdrop-blur-2xl sm:px-5">
          <div className="mt-1 grid h-10 w-10 shrink-0 place-items-center rounded-full border border-white/8 bg-white/[0.035] text-slate-300 shadow-[inset_0_1px_0_rgba(255,255,255,.04)]">
            <Sparkles className="h-[18px] w-[18px] text-cyan-200" />
          </div>
          <textarea
            ref={textareaRef}
            value={value}
            onChange={(event) => setValue(event.target.value.slice(0, 2000))}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onKeyDown={handleKeyDown}
            rows={1}
            aria-label="Message North Star Support Bot"
            aria-describedby="chat-composer-hint"
            placeholder="Ask North Star Support..."
            disabled={disabled}
            className="max-h-28 min-h-[44px] flex-1 resize-none bg-transparent py-[10px] text-[15px] leading-6 text-white outline-none placeholder:text-slate-500 disabled:cursor-not-allowed"
          />
          <div className="flex shrink-0 items-center gap-2 self-end pb-0.5">
            <span className="hidden rounded-full border border-white/8 bg-white/[0.03] px-2.5 py-1 text-[10px] font-medium uppercase tracking-[0.14em] text-slate-500 sm:inline-flex">
              Shift+Enter newline
            </span>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              type="submit"
              disabled={disabled || !value.trim()}
              aria-label="Send message"
              className="grid h-11 w-11 place-items-center rounded-full border border-white/10 bg-white/[0.04] text-slate-200 transition hover:bg-white/[0.08] disabled:cursor-not-allowed disabled:opacity-35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-300"
            >
              <SendHorizontal className="h-4 w-4" />
            </motion.button>
          </div>
        </div>
      </div>
      <div id="chat-composer-hint" className="mt-2 flex items-center justify-between gap-3 px-1 text-[10px] text-slate-600">
        <p className="hidden sm:block">No API key required.</p>
        <p className="ml-auto">Grounded only in the provided project data.</p>
      </div>
    </form>
  )
}
