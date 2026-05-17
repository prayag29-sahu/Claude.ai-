import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn } from 'lucide-react'
import RevealOnScroll from '../ui/RevealOnScroll'

const TABS = ['All', 'Wedding', 'Pre-Wedding', 'Engagement', 'Fashion', 'Events']

// Spaces in folder names must be %20 encoded for browser URL resolution
const items = [
  { cat: 'Wedding',     title: 'The Bridal Portrait',    loc: 'Nagpur',    h: 450, img: '/dulhanPhotos/1.jpg' },
  { cat: 'Wedding',     title: 'Couple in Golden Hour',  loc: 'Nagpur',    h: 280, img: '/wedding%20couples/cop.jpg' },
  { cat: 'Wedding',     title: 'Sacred Vows',            loc: 'Nagpur',    h: 380, img: '/wedding%20couples/2.jpg' },
  { cat: 'Pre-Wedding', title: 'Romantic Pre-Wedding',   loc: 'Nagpur',    h: 340, img: '/pre-w-shoot/1.jpg' },
  { cat: 'Engagement',  title: 'Ring Ceremony',          loc: 'Nagpur',    h: 300, img: '/engagement%20photos/01.jpg' },
  { cat: 'Fashion',     title: 'Studio Portrait',        loc: 'Nagpur',    h: 260, img: '/photoshoot/2.jpg' },
  { cat: 'Wedding',     title: 'Timeless Moment',        loc: 'Nagpur',    h: 360, img: '/wedding%20couples/photoking324-20250603-0007.jpg' },
  { cat: 'Wedding',     title: 'Wedding Celebration',    loc: 'Nagpur',    h: 220, img: '/wedding%20couples/photoking324-20250603-00120.jpg' },
  { cat: 'Events',      title: 'Grand Event Coverage',   loc: 'Mumbai',    h: 300, img: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80' },
  { cat: 'Fashion',     title: 'Fashion Editorial',      loc: 'Delhi',     h: 420, img: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800&q=80' },
  { cat: 'Events',      title: 'Corporate Summit',       loc: 'Bangalore', h: 240, img: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&q=80' },
  { cat: 'Wedding',     title: 'Festive Rituals',        loc: 'Nagpur',    h: 390, img: '/wedding%20couples/photoking324-20250603-0009.jpg' },
]

// Hide entire masonry card on error — no black boxes
function hideCard(e) {
  const card = e.target.closest('[data-gallery-card]')
  if (card) card.style.display = 'none'
}

export default function GalleryPreview() {
  const [active, setActive]     = useState('All')
  const [lightbox, setLightbox] = useState(null)

  const filtered = active === 'All' ? items : items.filter(i => i.cat === active)

  return (
    <>
      {/* Filter tabs */}
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

      {/* Masonry grid */}
      <div className="columns-1 md:columns-2 lg:columns-3 gap-2">
        <AnimatePresence>
          {filtered.map((item, i) => (
            <motion.div
              key={item.title + i}
              data-gallery-card
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="break-inside-avoid mb-2 relative overflow-hidden group cursor-pointer"
              onClick={() => setLightbox(item)}
            >
              <div className="relative overflow-hidden" style={{ height: item.h }}>
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105 block"
                  onError={hideCard}
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

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-4 right-4 w-10 h-10 border border-border text-grey-light hover:text-white flex items-center justify-center transition-all"
              onClick={() => setLightbox(null)}
            >
              <X size={18} />
            </button>
            <div className="max-w-3xl w-full" onClick={e => e.stopPropagation()}>
              <img
                src={lightbox.img}
                alt={lightbox.title}
                className="w-full max-h-[80vh] object-contain"
              />
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
