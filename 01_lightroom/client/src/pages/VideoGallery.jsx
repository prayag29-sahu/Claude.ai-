import { useState } from 'react'
import { Play, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import RevealOnScroll from '../components/ui/RevealOnScroll'

// ─── All local videos from public/ folders ────────────────────────────────────
// Poster images use only confirmed .jpg files (HEIC files are not browser-displayable)
const videos = [

  // ── Wedding Cinema ────────────────────────────────────────────────────────
  {
    id: 'wcv-1', title: 'The Wedding Story',
    type: 'Wedding Cinema', year: 2025,
    src: '/wedding%20couple%20video/01.mp4',
    poster: '/photoshoot/cop.jpg',               // real local jpg poster
  },
  {
    id: 'wcv-2', title: 'Wedding Highlights Reel',
    type: 'Wedding Cinema', year: 2025,
    src: '/wedding%20couple%20video/photoking324-20250603-0009.mp4',
    poster: '/photoshoot/2.jpg',
  },

  // ── Bridal Cinema ─────────────────────────────────────────────────────────
  {
    id: 'dv-1', title: 'Bridal Cinematic Reel',
    type: 'Bridal Cinema', year: 2025,
    src: '/dulhan%20video/01.mp4',
    poster: '/dulhanPhotos/1.jpg',
  },
  {
    id: 'dv-2', title: 'Bridal Story Short',
    type: 'Bridal Cinema', year: 2025,
    src: '/dulhan%20video/photoking324-20250603-0011.mp4',
    poster: '/dulhanPhotos/photoking324-20250603-0011.jpg',
  },
  {
    id: 'dv-3', title: 'Bridal Moments',
    type: 'Bridal Cinema', year: 2025,
    src: '/dulhan%20video/photoking324-20250603-0012.mp4',
    poster: '/dulhanPhotos/1.jpg',
  },

  // ── Haldi Film ────────────────────────────────────────────────────────────
  {
    id: 'hv-1', title: 'Haldi Celebration Film',
    type: 'Haldi Film', year: 2025,
    src: '/haldi%20video/01.mp4',
    poster: '/haldi%20photos/photoking324-20250603-0001.jpg',   // real local jpg
  },
  {
    id: 'hv-2', title: 'Haldi Highlights',
    type: 'Haldi Film', year: 2025,
    src: '/haldi%20video/photoking324-20250603-0006.mp4',
    poster: '/haldi%20photos/photoking324-20250603-0001.jpg',
  },

  // ── Pre-Wedding Film ──────────────────────────────────────────────────────
  {
    id: 'pw-1', title: 'Pre-Wedding Cinematic',
    type: 'Pre-Wedding Film', year: 2025,
    src: '/pre-w-shoot/01.mp4',
    poster: '/pre-w-shoot/1.jpg',
  },
  {
    id: 'pw-2', title: 'Pre-Wedding Story',
    type: 'Pre-Wedding Film', year: 2025,
    src: '/pre-w-shoot/photoking324-20250603-0002.mp4',
    poster: '/photoshoot/photoking324-20250603-0007.jpg',
  },
  {
    id: 'pw-3', title: 'Pre-Wedding Highlight',
    type: 'Pre-Wedding Film', year: 2025,
    src: '/pre-w-shoot/photoking324-20250603-0005.mp4',
    poster: '/photoshoot/photoking324-20250603-0002.jpg',
  },
  {
    id: 'pw-4', title: 'Pre-Wedding Short',
    type: 'Pre-Wedding Film', year: 2025,
    src: '/pre-w-shoot/photoking324-20250603-0010.mp4',
    poster: '/photoshoot/photoking324-20250603-0003.jpg',
  },
  {
    id: 'pw-5', title: 'Romantic Pre-Wedding',
    type: 'Pre-Wedding Film', year: 2025,
    src: '/pre-w-shoot/photoking324-20250603-0014.mp4',
    poster: '/engagement%20photos/01.jpg',
  },
  {
    id: 'pw-6', title: 'Pre-Wedding Teaser',
    type: 'Pre-Wedding Film', year: 2025,
    src: '/pre-w-shoot/photoking324-20250603-0015.mp4',
    poster: '/photoshoot/photoking324-20250603-0004.jpg',
  },
  {
    id: 'pw-7', title: 'Golden Hour Pre-Wedding',
    type: 'Pre-Wedding Film', year: 2025,
    src: '/pre-w-shoot/photoking324-20250603-0016.mp4',
    poster: '/photoshoot/photoking324-20250603-0005.jpg',
  },
  {
    id: 'pw-8', title: 'Pre-Wedding Short Reel',
    type: 'Pre-Wedding Film', year: 2025,
    src: '/pre-w-shoot/photoking324-20250603-0018.mp4',
    poster: '/photoshoot/photoking324-20250603-0006.jpg',
  },
  {
    id: 'pw-9', title: 'Pre-Wedding Film Final',
    type: 'Pre-Wedding Film', year: 2025,
    src: '/pre-w-shoot/photoking324-20250603-0019.mp4',
    poster: '/photoshoot/photoking324-20250603-00051.jpg',
  },

  // ── Engagement Film ───────────────────────────────────────────────────────
  {
    id: 'env-1', title: 'Ring Ceremony Film',
    type: 'Engagement Film', year: 2025,
    src: '/engagement%20video/01.mp4',
    poster: '/engagement%20photos/01.jpg',
  },
  {
    id: 'env-2', title: 'Engagement Highlights',
    type: 'Engagement Film', year: 2025,
    src: '/engagement%20video/photoking324-20250603-0001.mp4',
    poster: '/dulhanPhotos/1.jpg',
  },

  // ── Event Coverage ────────────────────────────────────────────────────────
  {
    id: 'ev-1', title: 'Event Coverage Film',
    type: 'Event Coverage', year: 2025,
    src: '/event%20videos/photoking324-20250603-0003.mp4',
    poster: '/photoshoot/photoking324-20250603-0008.jpg',
  },
  {
    id: 'ev-2', title: 'Event Highlights',
    type: 'Event Coverage', year: 2025,
    src: '/event%20videos/photoking324-20250603-0004.mp4',
    poster: '/photoshoot/photoking324-20250603-0009.jpg',
  },
  {
    id: 'ev-3', title: 'Event Short Reel',
    type: 'Event Coverage', year: 2025,
    src: '/event%20videos/photoking324-20250603-0013.mp4',
    poster: '/photoshoot/photoking324-20250603-0010.jpg',
  },

  // ── IIT Shoot ─────────────────────────────────────────────────────────────
  {
    id: 'iit-1', title: 'IIT Campus Creative Reel',
    type: 'IIT Shoot', year: 2025,
    src: '/iit%20shoot/photoking324-20250603-0017.mp4',
    poster: '/iit%20shoot/iit_indore_1.jpg',
  },
  {
    id: 'iit-2', title: 'IIT Cinematic Film',
    type: 'IIT Shoot', year: 2025,
    src: '/iit%20shoot/photoking324-20250603-0020.mp4',
    poster: '/iit%20shoot/iit_indore_2.jpg',
  },
]

const FILTER_TYPES = [
  'All',
  'Wedding Cinema',
  'Bridal Cinema',
  'Pre-Wedding Film',
  'Engagement Film',
  'Haldi Film',
  'Event Coverage',
  'IIT Shoot',
]

export default function VideoGallery() {
  const [active, setActive] = useState(null)
  const [filter, setFilter] = useState('All')

  const displayed = filter === 'All' ? videos : videos.filter(v => v.type === filter)

  return (
    <div className="min-h-screen pt-24 pb-16 px-[5%]">
      <RevealOnScroll className="text-center mb-10">
        <span className="section-label">Films</span>
        <h1 className="section-title">Cinematic <em className="text-gold italic">Highlights</em></h1>
        <div className="divider mx-auto" />
        <p className="text-grey-light text-sm max-w-lg mx-auto">
          Every film we create is a cinematic journey — carefully crafted to tell your unique story.
        </p>
      </RevealOnScroll>

      {/* Filter tabs */}
      <div className="flex gap-2 flex-wrap justify-center mb-10">
        {FILTER_TYPES.map(t => (
          <button key={t} onClick={() => setFilter(t)}
            className={`px-4 py-2 text-[0.65rem] tracking-widest uppercase border transition-all duration-300 ${
              filter === t ? 'bg-gold border-gold text-black' : 'border-border text-grey-light hover:border-gold hover:text-gold'
            }`}>
            {t}
          </button>
        ))}
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {displayed.map((v, i) => (
          <RevealOnScroll key={v.id} delay={i * 0.04}>
            <div
              className="relative overflow-hidden group cursor-pointer aspect-video bg-card border border-border"
              onClick={() => setActive(v)}
            >
              {/* Poster thumbnail */}
              <img
                src={v.poster}
                alt={v.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                onError={e => { e.target.style.display = 'none' }}
                loading="lazy"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />

              {/* Play button */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-14 h-14 rounded-full bg-gold/90 flex items-center justify-center group-hover:scale-110 group-hover:bg-gold transition-all duration-300 shadow-[0_0_30px_rgba(198,165,92,0.4)]">
                  <Play size={20} fill="black" strokeWidth={0} className="ml-1" />
                </div>
              </div>

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 to-transparent">
                <h4 className="font-serif text-base font-light leading-tight">{v.title}</h4>
                <span className="text-gold text-[0.62rem] uppercase tracking-wider">{v.type} · {v.year}</span>
              </div>
            </div>
          </RevealOnScroll>
        ))}
      </div>

      {/* Video Lightbox */}
      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black/97 flex items-center justify-center p-4"
            onClick={() => setActive(null)}
          >
            <button
              className="absolute top-5 right-5 w-10 h-10 border border-border text-grey-light hover:text-white hover:border-white flex items-center justify-center transition-all z-10"
              onClick={() => setActive(null)}
            >
              <X size={18} />
            </button>
            <div className="max-w-5xl w-full" onClick={e => e.stopPropagation()}>
              <video
                key={active.src}
                src={active.src}
                poster={active.poster}
                controls
                autoPlay
                playsInline
                className="w-full max-h-[80vh] bg-black outline-none"
              />
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
