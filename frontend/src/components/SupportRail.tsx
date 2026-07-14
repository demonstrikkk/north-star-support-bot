import { ChevronRight, CircleHelp, Headphones, ShieldCheck } from 'lucide-react'

const questions = [
  ['How do I track my order?', 'intent_order_tracking'],
  ['What is your return policy?', 'intent_returns'],
  ['How long does shipping take?', 'intent_shipping'],
  ['Can I exchange an item?', 'intent_returns'],
]

export function SupportRail({ onAction }: { onAction: (value: string) => void }) {
  return (
    <aside className="hidden w-[280px] shrink-0 border-l border-white/10 bg-slate-950/25 p-5 xl:block">
      <div className="rounded-2xl border border-white/10 bg-slate-950/45 backdrop-blur-xl">
        <div className="flex items-center gap-2 border-b border-white/10 px-4 py-4 text-sm font-semibold text-slate-100">
          <CircleHelp className="h-4 w-4 text-amber-200" /> Popular questions
        </div>
        <div className="divide-y divide-white/8">
          {questions.map(([label, value]) => (
            <button
              key={label}
              onClick={() => onAction(value)}
              className="group flex w-full items-center justify-between gap-3 px-4 py-4 text-left text-sm text-slate-300 transition hover:bg-white/[0.04] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-300"
            >
              <span>{label}</span>
              <ChevronRight className="h-4 w-4 text-slate-500 transition group-hover:translate-x-0.5 group-hover:text-emerald-300" />
            </button>
          ))}
        </div>
      </div>

      <div className="relative mt-5 overflow-hidden rounded-2xl border border-emerald-200/15 bg-[radial-gradient(circle_at_50%_0%,rgba(45,212,191,.2),transparent_44%),linear-gradient(180deg,#0c1e2c,#07131d)] p-5">
        <div className="absolute inset-x-0 bottom-0 h-28 bg-[radial-gradient(ellipse_at_bottom,rgba(34,197,94,.2),transparent_70%)]" />
        <div className="relative">
          <div className="grid h-10 w-10 place-items-center rounded-full border border-emerald-300/20 bg-emerald-400/10 text-emerald-200">
            <Headphones className="h-5 w-5" />
          </div>
          <h3 className="mt-4 font-display text-lg font-semibold text-white">Need more help?</h3>
          <p className="mt-2 text-sm leading-6 text-slate-400">Move into a clear simulated handoff without losing the conversation context.</p>
          <button
            onClick={() => onAction('intent_handoff')}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-300/30 bg-emerald-400/10 px-4 py-3 text-sm font-semibold text-emerald-50 transition hover:-translate-y-0.5 hover:bg-emerald-400/15 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300"
          >
            <Headphones className="h-4 w-4" /> Talk to a live agent
          </button>
        </div>
      </div>

      <div className="mt-5 flex gap-3 rounded-2xl border border-white/8 bg-white/[0.025] p-4 text-xs leading-5 text-slate-400">
        <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
        The bot uses only the supplied order, return, and shipping data. Unsupported details are never invented.
      </div>
    </aside>
  )
}
