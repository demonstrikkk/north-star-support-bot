import { motion, useReducedMotion } from 'framer-motion'

const stars = Array.from({ length: 70 }, (_, index) => ({
  id: index,
  left: `${(index * 37.17) % 100}%`,
  top: `${(index * 61.03) % 100}%`,
  size: 1 + (index % 3),
  delay: (index % 11) * 0.3,
  duration: 3.5 + (index % 7) * 0.35,
}))

export function Starfield() {
  const reduceMotion = useReducedMotion()
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_45%_-10%,rgba(28,91,113,.34),transparent_45%),radial-gradient(circle_at_86%_8%,rgba(48,41,104,.22),transparent_35%),linear-gradient(180deg,#04101a_0%,#071521_52%,#061019_100%)]" />
      <div className="absolute -left-44 top-1/4 h-[38rem] w-[38rem] rounded-full bg-emerald-400/10 blur-[120px]" />
      <div className="absolute -right-40 bottom-[-10rem] h-[36rem] w-[36rem] rounded-full bg-violet-500/10 blur-[130px]" />
      {stars.map((star) => (
        <motion.span
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{ left: star.left, top: star.top, width: star.size, height: star.size }}
          animate={reduceMotion ? undefined : { opacity: [0.15, 0.8, 0.15], scale: [1, 1.4, 1] }}
          transition={{ repeat: Infinity, duration: star.duration, delay: star.delay, ease: 'easeInOut' }}
        />
      ))}
      <div className="absolute inset-0 opacity-[0.075] [background-image:linear-gradient(rgba(255,255,255,.12)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.12)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent_80%)]" />
    </div>
  )
}
