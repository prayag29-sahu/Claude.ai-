import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Camera } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

export default function FloatingButtons() {
  const [show, setShow] = useState(false)
  useEffect(() => {
    const handler = () => setShow(window.scrollY > 200)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <AnimatePresence>
      {show && (
        <>
          <motion.a initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            href="https://wa.me/919876543210" target="_blank" rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25d366] flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform">
            <MessageCircle size={24} fill="white" strokeWidth={0} />
          </motion.a>
          <motion.div initial={{ x: -60, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -60, opacity: 0 }}
            className="fixed bottom-6 left-6 z-50 md:hidden">
            <Link to="/booking" className="bg-gold text-black px-5 py-3 text-[0.7rem] tracking-widest uppercase font-medium flex items-center gap-2 shadow-[0_4px_20px_rgba(198,165,92,0.3)]">
              <Camera size={14} /> Book Now
            </Link>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
