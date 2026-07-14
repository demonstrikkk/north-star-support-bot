import { motion } from 'framer-motion'
import { CompassLogo } from './CompassLogo'

export function TypingIndicator() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex max-w-[90%] items-center gap-2">
      <CompassLogo className="h-8 w-8 shrink-0" />
      <div className="flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/55 px-4 py-3 text-xs text-slate-400">
        North Star is thinking
        <span className="flex gap-1">
          {[0, 1, 2].map((index) => (
            <motion.span key={index} className="h-1.5 w-1.5 rounded-full bg-emerald-300" animate={{ opacity: [0.25, 1, 0.25], y: [0, -2, 0] }} transition={{ repeat: Infinity, duration: 1, delay: index * 0.16 }} />
          ))}
        </span>
      </div>
    </motion.div>
  )
}
