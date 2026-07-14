import { motion } from 'framer-motion'
import { cn } from '../lib/utils'
import type { ChatAction } from '../types/chat'
import { Icon } from './Icon'

export function ActionButton({ action, onClick, disabled = false }: { action: ChatAction; onClick: () => void; disabled?: boolean }) {
  const variants = {
    primary: 'border-emerald-300/30 bg-emerald-400/12 text-emerald-50 hover:bg-emerald-400/20',
    secondary: 'border-amber-100/16 bg-white/[0.025] text-slate-200 hover:border-emerald-300/25 hover:bg-white/[0.06]',
    ghost: 'border-transparent bg-transparent text-slate-400 hover:bg-white/[0.05] hover:text-slate-200',
    danger: 'border-rose-300/20 bg-rose-400/10 text-rose-100 hover:bg-rose-400/15',
  }
  return (
    <motion.button
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'inline-flex min-h-10 items-center disabled:cursor-default disabled:opacity-45 disabled:hover:translate-y-0 justify-center gap-2 rounded-xl border px-3.5 py-2 text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300',
        variants[action.variant ?? 'secondary'],
      )}
    >
      <Icon name={action.icon} className="h-4 w-4 shrink-0" />
      <span>{action.label}</span>
    </motion.button>
  )
}
