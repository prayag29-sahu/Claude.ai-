import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX, FiZoomIn } from 'react-icons/fi';
import { api } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';

const CATEGORIES = ['All', 'Haircut', 'Beard', 'Color', 'Facial', 'General'];

const FALLBACK_IMAGES = [
  { _id: '1', image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format', category: 'Haircut', caption: 'Classic Taper Fade' },
  { _id: '2', image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600&auto=format', category: 'Beard', caption: 'Styled Beard' },
  { _id: '3', image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600&auto=format', category: 'General', caption: 'Hot Towel Shave' },
  { _id: '4', image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600&auto=format', category: 'General', caption: 'Premium Ambiance' },
  { _id: '5', image: 'https://images.unsplash.com/photo-1560869713-da86a9ec0744?w=600&auto=format', category: 'Color', caption: 'Hair Coloring' },
  { _id: '6', image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600&auto=format', category: 'General', caption: 'Expert Barber' },
  { _id: '7', image: 'https://images.unsplash.com/photo-1541533848490-bc8115cd6522?w=600&auto=format', category: 'Haircut', caption: 'Scissor Craft' },
  { _id: '8', image: 'https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=600&auto=format', category: 'Beard', caption: 'Beard Grooming' },
  { _id: '9', image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=600&auto=format', category: 'Facial', caption: 'Facial Treatment' },
  { _id: '10', image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=600&auto=format', category: 'General', caption: 'Gentleman Style' },
  { _id: '11', image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=600&auto=format', category: 'Haircut', caption: 'Modern Cut' },
  { _id: '12', image: 'https://images.unsplash.com/photo-1519523887467-group3?w=600&auto=format', category: 'General', caption: 'Our Team' },
];

export default function Gallery() {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    api.get('/gallery').then(r => setImages(r.data.images)).catch(() => setImages(FALLBACK_IMAGES)).finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'All' ? images : images.filter(img => img.category === activeCategory);

  return (
    <div className="pt-20">
      <div className="py-24 bg-dark-800 text-center">
        <p className="section-subtitle">Portfolio</p>
        <h1 className="section-title">Our Gallery</h1>
        <div className="gold-divider" />
        <p className="text-gray-400 max-w-xl mx-auto">Witness the artistry. Every image is a story of transformation.</p>
      </div>

      <section className="py-20 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-14">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 text-xs uppercase tracking-widest border transition-all rounded-sm ${
                  activeCategory === cat ? 'bg-gold-500 text-black border-gold-500' : 'border-dark-500 text-gray-400 hover:border-gold-500 hover:text-gold-500'
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {loading ? <Spinner /> : (
            <motion.div
              layout
              className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4"
            >
              {filtered.map((img, i) => (
                <motion.div
                  key={img._id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  className="break-inside-avoid group relative overflow-hidden cursor-pointer rounded-sm"
                  onClick={() => setSelected(img)}
                >
                  <img
                    src={img.image}
                    alt={img.caption || 'Gallery'}
                    className="w-full object-cover group-hover:scale-110 transition-transform duration-700"
                    onError={e => e.target.src = 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&auto=format'}
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <FiZoomIn className="text-gold-500" size={28} />
                  </div>
                  {img.caption && (
                    <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent translate-y-full group-hover:translate-y-0 transition-transform">
                      <p className="text-white text-sm font-medium">{img.caption}</p>
                    </div>
                  )}
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Lightbox */}
      <AnimatePresence>
        {selected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
            onClick={() => setSelected(null)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="relative max-w-4xl max-h-[85vh]"
              onClick={e => e.stopPropagation()}
            >
              <button onClick={() => setSelected(null)} className="absolute -top-10 right-0 text-white hover:text-gold-500 transition-colors">
                <FiX size={28} />
              </button>
              <img src={selected.image} alt={selected.caption} className="max-w-full max-h-[80vh] object-contain rounded-sm" />
              {selected.caption && (
                <p className="text-center text-gold-500 mt-4 font-serif text-lg">{selected.caption}</p>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}