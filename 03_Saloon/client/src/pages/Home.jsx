import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiScissors, FiStar, FiUsers, FiAward, FiChevronRight, FiArrowRight } from 'react-icons/fi';
import SectionHeader from '../components/common/SectionHeader';

const FEATURES = [
  { icon: <FiUsers size={28} />, title: 'Expert Barbers', desc: '15+ years of combined styling experience.' },
  { icon: <FiStar size={28} />, title: 'Premium Products', desc: 'Only luxury grooming brands used.' },
  { icon: <FiAward size={28} />, title: 'Award Winning', desc: 'Best Men\'s Salon in the city 3 years running.' },
  { icon: <FiScissors size={28} />, title: 'Hygienic Space', desc: 'Sterilized tools & sanitized environment.' },
];

const SERVICES_PREVIEW = [
  { name: 'Haircut & Styling', price: 'From ₹299', img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&auto=format' },
  { name: 'Beard Grooming', price: 'From ₹199', img: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&auto=format' },
  { name: 'Hair Coloring', price: 'From ₹799', img: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600&auto=format' },
  { name: 'Facial & Skin Care', price: 'From ₹399', img: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400&auto=format' },
  { name: 'Hair Spa', price: 'From ₹699', img: 'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=400&auto=format' },
  { name: 'Groom Package', price: 'From ₹2999', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format' },
];

const TESTIMONIALS = [
  { name: 'Rahul Sharma', text: 'Best barber shop in town. The fade they gave me was absolutely perfect. Will definitely come back!', rating: 5 },
  { name: 'Amit Verma', text: 'Sachin\'s team is exceptional. The beard grooming session was relaxing and the results were amazing.', rating: 5 },
  { name: 'Vikram Nair', text: 'Went for the Groom Package before my wedding. Looked absolutely stunning. Highly recommended!', rating: 5 },
];

const PRICING = [
  { name: 'Classic Haircut', price: '₹299', duration: '30 min' },
  { name: 'Fade & Taper', price: '₹399', duration: '45 min' },
  { name: 'Beard Trim', price: '₹199', duration: '20 min' },
  { name: 'Gold Facial', price: '₹599', duration: '60 min' },
  { name: 'Keratin Spa', price: '₹1499', duration: '120 min' },
  { name: 'Groom Package', price: '₹2999', duration: '180 min' },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

export default function Home() {
  return (
    <div>
      {/* HERO */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1920&auto=format')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/40" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 to-transparent" />
        
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="max-w-2xl">
            <motion.p
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="section-subtitle mb-6"
            >
              ✦ Premium Men's Grooming ✦
            </motion.p>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="font-serif text-5xl md:text-7xl font-bold leading-tight text-white mb-6"
            >
              Style That <span className="gold-text">Defines</span> Your Personality
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="text-gray-300 text-lg md:text-xl mb-10 leading-relaxed"
            >
              Grooming Redefined for Modern Men. Experience luxury barber services crafted with precision and passion.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="flex flex-wrap gap-4"
            >
              <Link to="/book" className="btn-gold text-sm py-4 px-8">
                Book Appointment <FiArrowRight />
              </Link>
              <Link to="/services" className="btn-outline-gold text-sm py-4 px-8">
                Our Services
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="flex gap-12 mt-16"
            >
              {[{ num: '15+', label: 'Years Experience' }, { num: '5000+', label: 'Happy Clients' }, { num: '20+', label: 'Services' }].map((s) => (
                <div key={s.label}>
                  <div className="text-3xl font-bold gold-text font-serif">{s.num}</div>
                  <div className="text-gray-400 text-xs uppercase tracking-widest mt-1">{s.label}</div>
                </div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        >
          <div className="w-px h-12 bg-gradient-to-b from-gold-500 to-transparent" />
          <div className="w-1.5 h-1.5 rounded-full bg-gold-500" />
        </motion.div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader subtitle="Why Choose Us" title="The Sachin Difference" description="We combine traditional barbering craftsmanship with modern techniques to deliver a grooming experience like no other." />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {FEATURES.map((f, i) => (
              <motion.div
                key={f.title}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-dark p-8 text-center group hover:border-gold-500/40 transition-all duration-300"
              >
                <div className="text-gold-500 flex justify-center mb-5 group-hover:scale-110 transition-transform">
                  {f.icon}
                </div>
                <h3 className="font-serif text-xl font-semibold text-white mb-3">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="py-24 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader subtitle="What We Offer" title="Our Signature Services" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-16">
            {SERVICES_PREVIEW.map((s, i) => (
              <motion.div
                key={s.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="group relative overflow-hidden rounded-sm cursor-pointer"
              >
                <div className="relative h-72 overflow-hidden">
                  <img
                    src={s.img}
                    alt={s.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-serif text-xl font-bold text-white mb-1">{s.name}</h3>
                  <div className="flex items-center justify-between">
                    <span className="text-gold-500 font-semibold">{s.price}</span>
                    <Link to="/book" className="text-xs uppercase tracking-widest text-white hover:text-gold-500 transition-colors flex items-center gap-1">
                      Book <FiChevronRight size={14} />
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to="/services" className="btn-outline-gold">View All Services <FiArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* PRICING HIGHLIGHTS */}
      <section className="py-24 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <SectionHeader subtitle="Transparent Pricing" title="Quality Without Compromise" description="Premium services at prices that respect your pocket. No hidden charges, ever." center={false} />
              <div className="mt-10 space-y-4">
                {PRICING.map((p, i) => (
                  <motion.div
                    key={p.name}
                    variants={fadeUp}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="flex items-center justify-between py-4 border-b border-dark-600 group"
                  >
                    <div>
                      <span className="text-white font-medium group-hover:text-gold-500 transition-colors">{p.name}</span>
                      <span className="text-gray-500 text-xs ml-3">{p.duration}</span>
                    </div>
                    <span className="text-gold-500 font-semibold font-serif text-lg">{p.price}</span>
                  </motion.div>
                ))}
              </div>
              <Link to="/pricing" className="btn-gold mt-8 inline-flex">Full Price List <FiArrowRight /></Link>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <img
                src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=700&auto=format"
                alt="Barber at work"
                className="w-full h-96 lg:h-[580px] object-cover rounded-sm"
              />
              <div className="absolute -bottom-6 -left-6 bg-gold-500 text-black p-6 rounded-sm">
                <div className="font-serif text-4xl font-bold">15+</div>
                <div className="text-xs uppercase tracking-widest font-semibold">Years of Excellence</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader subtitle="Client Reviews" title="What Our Clients Say" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            {TESTIMONIALS.map((t, i) => (
              <motion.div
                key={t.name}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="card-dark p-8 relative"
              >
                <div className="text-gold-500 text-5xl font-serif absolute top-4 right-6 opacity-30">"</div>
                <div className="flex mb-4 gap-1">
                  {[...Array(t.rating)].map((_, j) => <FiStar key={j} className="text-gold-500 fill-gold-500" size={14} />)}
                </div>
                <p className="text-gray-300 text-sm leading-relaxed mb-6 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold-500/20 border border-gold-500/40 flex items-center justify-center font-serif font-bold text-gold-500">
                    {t.name[0]}
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">{t.name}</div>
                    <div className="text-gray-500 text-xs">Verified Client</div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY PREVIEW */}
      <section className="py-24 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader subtitle="Our Work" title="Gallery of Transformations" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-16">
            {[
              'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400&auto=format',
              'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400&auto=format',
              'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400&auto=format',
              'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=400&auto=format',
              'https://images.unsplash.com/photo-1541533848490-bc8115cd6522?w=400&auto=format',
              'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=400&auto=format',
              'https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=600&auto=forma',
              'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400&auto=format',
            ].map((img, i) => (
              <motion.div
                key={i}
                variants={fadeUp}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`overflow-hidden group ${i === 0 || i === 5 ? 'col-span-2' : ''}`}
              >
                <img
                  src={img}
                  alt={`Gallery ${i + 1}`}
                  className="w-full h-48 md:h-64 object-cover group-hover:scale-110 transition-transform duration-700"
                />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/gallery" className="btn-outline-gold">View Full Gallery <FiArrowRight /></Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-dark-900 relative overflow-hidden">
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[400px] font-serif text-gold-500">✦</div>
        </div>
        <div className="relative z-10 max-w-3xl mx-auto text-center px-4">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="section-subtitle">Ready to Transform?</p>
            <h2 className="section-title">Book Your Appointment Today</h2>
            <div className="gold-divider" />
            <p className="text-gray-400 mb-10 text-lg">
              Walk in confident. Walk out extraordinary. Your best look is just one booking away.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/book" className="btn-gold py-4 px-10 text-base">
                Book Now <FiArrowRight />
              </Link>
              <a href="tel:+919876543210" className="btn-outline-gold py-4 px-10 text-base">
                Call Us
              </a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}