import {
  AlertCircle,
  ArrowRight,
  Check,
  MessageCircle,
  Package,
  RotateCcw,
  Sparkles,
  Star,
  Truck,
  User,
} from 'lucide-react'
import type { BotMessagePayload } from '../types/chat'

function SectionShell({ children, accent = 'emerald' }: { children: React.ReactNode; accent?: 'emerald' | 'amber' | 'violet' | 'rose' }) {
  const glows = {
    emerald: 'from-emerald-300/15 via-cyan-300/5 to-transparent',
    amber: 'from-amber-200/15 via-yellow-300/5 to-transparent',
    violet: 'from-violet-300/15 via-fuchsia-300/5 to-transparent',
    rose: 'from-rose-300/15 via-orange-300/5 to-transparent',
  }
  return (
    <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#0a1823]/92 p-4 shadow-[0_20px_50px_rgba(0,0,0,.24)] sm:p-5">
      <div className={`pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r ${glows[accent]}`} />
      {children}
    </div>
  )
}

export function MessageCard({ payload }: { payload: BotMessagePayload }) {
  if (payload.type === 'welcome') {
    return (
      <SectionShell>
        <h3 className="font-display text-base font-semibold text-white sm:text-lg">{payload.title}</h3>
        <p className="mt-3 text-sm leading-6 text-slate-300">{payload.text}</p>
        <p className="mt-3 text-sm font-medium text-emerald-100">{payload.subtitle}</p>
      </SectionShell>
    )
  }

  if (payload.type === 'order_status') {
    const step = Number(payload.data.step ?? 0)
    const valid = Boolean(payload.data.valid)
    const stages = ['Placed', 'Processing', 'Shipped', 'Out for delivery', 'Delivered']
    return (
      <SectionShell accent={valid ? 'emerald' : 'rose'}>
        <div className="flex items-start gap-3">
          <div className={`grid h-11 w-11 shrink-0 place-items-center rounded-full border ${valid ? 'border-emerald-300/25 bg-emerald-400/10 text-emerald-200' : 'border-rose-300/20 bg-rose-400/10 text-rose-200'}`}>
            {valid ? <Package className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="font-display text-lg font-semibold text-white">{payload.title}</h3>
              <span className={`rounded-md px-2 py-1 text-xs font-semibold ${valid ? 'bg-emerald-400/15 text-emerald-200' : 'bg-rose-400/15 text-rose-200'}`}>{payload.status}</span>
            </div>
            <p className="mt-1 text-sm text-slate-300">{payload.detail}</p>
          </div>
        </div>
        {valid ? (
          <>
            <div className="mt-5 sm:hidden">
              <div className="flex items-center justify-between text-[11px] text-slate-500">
                <span>Placed</span><span>{payload.status}</span><span>Delivered</span>
              </div>
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-gradient-to-r from-emerald-300 via-cyan-300 to-violet-300" style={{ width: `${Math.max(12, (step / 4) * 100)}%` }} />
              </div>
            </div>
            <div className="mt-6 hidden overflow-x-auto pb-1 sm:block">
              <div className="flex min-w-[510px] items-start">
              {stages.map((stage, index) => {
                const completed = index <= step
                return (
                  <div key={stage} className="relative flex flex-1 flex-col items-center text-center">
                    {index > 0 ? <div className={`absolute right-1/2 top-4 h-px w-full ${index <= step ? 'bg-emerald-400/70' : 'bg-white/15'}`} /> : null}
                    <div className={`relative z-10 grid h-8 w-8 place-items-center rounded-full border ${completed ? 'border-emerald-300/40 bg-emerald-400/15 text-emerald-200 shadow-[0_0_18px_rgba(74,222,128,.18)]' : 'border-white/15 bg-slate-950/80 text-slate-600'}`}>
                      {completed ? <Check className="h-4 w-4" /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                    </div>
                    <span className={`mt-2 text-[11px] ${completed ? 'text-slate-300' : 'text-slate-600'}`}>{stage}</span>
                  </div>
                )
              })}
              </div>
            </div>
          </>
        ) : null}
      </SectionShell>
    )
  }

  if (payload.type === 'policy_card') {
    const requirements = (payload.data.requirements as string[]) ?? []
    return (
      <SectionShell accent="amber">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-items-center rounded-full border border-amber-200/20 bg-amber-300/10 text-amber-100"><RotateCcw className="h-5 w-5" /></div>
          <div><h3 className="font-display text-lg font-semibold text-white">{payload.title}</h3><p className="mt-1 text-sm text-slate-300">{payload.text}</p></div>
        </div>
        <div className="mt-4 grid gap-2 sm:grid-cols-2">
          {requirements.map((requirement) => (
            <div key={requirement} className="flex items-center gap-2 rounded-xl border border-white/8 bg-white/[0.025] px-3 py-3 text-sm text-slate-300">
              <Check className="h-4 w-4 shrink-0 text-emerald-300" /> {requirement}
            </div>
          ))}
        </div>
      </SectionShell>
    )
  }

  if (payload.type === 'shipping_card') {
    return (
      <SectionShell>
        <div className="flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-full border border-cyan-200/20 bg-cyan-300/10 text-cyan-100"><Truck className="h-5 w-5" /></div><h3 className="font-display text-lg font-semibold text-white">{payload.title}</h3></div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <div className="rounded-xl border border-white/8 bg-white/[0.025] p-4"><p className="text-xs uppercase tracking-[0.18em] text-slate-500">Standard</p><p className="mt-2 text-base font-semibold text-white">{String(payload.data.standard)}</p></div>
          <div className="rounded-xl border border-emerald-300/15 bg-emerald-400/[0.045] p-4"><p className="text-xs uppercase tracking-[0.18em] text-emerald-300/60">Expedited</p><p className="mt-2 text-base font-semibold text-white">{String(payload.data.expedited)}</p></div>
        </div>
      </SectionShell>
    )
  }

  if (payload.type === 'recommendation_question') {
    const step = Number(payload.data.step ?? 1)
    return (
      <SectionShell accent="violet">
        <div className="flex items-start gap-3"><div className="grid h-10 w-10 place-items-center rounded-full border border-violet-200/20 bg-violet-300/10 text-violet-100"><Sparkles className="h-5 w-5" /></div><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-200/60">Step {step} of 2</p><h3 className="mt-1 font-display text-lg font-semibold text-white">{payload.title}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{payload.text}</p></div></div>
        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/8"><div className="h-full rounded-full bg-gradient-to-r from-emerald-300 to-violet-300 transition-all" style={{ width: `${step * 50}%` }} /></div>
      </SectionShell>
    )
  }

  if (payload.type === 'recommendation_result') {
    return (
      <SectionShell accent="violet">
        <div className="flex items-start gap-3"><div className="grid h-11 w-11 place-items-center rounded-full border border-violet-200/20 bg-violet-300/10 text-violet-100"><Sparkles className="h-5 w-5" /></div><div><p className="text-xs font-semibold uppercase tracking-[0.16em] text-violet-200/60">Recommended category</p><h3 className="mt-1 font-display text-xl font-semibold text-white">{payload.title}</h3><p className="mt-3 text-sm leading-6 text-slate-300">{payload.text}</p></div></div>
      </SectionShell>
    )
  }

  if (payload.type === 'live_agent') {
    const agentName = String(payload.data.agent_name ?? 'Support Agent')
    const greeting = String(payload.data.agent_greeting ?? '')
    return (
      <>
        <div className="relative flex items-center gap-3 py-2">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
          <span className="whitespace-nowrap text-[10px] uppercase tracking-[0.18em] text-slate-600">Bot conversation ended</span>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-400/30 to-transparent" />
        </div>

        <div className="overflow-hidden rounded-2xl border border-emerald-300/15 bg-gradient-to-br from-emerald-900/40 to-[#0a1823]/92 p-4 shadow-[0_20px_50px_rgba(0,0,0,.24)] sm:p-5">
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-emerald-300/15 via-cyan-300/5 to-transparent" />

          <div className="flex items-start gap-3">
            <div className="grid h-12 w-12 shrink-0 place-items-center rounded-full border border-emerald-300/20 bg-gradient-to-br from-emerald-500/20 to-emerald-800/20 text-emerald-200 shadow-[0_0_20px_rgba(52,211,153,.12)]">
              <User className="h-5 w-5" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-display text-base font-semibold text-white">{agentName}</span>
                <span className="flex items-center gap-1 rounded-md bg-emerald-400/12 px-2 py-0.5 text-[11px] font-medium text-emerald-200">
                  <MessageCircle className="h-3 w-3" /> Customer Support
                </span>
              </div>
              {greeting ? (
                <p className="mt-3 text-sm leading-6 text-slate-200">{greeting}</p>
              ) : null}
              <p className="mt-2 text-xs text-slate-500">Usually responds in a few seconds</p>
            </div>
          </div>

          <div className="mt-5 h-px bg-white/8" />

          <div className="mt-4 grid gap-2 sm:grid-cols-2">
            <div className="rounded-xl border border-white/8 bg-white/[0.025] p-3">
              <p className="text-xs text-slate-500">Issue</p>
              <p className="mt-1 text-sm font-medium text-white">{String(payload.data.issue)}</p>
            </div>
            <div className="rounded-xl border border-white/8 bg-white/[0.025] p-3">
              <p className="text-xs text-slate-500">Conversation context</p>
              <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-emerald-200">
                <Check className="h-4 w-4" /> Preserved
              </p>
            </div>
          </div>
        </div>
      </>
    )
  }

  if (payload.type === 'fallback') {
    return (
      <SectionShell accent="rose">
        <div className="flex items-start gap-3"><div className="grid h-10 w-10 place-items-center rounded-full border border-rose-200/20 bg-rose-300/10 text-rose-100"><AlertCircle className="h-5 w-5" /></div><div><h3 className="font-display text-base font-semibold text-white">{payload.title}</h3><p className="mt-2 text-sm leading-6 text-slate-300">{payload.text}</p></div></div>
      </SectionShell>
    )
  }

  if (payload.type === 'chat_ended') {
    return (
      <SectionShell accent="violet">
        <div className="flex items-start gap-3">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-full border border-violet-200/20 bg-violet-300/10 text-violet-100">
            <Star className="h-5 w-5" />
          </div>
          <div>
            <h3 className="font-display text-lg font-semibold text-white">{payload.title}</h3>
            <p className="mt-2 text-sm leading-6 text-slate-300">{payload.text}</p>
          </div>
        </div>
      </SectionShell>
    )
  }

  return (
    <SectionShell>
      {payload.title ? <h3 className="font-display text-base font-semibold text-white">{payload.title}</h3> : null}
      <p className="text-sm leading-6 text-slate-300">{payload.text}</p>
      {payload.subtitle ? <p className="mt-2 flex items-center gap-1 text-sm text-emerald-200">{payload.subtitle}<ArrowRight className="h-4 w-4" /></p> : null}
    </SectionShell>
  )
}
