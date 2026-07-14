import { Headphones, PackageCheck, ShieldCheck, Truck } from 'lucide-react'
import { CompassLogo } from './CompassLogo'

const features = [
  { icon: ShieldCheck, title: '30-day returns', detail: 'Unused items, original packaging' },
  { icon: Truck, title: 'Fast shipping', detail: '3–5 days standard' },
  { icon: Headphones, title: 'Human handoff', detail: 'A clear simulated escalation' },
]

export function BrandRail() {
  return (
    <aside className="relative hidden min-h-0 overflow-hidden border-r border-white/10 xl:flex xl:w-[282px] xl:flex-col">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(45,212,191,.32),transparent_30%),linear-gradient(180deg,rgba(4,20,30,.8),rgba(2,9,14,.98))]" />
      <div className="absolute inset-x-0 bottom-0 h-[58%] bg-[linear-gradient(180deg,transparent,rgba(2,10,15,.65)),radial-gradient(ellipse_at_bottom,rgba(12,74,62,.45),transparent_62%)]" />
      <div className="absolute -left-20 top-40 h-72 w-72 rounded-full bg-emerald-400/15 blur-[80px]" />
      <div className="relative z-10 flex h-full min-h-0 flex-col gap-8 px-7 py-8">
        <div className="flex flex-col items-center text-center">
          <CompassLogo className="h-20 w-20" />
          <h1 className="mt-5 font-display text-xl font-semibold tracking-[0.22em] text-white">NORTH STAR</h1>
          <p className="text-[10px] tracking-[0.42em] text-amber-100/70">OUTFITTERS</p>
          <p className="mt-6 max-w-[15rem] font-display text-[1.75rem] font-semibold leading-[1.12] text-white">
            Adventure guided. Support that feels stellar.
          </p>
        </div>

        <div className="space-y-4">
          {features.map(({ icon: FeatureIcon, title, detail }) => (
            <div key={title} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.035] p-3 backdrop-blur-sm">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-emerald-300/20 bg-emerald-400/10 text-emerald-200">
                <FeatureIcon className="h-4 w-4" />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-100">{title}</p>
                <p className="mt-0.5 text-xs leading-5 text-slate-400">{detail}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-auto space-y-4 pb-1">
          <div className="rounded-2xl border border-amber-100/12 bg-slate-950/45 p-4 backdrop-blur-md">
            <div className="flex items-center gap-2 text-xs font-semibold text-amber-100">
              <Truck className="h-4 w-4" /> Shipping at a glance
            </div>
            <div className="mt-3 space-y-2 text-xs text-slate-400">
              <div className="flex justify-between gap-4"><span>Standard</span><span className="text-slate-200">3–5 business days</span></div>
              <div className="flex justify-between gap-4"><span>Expedited</span><span className="text-slate-200">1–2 business days</span></div>
            </div>
          </div>
          <div className="rounded-2xl border border-emerald-300/20 bg-emerald-500/10 p-4">
            <div className="flex gap-3">
              <PackageCheck className="mt-0.5 h-5 w-5 text-emerald-300" />
              <div>
                <p className="text-sm font-semibold text-emerald-50">No account or API key</p>
                <p className="mt-1 text-xs leading-5 text-emerald-100/60">Fully testable with deterministic business logic.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}
