import { FormEvent, useState } from 'react'
import { ArrowLeft, Check, RotateCcw, ShieldCheck } from 'lucide-react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { CompassLogo } from '../components/CompassLogo'
import { Starfield } from '../components/Starfield'

export function ReturnsPage() {
  const [prepared, setPrepared] = useState(false)
  const submit = (event: FormEvent) => {
    event.preventDefault()
    setPrepared(true)
  }
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#04101a] px-4 py-8 text-slate-100 sm:px-6">
      <Starfield />
      <div className="relative z-10 mx-auto max-w-4xl">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"><ArrowLeft className="h-4 w-4" /> Back to support chat</Link>
        <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="mt-6 overflow-hidden rounded-[28px] border border-white/10 bg-[#081722]/90 shadow-panel backdrop-blur-xl">
          <div className="border-b border-white/10 bg-[radial-gradient(circle_at_0%_0%,rgba(45,212,191,.18),transparent_36%)] px-6 py-7 sm:px-9">
            <div className="flex items-center gap-4"><CompassLogo className="h-14 w-14" /><div><p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-200/65">North Star Outfitters</p><h1 className="mt-1 font-display text-2xl font-semibold text-white sm:text-3xl">Simulated returns portal</h1></div></div>
            <p className="mt-5 max-w-2xl text-sm leading-6 text-slate-300">This page demonstrates where a production returns experience would connect. It does not submit a real return.</p>
          </div>
          <div className="grid gap-8 px-6 py-8 sm:px-9 lg:grid-cols-[1fr_.92fr]">
            <div>
              <h2 className="font-display text-xl font-semibold text-white">Return policy</h2>
              <p className="mt-3 text-sm leading-6 text-slate-400">North Star accepts returns within 30 days.</p>
              <div className="mt-5 space-y-3">
                {['The item must be unused', 'The original packaging is required'].map((item) => (
                  <div key={item} className="flex items-center gap-3 rounded-2xl border border-white/8 bg-white/[0.025] p-4 text-sm text-slate-200"><div className="grid h-8 w-8 place-items-center rounded-full bg-emerald-400/10 text-emerald-200"><Check className="h-4 w-4" /></div>{item}</div>
                ))}
              </div>
              <div className="mt-5 flex gap-3 rounded-2xl border border-amber-200/12 bg-amber-300/[0.045] p-4 text-sm leading-6 text-amber-100/75"><ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />No additional return rules, fees, or exceptions are implied by this assessment.</div>
            </div>
            <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-slate-950/35 p-5">
              <div className="flex items-center gap-2"><RotateCcw className="h-5 w-5 text-emerald-200" /><h2 className="font-display text-lg font-semibold text-white">Prepare a demo request</h2></div>
              <label className="mt-5 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Order number</label>
              <input required placeholder="111, 222, or 333" className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 text-sm text-white outline-none transition placeholder:text-slate-600 focus:border-emerald-300/40 focus:ring-2 focus:ring-emerald-300/15" />
              <label className="mt-4 block text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">Request type</label>
              <select className="mt-2 h-11 w-full rounded-xl border border-white/10 bg-[#0b1a25] px-3 text-sm text-white outline-none focus:border-emerald-300/40 focus:ring-2 focus:ring-emerald-300/15"><option>Return</option><option>Exchange</option></select>
              <button type="submit" className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl border border-emerald-300/25 bg-emerald-400/12 text-sm font-semibold text-emerald-50 transition hover:bg-emerald-400/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-300">Prepare simulated request</button>
              {prepared ? <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="mt-4 rounded-xl border border-emerald-300/20 bg-emerald-400/10 p-3 text-sm text-emerald-100"><span className="font-semibold">Demo request prepared.</span> Nothing has been submitted to a real system.</motion.div> : null}
            </form>
          </div>
        </motion.div>
      </div>
    </div>
  )
}
