import { motion } from 'framer-motion'
import { cn } from '../lib/utils'

export function CompassLogo({ className }: { className?: string }) {
  return (
    <div className={cn('relative grid place-items-center rounded-full border border-amber-100/35 bg-slate-950/60 shadow-[0_0_30px_rgba(74,222,128,.2)]', className)}>
      <motion.svg
        viewBox="0 0 100 100"
        className="h-[72%] w-[72%] text-amber-100"
        animate={{ rotate: [0, 1.2, 0, -1.2, 0] }}
        transition={{ repeat: Infinity, duration: 8, ease: 'easeInOut' }}
        aria-hidden="true"
      >
        <circle cx="50" cy="50" r="42" fill="none" stroke="currentColor" strokeOpacity=".5" strokeWidth="1.8" />
        <circle cx="50" cy="50" r="26" fill="none" stroke="currentColor" strokeOpacity=".28" strokeWidth="1.2" />
        <path d="M50 4 59 39 96 50 59 61 50 96 41 61 4 50 41 39Z" fill="currentColor" fillOpacity=".16" stroke="currentColor" strokeWidth="1.6" />
        <path d="M50 13 57 43 87 50 57 57 50 87 43 57 13 50 43 43Z" fill="currentColor" />
        <path d="M50 18 50 50 57 43Z" fill="#5eead4" />
        <circle cx="50" cy="50" r="5" fill="#f8fafc" stroke="#0f766e" strokeWidth="2" />
      </motion.svg>
      <div className="absolute inset-0 rounded-full bg-[conic-gradient(from_180deg,transparent,rgba(45,212,191,.35),transparent,rgba(167,139,250,.25),transparent)] opacity-50 blur-md" />
    </div>
  )
}
