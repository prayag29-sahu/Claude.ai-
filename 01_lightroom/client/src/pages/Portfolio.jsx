import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn } from 'lucide-react'
import RevealOnScroll from '../components/ui/RevealOnScroll'

// ─── Gallery Data — uses only real local jpg files from public/ ────────────────
const LOCAL_GALLERY = [

  // ── Haldi Photos (1 real jpg) ─────────────────────────────────────────────
  { _id: 'haldi-1', category: 'Haldi', title: 'Haldi Ceremony',       location: 'Nagpur', year: 2025, img: '/haldi%20photos/photoking324-20250603-0001.jpg' },

  // ── Wedding / Bridal Photos ───────────────────────────────────────────────
  { _id: 'dul-1',   category: 'Wedding', title: 'Bridal Portrait',    location: 'Nagpur', year: 2025, img: '/dulhanPhotos/1.jpg' },
  { _id: 'dul-2',   category: 'Wedding', title: 'Bridal Glow',        location: 'Nagpur', year: 2025, img: '/dulhanPhotos/photoking324-20250603-0011.jpg' },
  // Wedding couple (using photoshoot/cop.jpg which is the couple shot)
  { _id: 'wc-1',    category: 'Wedding', title: 'Together Forever',   location: 'Nagpur', year: 2025, img: '/photoshoot/cop.jpg' },
  { _id: 'wc-2',    category: 'Wedding', title: 'Couple Frame',       location: 'Nagpur', year: 2025, img: '/photoshoot/2.jpg' },

  // ── Pre-Wedding ───────────────────────────────────────────────────────────
  { _id: 'pre-1',   category: 'Pre-Wedding', title: 'Pre-Wedding Story',    location: 'Nagpur', year: 2025, img: '/pre-w-shoot/1.jpg' },

  // ── Engagement Photos ─────────────────────────────────────────────────────
  { _id: 'eng-1',   category: 'Engagement', title: 'Ring Ceremony',        location: 'Nagpur', year: 2025, img: '/engagement%20photos/01.jpg' },

  // ── Kids / Baby Shoot ─────────────────────────────────────────────────────
  { _id: 'kid-1',   category: 'Baby Shoot', title: 'Tiny Smiles',          location: 'Nagpur', year: 2025, img: '/kids/01.jpg' },
  { _id: 'kid-2',   category: 'Baby Shoot', title: 'Pure Joy',             location: 'Nagpur', year: 2025, img: '/kids/02.jpg' },

  // ── Fashion / Photoshoot — all jpg files from public/photoshoot/ ──────────
  { _id: 'ps-1',    category: 'Fashion', title: 'Studio Portrait',        location: 'Nagpur', year: 2025, img: '/photoshoot/photoking324-20250603-0002.jpg' },
  { _id: 'ps-2',    category: 'Fashion', title: 'Creative Portrait',      location: 'Nagpur', year: 2025, img: '/photoshoot/photoking324-20250603-0003.jpg' },
  { _id: 'ps-3',    category: 'Fashion', title: 'Editorial Look',         location: 'Nagpur', year: 2025, img: '/photoshoot/photoking324-20250603-0004.jpg' },
  { _id: 'ps-4',    category: 'Fashion', title: 'Golden Light',           location: 'Nagpur', year: 2025, img: '/photoshoot/photoking324-20250603-0005.jpg' },
  { _id: 'ps-5',    category: 'Fashion', title: 'Bold Expression',        location: 'Nagpur', year: 2025, img: '/photoshoot/photoking324-20250603-00051.jpg' },
  { _id: 'ps-6',    category: 'Fashion', title: 'Candid Style',           location: 'Nagpur', year: 2025, img: '/photoshoot/photoking324-20250603-0006.jpg' },
  { _id: 'ps-7',    category: 'Fashion', title: 'Natural Beauty',         location: 'Nagpur', year: 2025, img: '/photoshoot/photoking324-20250603-0007.jpg' },
  { _id: 'ps-8',    category: 'Fashion', title: 'Portrait Perfection',    location: 'Nagpur', year: 2025, img: '/photoshoot/photoking324-20250603-0008.jpg' },
  { _id: 'ps-9',    category: 'Fashion', title: 'Artistic Frame',         location: 'Nagpur', year: 2025, img: '/photoshoot/photoking324-20250603-0009.jpg' },
  { _id: 'ps-10',   category: 'Fashion', title: 'Soft Focus',             location: 'Nagpur', year: 2025, img: '/photoshoot/photoking324-20250603-0010.jpg' },
  { _id: 'ps-11',   category: 'Fashion', title: 'Urban Edge',             location: 'Nagpur', year: 2025, img: '/photoshoot/photoking324-20250603-0013.jpg' },
  { _id: 'ps-12',   category: 'Fashion', title: 'Warm Tones',             location: 'Nagpur', year: 2025, img: '/photoshoot/photoking324-20250603-0014.jpg' },
  { _id: 'ps-13',   category: 'Fashion', title: 'Story in Light',         location: 'Nagpur', year: 2025, img: '/photoshoot/photoking324-20250603-00120.jpg' },
]

const TABS = ['All', 'Wedding', 'Haldi', 'Pre-Wedding', 'Engagement', 'Fashion', 'Baby Shoot']

// Hide card if image fails to load — avoids broken black boxes
function hideCard(e) {
  const card = e.target.closest('[data-gallery-card]')
  if (card) card.style.display = 'none'
}

export default function Portfolio() {
  const [tab, setTab]           = useState('All')
  const [lightbox, setLightbox] = useState(null)

  const items = tab === 'All' ? LOCAL_GALLERY : LOCAL_GALLERY.filter(i => i.category === tab)

  return (
    <div className="min-h-screen pt-24 pb-16 px-[5%]">
      <RevealOnScroll className="text-center mb-12">
        <span className="section-label">Our Work</span>
        <h1 className="section-title">The <em className="text-gold italic">Portfolio</em></h1>
        <div className="divider mx-auto" />
        <p className="text-grey-light text-sm max-w-lg mx-auto">
          Every photograph is a moment frozen in time. Browse our collection across different categories.
        </p>
      </RevealOnScroll>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap justify-center mb-10">
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`px-4 py-2 text-[0.68rem] tracking-widest uppercase border transition-all duration-300 ${
              tab === t ? 'bg-gold border-gold text-black' : 'border-border text-grey-light hover:border-gold hover:text-gold'
            }`}>
            {t}
          </button>
        ))}
      </div>

      {/* Masonry grid — NO fixed heights so images keep natural aspect ratio on all screens */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-2 max-w-7xl mx-auto">
        <AnimatePresence>
          {items.map((item, i) => (
            <motion.div
              key={item._id}
              data-gallery-card
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4, delay: i * 0.03 }}
              className="break-inside-avoid mb-2 relative overflow-hidden group cursor-pointer"
              onClick={() => setLightbox(item)}
            >
              {/* Image with natural aspect ratio — no fixed height */}
              <img
                src={item.img}
                alt={item.title}
                className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105 block"
                onError={hideCard}
                loading="lazy"
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-3">
                <div className="flex justify-end"><ZoomIn size={16} className="text-white" /></div>
                <div>
                  <h4 className="font-serif text-sm font-light">{item.title}</h4>
                  <span className="text-gold text-[0.6rem] uppercase tracking-wider">{item.category} · {item.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {items.length === 0 && (
          <p className="col-span-full text-center text-grey text-sm py-16">No images in this category yet.</p>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black/96 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}
          >
            <button
              className="absolute top-5 right-5 w-10 h-10 border border-border text-grey-light hover:text-white hover:border-white flex items-center justify-center transition-all z-10"
              onClick={() => setLightbox(null)}
            >
              <X size={18} />
            </button>
            <div className="max-w-3xl w-full" onClick={e => e.stopPropagation()}>
              <img
                src={lightbox.img}
                alt={lightbox.title}
                className="w-full max-h-[85vh] object-contain"
              />
              <div className="flex justify-between items-center mt-3 px-1">
                <div>
                  <h3 className="font-serif text-lg">{lightbox.title}</h3>
                  <p className="text-gold text-xs uppercase tracking-wider mt-0.5">
                    {lightbox.category} · {lightbox.location} · {lightbox.year}
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
