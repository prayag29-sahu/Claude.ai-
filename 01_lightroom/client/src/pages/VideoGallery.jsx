import { useState } from 'react'
import { Play, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import RevealOnScroll from '../components/ui/RevealOnScroll'

const videos = [
  { title:'The Mehta Wedding Film', type:'Wedding Cinema', year:2024, color:'from-[#1c1408] to-[#2a1c08]' },
  { title:"Aryan's Sweet 16 Highlights", type:'Birthday Highlight', year:2024, color:'from-[#1a1208] to-[#2c1e08]' },
  { title:'Priya & Rohan – Shimla', type:'Pre-Wedding Film', year:2024, color:'from-[#0f1a10] to-[#1a2a18]' },
  { title:'TechCorp Annual Gala', type:'Corporate Event', year:2024, color:'from-[#151015] to-[#201520]' },
  { title:'Kavya – Fashion Editorial', type:'Model Reel', year:2024, color:'from-[#0f0f18] to-[#181820]' },
  { title:'The Sharma Bridal Story', type:'Bridal Cinema', year:2024, color:'from-[#1a100a] to-[#2a180e]' },
  { title:'Riya & Arjun – Engagement', type:'Engagement Film', year:2023, color:'from-[#0f1a15] to-[#142516]' },
  { title:'Baby Aarav – First Month', type:'Baby Shoot', year:2023, color:'from-[#1a1a10] to-[#252510]' },
  { title:'FashionWeek Delhi 2023', type:'Fashion Event', year:2023, color:'from-[#18101a] to-[#281528]' },
]

export default function VideoGallery() {
  const [active, setActive] = useState(null)

  return (
    <div className="min-h-screen pt-24 pb-16 px-[5%]">
      <RevealOnScroll className="text-center mb-14">
        <span className="section-label">Films</span>
        <h1 className="section-title">Cinematic <em className="text-gold italic">Highlights</em></h1>
        <div className="divider mx-auto" />
        <p className="text-grey-light text-sm max-w-lg mx-auto">Every film we create is a cinematic journey — carefully crafted to tell your unique story.</p>
      </RevealOnScroll>

      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {videos.map((v, i) => (
          <RevealOnScroll key={v.title} delay={i * 0.06}>
            <div className="relative overflow-hidden group cursor-pointer aspect-video bg-card border border-border"
              onClick={() => setActive(v)}>
              <div className={`absolute inset-0 bg-gradient-to-br ${v.color} group-hover:scale-105 transition-transform duration-500`} />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-gold/90 flex items-center justify-center group-hover:scale-110 group-hover:bg-gold transition-all duration-300 shadow-[0_0_30px_rgba(198,165,92,0.3)]">
                  <Play size={20} fill="black" strokeWidth={0} className="ml-1" />
                </div>
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                <h4 className="font-serif text-base font-light">{v.title}</h4>
                <span className="text-gold text-[0.62rem] uppercase tracking-wider">{v.type} · {v.year}</span>
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black/97 flex items-center justify-center p-4"
            onClick={() => setActive(null)}>
            <button className="absolute top-5 right-5 w-10 h-10 border border-border text-grey-light hover:text-white hover:border-white flex items-center justify-center">
              <X size={18} />
            </button>
            <div className="max-w-4xl w-full" onClick={e => e.stopPropagation()}>
              <div className={`bg-gradient-to-br ${active.color} w-full aspect-video flex flex-col items-center justify-center gap-4`}>
                <div className="w-16 h-16 rounded-full bg-gold/90 flex items-center justify-center">
                  <Play size={24} fill="black" strokeWidth={0} className="ml-1" />
                </div>
                <p className="text-grey text-sm">Video would play here with Cloudinary/YouTube embed</p>
              </div>
              <div className="mt-4 flex justify-between items-center px-1">
                <div>
                  <h3 className="font-serif text-xl">{active.title}</h3>
                  <p className="text-gold text-xs uppercase tracking-wider mt-1">{active.type} · {active.year}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
