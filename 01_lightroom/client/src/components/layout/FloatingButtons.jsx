import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { MessageCircle, Camera } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const WHATSAPP_NUMBER = '919109422772'

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
          {/* WhatsApp floating button */}
          <motion.a
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            href={`https://wa.me/${WHATSAPP_NUMBER}?text=Hi%2C%20I%27m%20interested%20in%20your%20photography%20packages.`}
            target="_blank" rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25d366] flex items-center justify-center shadow-[0_4px_20px_rgba(37,211,102,0.4)] hover:scale-110 transition-transform"
          >
            <MessageCircle size={24} fill="white" strokeWidth={0} />
          </motion.a>

          {/* Mobile sticky CTA → Contact (not booking) */}
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -60, opacity: 0 }}
            className="fixed bottom-6 left-6 z-50 md:hidden"
          >
            <Link
              to="/contact"
              className="bg-gold text-black px-5 py-3 text-[0.7rem] tracking-widest uppercase font-medium flex items-center gap-2 shadow-[0_4px_20px_rgba(198,165,92,0.3)]"
            >
              <Camera size={14} /> Get a Quote
            </Link>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
