import { useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'

function Counter({ to, suffix = '', duration = 2000 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true })

  useEffect(() => {
    if (!isInView) return
    const start = Date.now()
    const timer = setInterval(() => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * to))
      if (progress === 1) clearInterval(timer)
    }, 16)
    return () => clearInterval(timer)
  }, [isInView, to, duration])

  return <span ref={ref}>{count}{suffix}</span>
}

const stats = [
  { num: 1247, suffix: '+', label: 'Events Covered', desc: 'Weddings, birthdays, corporate' },
  { num: 98, suffix: '%', label: 'Client Satisfaction', desc: 'Based on post-shoot surveys' },
  { num: 47, suffix: '', label: 'Awards & Recognition', desc: 'National & international' },
  { num: 10, suffix: '+', label: 'Years of Excellence', desc: 'In the industry since 2014' },
]

export default function StatsCounter() {
  return (
    <section className="py-20 px-[5%] bg-gradient-to-r from-[#0f0e0a] via-[#1a1508] to-[#0f0e0a] border-y border-border">
      <div className="max-w-5xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4 divide-x-0 lg:divide-x lg:divide-border">
        {stats.map((s, i) => (
          <div key={s.label} className="text-center px-4">
            <div className="font-serif text-4xl lg:text-5xl text-gold font-light mb-1">
              <Counter to={s.num} suffix={s.suffix} />
            </div>
            <h3 className="text-sm font-medium mb-1">{s.label}</h3>
            <p className="text-grey text-xs">{s.desc}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
