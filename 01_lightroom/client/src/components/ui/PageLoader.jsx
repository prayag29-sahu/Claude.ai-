import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function PageLoader() {
  const [visible, setVisible] = useState(true)
  useEffect(() => { const t = setTimeout(() => setVisible(false), 1800); return () => clearTimeout(t) }, [])
  return (
    <AnimatePresence>
      {visible && (
        <motion.div exit={{ opacity: 0, transition: { duration: 0.5, delay: 0.2 } }}
          className="fixed inset-0 bg-black z-[9000] flex flex-col items-center justify-center gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="font-serif text-3xl text-cream">
            The <span className="text-gold italic">Lightroom</span>
          </motion.div>
          <div className="w-48 h-px bg-border overflow-hidden">
            <motion.div initial={{ x: '-100%' }} animate={{ x: '0%' }} transition={{ duration: 1.4, ease: 'easeInOut' }}
              className="h-full bg-gold" />
          </div>
          <p className="text-grey text-[0.65rem] tracking-[0.25em] uppercase">Where Light Meets Emotion</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
