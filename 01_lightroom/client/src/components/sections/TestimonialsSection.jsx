import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import RevealOnScroll from '../ui/RevealOnScroll'

const testimonials = [
  { name:'Priya & Rahul Verma', event:'Wedding · Delhi', quote:'Every frame from our wedding was pure magic. The Lightroom team captured the very essence of our love story. We revisit these photos every anniversary.', initial:'P' },
  { name:'Ananya & Dev Sharma', event:'Pre-Wedding · Shimla', quote:'Our pre-wedding shoot in the mountains was unforgettable. The team made us feel completely comfortable, and the results were breathtaking. Truly world-class!', initial:'A' },
  { name:'Sunita Malhotra', event:'Birthday Photography · Mumbai', quote:'From the initial consultation to delivering the final gallery, the professionalism was impeccable. My daughter\'s birthday was captured with such warmth and creativity.', initial:'S' },
  { name:'Rajesh Nair', event:'Corporate Event · Bangalore', quote:'The corporate event photography was outstanding. Every key moment was captured with precision and elegance. Our stakeholders were thoroughly impressed.', initial:'R' },
]

export default function TestimonialsSection() {
  const [idx, setIdx] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setIdx(p => (p + 1) % testimonials.length), 5000)
    return () => clearInterval(t)
  }, [])

  return (
    <section className="py-24 px-[5%] overflow-hidden">
      <RevealOnScroll className="text-center mb-14">
        <span className="section-label">Client Stories</span>
        <h2 className="section-title">Words That <em className="text-gold italic">Inspire</em> Us</h2>
      </RevealOnScroll>

      <div className="max-w-3xl mx-auto relative">
        <AnimatePresence mode="wait">
          <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}
            className="bg-card border border-border p-10 text-center">
            <div className="text-gold font-serif text-5xl leading-none mb-4">"</div>
            <p className="font-serif text-xl italic font-light text-cream leading-relaxed mb-8">
              {testimonials[idx].quote}
            </p>
            <div className="flex items-center justify-center gap-4">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#2a1f0a] to-[#3d2e10] border-2 border-gold flex items-center justify-center font-serif text-xl text-gold">
                {testimonials[idx].initial}
              </div>
              <div className="text-left">
                <div className="flex gap-0.5 mb-1">{Array(5).fill(0).map((_,i)=><Star key={i} size={12} fill="#c6a55c" strokeWidth={0}/>)}</div>
                <p className="text-sm font-medium">{testimonials[idx].name}</p>
                <p className="text-gold text-[0.65rem] uppercase tracking-wider">{testimonials[idx].event}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-center gap-3 mt-6">
          <button onClick={() => setIdx(p => (p - 1 + testimonials.length) % testimonials.length)}
            className="w-8 h-8 border border-border text-grey-light hover:border-gold hover:text-gold flex items-center justify-center transition-all">
            <ChevronLeft size={14} />
          </button>
          {testimonials.map((_, i) => (
            <button key={i} onClick={() => setIdx(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === idx ? 'bg-gold w-6' : 'bg-border w-1.5 hover:bg-grey'}`} />
          ))}
          <button onClick={() => setIdx(p => (p + 1) % testimonials.length)}
            className="w-8 h-8 border border-border text-grey-light hover:border-gold hover:text-gold flex items-center justify-center transition-all">
            <ChevronRight size={14} />
          </button>
        </div>
      </div>
    </section>
  )
}
