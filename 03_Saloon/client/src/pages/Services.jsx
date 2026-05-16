import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiClock, FiTag, FiArrowRight } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { api } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';
import SectionHeader from '../components/common/SectionHeader';

const CATEGORIES = ['All', 'Haircut', 'Beard Styling', 'Hair Coloring', 'Facial & Skin Care', 'Hair Spa', 'Groom Package'];

const FALLBACK = [
  { _id: '1', title: 'Classic Haircut', category: 'Haircut', description: 'Precision scissor cut with hot towel finish.', price: 299, duration: 30, image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&auto=format' },
  { _id: '2', title: 'Fade & Taper', category: 'Haircut', description: 'Low, mid or high fade with clean taper.', price: 399, duration: 45, image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&auto=format' },
  { _id: '3', title: 'Beard Trim & Shape', category: 'Beard Styling', description: 'Clean line-up with precision trim.', price: 199, duration: 20, image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&auto=format' },
  { _id: '4', title: 'Royal Beard Styling', category: 'Beard Styling', description: 'Full beard grooming with hot oil treatment.', price: 349, duration: 40, image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400&auto=format' },
  { _id: '5', title: 'Hair Color Full', category: 'Hair Coloring', description: 'Full head professional hair coloring.', price: 799, duration: 90, image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format' },
  { _id: '6', title: 'Gold Facial', category: 'Facial & Skin Care', description: '24K gold infused facial treatment.', price: 599, duration: 60, image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&auto=format' },
  { _id: '7', title: 'Keratin Hair Spa', category: 'Hair Spa', description: 'Deep conditioning keratin treatment.', price: 1499, duration: 120, image: 'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=400&auto=format' },
  { _id: '8', title: 'Groom Package Premium', category: 'Groom Package', description: 'Complete bridal prep package.', price: 2999, duration: 180, image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format' },
];

export default function Services() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    api.get('/services').then(r => setServices(r.data.services)).catch(() => setServices(FALLBACK)).finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'All' ? services : services.filter(s => s.category === activeCategory);

  return (
    <div className="pt-20">
      <div className="py-24 bg-dark-800 text-center">
        <p className="section-subtitle">Explore</p>
        <h1 className="section-title">Our Services</h1>
        <div className="gold-divider" />
        <p className="text-gray-400 max-w-xl mx-auto">Every service crafted with precision, premium products, and passion.</p>
      </div>

      <section className="py-20 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Filter */}
          <div className="flex flex-wrap justify-center gap-3 mb-14">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2.5 text-xs uppercase tracking-widest border transition-all duration-200 rounded-sm font-medium ${
                  activeCategory === cat
                    ? 'bg-gold-500 text-black border-gold-500'
                    : 'border-dark-500 text-gray-400 hover:border-gold-500 hover:text-gold-500'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {loading ? <Spinner /> : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((s, i) => (
                <motion.div
                  key={s._id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  className="card-dark overflow-hidden group hover:border-gold-500/40 transition-all duration-300"
                >
                  <div className="h-52 overflow-hidden">
                    <img src={s.image || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&auto=format'} alt={s.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs uppercase tracking-widest text-gold-500 font-medium">{s.category}</span>
                      <div className="flex items-center gap-1 text-gray-500 text-xs">
                        <FiClock size={12} />
                        {s.duration} min
                      </div>
                    </div>
                    <h3 className="font-serif text-xl font-bold text-white mb-3">{s.title}</h3>
                    <p className="text-gray-400 text-sm leading-relaxed mb-5">{s.description}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-gold-500">
                        <FiTag size={16} />
                        <span className="font-serif font-bold text-xl">₹{s.price}</span>
                      </div>
                      <Link to="/book" state={{ serviceId: s._id }} className="btn-gold text-xs py-2 px-4">
                        Book Now <FiArrowRight size={12} />
                      </Link>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}