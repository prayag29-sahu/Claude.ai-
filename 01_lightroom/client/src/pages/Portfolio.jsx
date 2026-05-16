import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn } from 'lucide-react'
import api from '../services/api'
import RevealOnScroll from '../components/ui/RevealOnScroll'

const TABS = ['All','Wedding','Birthday','Pre-Wedding','Engagement','Events','Fashion','Baby Shoot']

const placeholderItems = TABS.slice(1).flatMap((cat, ci) =>
  Array.from({ length: 6 }, (_, i) => ({
    _id: `${ci}-${i}`,
    title: `${cat} Gallery ${i + 1}`,
    category: cat,
    location: ['Delhi','Mumbai','Jaipur','Udaipur','Goa','Shimla'][i % 6],
    year: 2024,
  }))
)
const colors = [
  'from-[#1c1408] to-[#2a1c08]','from-[#0f1c10] to-[#182814]','from-[#1a0f1c] to-[#28152a]',
  'from-[#1c1010] to-[#2a1414]','from-[#0f1518] to-[#141e22]','from-[#181408] to-[#262010]',
]
const heights = [320,240,400,280,350,220,380,260,300,340,200,420]

export default function Portfolio() {
  const [tab, setTab] = useState('All')
  const [lightbox, setLightbox] = useState(null)

  const { data, isLoading } = useQuery({
    queryKey: ['gallery'],
    queryFn: () => api.get('/gallery/public').then(r => r.data.galleries),
    placeholderData: placeholderItems
  })

  const items = (data || placeholderItems).filter(i => tab === 'All' || i.category === tab)

  return (
    <div className="min-h-screen pt-24 pb-16 px-[5%]">
      <RevealOnScroll className="text-center mb-12">
        <span className="section-label">Our Work</span>
        <h1 className="section-title">The <em className="text-gold italic">Portfolio</em></h1>
        <div className="divider mx-auto" />
        <p className="text-grey-light text-sm max-w-lg mx-auto">Every photograph is a moment frozen in time. Browse our collection across different categories.</p>
      </RevealOnScroll>

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

      <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-2 max-w-7xl mx-auto">
        <AnimatePresence>
          {items.map((item, i) => (
            <motion.div key={item._id} layout initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
              className="break-inside-avoid mb-2 relative overflow-hidden group cursor-pointer"
              onClick={() => setLightbox(item)}>
              {item.images?.[0] ? (
                <img src={item.images[0].url} alt={item.title} className="w-full object-cover" style={{ height: heights[i % heights.length] }} />
              ) : (
                <div className={`bg-gradient-to-br ${colors[i % colors.length]} flex items-center justify-center`} style={{ height: heights[i % heights.length] }}>
                  <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="rgba(198,165,92,0.2)" strokeWidth="0.7">
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
              )}
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
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[2000] bg-black/96 flex items-center justify-center p-4"
            onClick={() => setLightbox(null)}>
            <button className="absolute top-5 right-5 w-10 h-10 border border-border text-grey-light hover:text-white hover:border-white flex items-center justify-center transition-all" onClick={() => setLightbox(null)}>
              <X size={18} />
            </button>
            <div className="max-w-3xl w-full" onClick={e => e.stopPropagation()}>
              {lightbox.images?.[0] ? (
                <img src={lightbox.images[0].url} alt={lightbox.title} className="w-full max-h-[80vh] object-contain" />
              ) : (
                <div className="bg-gradient-to-br from-[#1c1408] to-[#2a1c08] h-[400px] flex items-center justify-center">
                  <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="rgba(198,165,92,0.2)" strokeWidth="0.5">
                    <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>
                  </svg>
                </div>
              )}
              <div className="flex justify-between items-center mt-3 px-1">
                <div>
                  <h3 className="font-serif text-lg">{lightbox.title}</h3>
                  <p className="text-gold text-xs uppercase tracking-wider">{lightbox.category} · {lightbox.location} · {lightbox.year}</p>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
