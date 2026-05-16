import { motion } from 'framer-motion'
import { useInView } from 'framer-motion'
import { useRef } from 'react'

export default function RevealOnScroll({ children, direction = 'up', delay = 0, className = '' }) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: true, margin: '-80px' })
  const variants = {
    up: { hidden: { opacity: 0, y: 40 }, visible: { opacity: 1, y: 0 } },
    left: { hidden: { opacity: 0, x: -40 }, visible: { opacity: 1, x: 0 } },
    right: { hidden: { opacity: 0, x: 40 }, visible: { opacity: 1, x: 0 } },
    fade: { hidden: { opacity: 0 }, visible: { opacity: 1 } },
  }
  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? 'visible' : 'hidden'}
      variants={variants[direction]} transition={{ duration: 0.8, delay, ease: [0.25, 0.46, 0.45, 0.94] }}
      className={className}>
      {children}
    </motion.div>
  )
}
