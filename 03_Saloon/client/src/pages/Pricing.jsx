import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCheck } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { api } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';
import SectionHeader from '../components/common/SectionHeader';

const CATEGORIES = ['All', 'Haircut', 'Beard Styling', 'Hair Coloring', 'Facial & Skin Care', 'Hair Spa', 'Groom Package'];

const PACKAGES = [
  { name: 'Basic Groom', price: 699, features: ['Haircut', 'Beard Trim', 'Face Wash'], popular: false },
  { name: 'Premium Groom', price: 1499, features: ['Haircut', 'Beard Styling', 'Classic Facial', 'Head Massage'], popular: true },
  { name: 'Royal Groom', price: 2999, features: ['Haircut', 'Royal Beard', 'Gold Facial', 'Hair Spa', 'Manicure'], popular: false },
];

export default function Pricing() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    api.get('/services').then(r => setServices(r.data.services)).catch(() => setServices([])).finally(() => setLoading(false));
  }, []);

  const filtered = activeCategory === 'All' ? services : services.filter(s => s.category === activeCategory);

  return (
    <div className="pt-20">
      <div className="py-24 bg-dark-800 text-center">
        <p className="section-subtitle">Transparent</p>
        <h1 className="section-title">Our Pricing</h1>
        <div className="gold-divider" />
        <p className="text-gray-400 max-w-xl mx-auto">No hidden charges. Premium quality at honest prices.</p>
      </div>

      {/* Packages */}
      <section className="py-24 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader subtitle="Value Deals" title="Combo Packages" description="Get more, pay less. Our curated packages offer the best value." />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {PACKAGES.map((pkg, i) => (
              <motion.div
                key={pkg.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative card-dark p-8 ${pkg.popular ? 'border-gold-500' : ''}`}
              >
                {pkg.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gold-500 text-black text-xs font-bold px-4 py-1 uppercase tracking-widest">
                    Most Popular
                  </div>
                )}
                <h3 className="font-serif text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                <div className="flex items-end gap-1 mb-6">
                  <span className="text-gray-400 text-sm">₹</span>
                  <span className="font-serif text-5xl font-bold gold-text">{pkg.price}</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {pkg.features.map(f => (
                    <li key={f} className="flex items-center gap-3 text-gray-300 text-sm">
                      <FiCheck className="text-gold-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/book" className={pkg.popular ? 'btn-gold w-full justify-center' : 'btn-outline-gold w-full justify-center'}>
                  Book Now
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* A la carte */}
      <section className="py-24 bg-dark-800">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader subtitle="A La Carte" title="Individual Services" />
          
          {/* Filter */}
          <div className="flex flex-wrap justify-center gap-3 mt-10 mb-14">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-xs uppercase tracking-widest border transition-all rounded-sm ${
                  activeCategory === cat ? 'bg-gold-500 text-black border-gold-500' : 'border-dark-500 text-gray-400 hover:border-gold-500 hover:text-gold-500'
                }`}>
                {cat}
              </button>
            ))}
          </div>

          {loading ? <Spinner /> : (
            <div className="space-y-2">
              {filtered.map((s, i) => (
                <motion.div
                  key={s._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-center justify-between px-6 py-5 card-dark hover:border-gold-500/30 transition-all group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h4 className="text-white font-medium group-hover:text-gold-500 transition-colors">{s.title}</h4>
                      <span className="text-xs text-gray-500 uppercase tracking-widest hidden sm:block">{s.category}</span>
                    </div>
                    <p className="text-gray-500 text-xs mt-0.5">{s.duration} minutes</p>
                  </div>
                  <div className="flex items-center gap-6">
                    <span className="font-serif text-2xl font-bold text-gold-500">₹{s.price}</span>
                    <Link to="/book" state={{ serviceId: s._id }} className="btn-gold text-xs py-2 px-4 hidden sm:inline-flex">Book</Link>
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