import { Menu, RotateCcw } from 'lucide-react'
import { CompassLogo } from './CompassLogo'

export function ChatHeader({ onMenu, onRestart }: { onMenu: () => void; onRestart: () => void }) {
  return (
    <header className="relative z-20 flex h-[74px] shrink-0 items-center justify-between border-b border-white/10 bg-[#06131d]/75 px-4 backdrop-blur-2xl sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <CompassLogo className="h-11 w-11 shrink-0" />
        <div className="min-w-0">
          <h2 className="truncate font-display text-base font-semibold text-white sm:text-lg">North Star Support Bot</h2>
          <div className="mt-1 flex items-center gap-2 text-xs text-slate-400">
            <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_12px_rgba(74,222,128,.75)]" /> Online · fully testable
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onMenu}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        >
          <Menu className="h-4 w-4" /> <span className="hidden sm:inline">Main menu</span>
        </button>
        <button
          onClick={onRestart}
          className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm font-medium text-slate-200 transition hover:bg-white/[0.07] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
        >
          <RotateCcw className="h-4 w-4" /> <span className="hidden sm:inline">Restart</span>
        </button>
      </div>
    </header>
  )
}
