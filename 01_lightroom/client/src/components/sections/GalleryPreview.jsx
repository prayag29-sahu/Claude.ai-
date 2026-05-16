import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn } from 'lucide-react'
import RevealOnScroll from '../ui/RevealOnScroll'

const TABS = ['All','Wedding','Birthday','Pre-Wedding','Events','Fashion']
// const items = [
//   { cat:'Wedding', title:'The Kapoor Wedding', loc:'Udaipur', h:320 },
//   { cat:'Birthday', title:"Ishaan's 1st Birthday", loc:'Mumbai', h:220 },
//   { cat:'Pre-Wedding', title:'Anjali & Vikram', loc:'Goa', h:420 },
//   { cat:'Fashion', title:'Nisha Editorial', loc:'Delhi', h:260 },
//   { cat:'Wedding', title:'The Singhania Ceremony', loc:'Jaipur', h:360 },
//   { cat:'Events', title:'TechSummit 2024', loc:'Bangalore', h:200 },
// ]
  
  const items = [
  {
    cat: 'Wedding',
    title: 'The Kapoor Wedding',
    loc: 'Udaipur',
    h: 450,
    img: '/dulhanPhotos/1.jpg'
  },
  {
    cat: 'Birthday',
    title: "Ishaan's 1st Birthday",
    loc: 'Mumbai',
    h: 220,
    img: '/kids/02.jpg'
  },
  {
    cat: 'Pre-Wedding',
    title: 'Anjali & Vikram',
    loc: 'Goa',
    h: 420,
    img: 'pre-w-shoot/1.jpg'
  },
  {
    cat: 'Fashion',
    title: 'Nisha Editorial',
    loc: 'Delhi',
    h: 260,
    img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d'
  },
  {
    cat: 'Wedding',
    title: 'The Singhania Ceremony',
    loc: 'Jaipur',
    h: 360,
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552'
  },
  {
    cat: 'Events',
    title: 'TechSummit 2024',
    loc: 'Bangalore',
    h: 200,
    img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622'
  },
]
const colors = [
  'from-[#1c1408] to-[#2a1c08]','from-[#0f1c10] to-[#182814]','from-[#1a0f1c] to-[#28152a]',
  'from-[#1c1010] to-[#2a1414]','from-[#0f1518] to-[#141e22]','from-[#181408] to-[#262010]',
]

export default function GalleryPreview() {
  const [active, setActive] = useState('All')
  const [lightbox, setLightbox] = useState(null)

  const filtered = active === 'All' ? items : items.filter(i => i.cat === active)

  return (
    <>
      <div className="flex gap-2 flex-wrap mb-8">
        {TABS.map(t => (
          <button key={t} onClick={() => setActive(t)}
            className={`px-4 py-2 text-[0.68rem] tracking-widest uppercase border transition-all duration-300 ${
              active === t ? 'bg-gold border-gold text-black' : 'border-border text-grey-light hover:border-gold hover:text-gold'
            }`}>
            {t}
          </button>
        ))}
      </div>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-2">
        <AnimatePresence>
          {filtered.map((item, i) => (
            <motion.div key={item.title + i} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
              className="break-inside-avoid mb-2 relative overflow-hidden group cursor-pointer"
              onClick={() => setLightbox(item)}>
              {/* <div className={`bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center`} style={{ height: item.h }}>
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="rgba(198,165,92,0.2)" strokeWidth="0.7">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div> */}
              <div
                className="relative overflow-hidden"
                style={{ height: item.h }}
              >
                <img
                  src={`${item.img}?auto=format&fit=crop&w=800&q=80`}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <h4 className="font-serif text-base font-light">{item.title}</h4>
                <span className="text-gold text-[0.62rem] uppercase tracking-wider">{item.cat} · {item.loc}</span>
              </div>
              <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ZoomIn size={18} className="text-white" />
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}>
            <button className="absolute top-4 right-4 text-white/70 hover:text-white" onClick={() => setLightbox(null)}>
              <X size={24} />
            </button>
            <div onClick={e => e.stopPropagation()}>
              <div className={`bg-gradient-to-br ${colors[0]} w-[600px] max-w-[90vw] h-[400px] flex items-center justify-center`}>
                <svg width="60" height="60" viewBox="0 0 24 24" fill="none" stroke="rgba(198,165,92,0.3)" strokeWidth="0.5">
                  <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
              <div className="mt-3 text-center">
                <h4 className="font-serif text-xl">{lightbox.title}</h4>
                <p className="text-gold text-xs uppercase tracking-wider mt-1">{lightbox.cat} · {lightbox.loc}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
