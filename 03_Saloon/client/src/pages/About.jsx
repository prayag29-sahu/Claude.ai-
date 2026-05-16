import React from 'react';
import { motion } from 'framer-motion';
import { FiAward, FiUsers, FiStar, FiHeart } from 'react-icons/fi';
import SectionHeader from '../components/common/SectionHeader';

const TEAM = [
  { name: 'Sachin Kumar', role: 'Founder & Master Barber', exp: '15+ years', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format' },
  { name: 'Ravi Shankar', role: 'Senior Stylist', exp: '10+ years', img: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&auto=format' },
  { name: 'Ankit Mehta', role: 'Beard Specialist', exp: '8+ years', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=300&auto=format' },
  { name: 'Deepak Singh', role: 'Color Technician', exp: '7+ years', img: 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?w=300&auto=format' },
];

const STATS = [
  { icon: <FiUsers size={24} />, value: '5000+', label: 'Happy Clients' },
  { icon: <FiAward size={24} />, value: '15+', label: 'Years Experience' },
  { icon: <FiStar size={24} />, value: '4.9★', label: 'Average Rating' },
  { icon: <FiHeart size={24} />, value: '20+', label: 'Premium Services' },
];

export default function About() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <div className="relative py-32 overflow-hidden">
        <div className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=1920&auto=format')" }} />
        <div className="absolute inset-0 bg-dark-900/80" />
        <div className="relative z-10 text-center">
          <p className="section-subtitle">Our Story</p>
          <h1 className="section-title text-5xl md:text-6xl">About Sachin's Saloon</h1>
          <div className="gold-divider" />
        </div>
      </div>

      {/* Story */}
      <section className="py-24 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <img src="https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=700&auto=format" alt="Our Story" className="w-full h-[500px] object-cover rounded-sm" />
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="section-subtitle">Founded in 2010</p>
              <h2 className="section-title text-4xl">Our Story</h2>
              <div className="w-16 h-px bg-gold-500 mb-6" />
              <div className="space-y-4 text-gray-400 leading-relaxed">
                <p>Sachin Men's Saloon was founded by Sachin Kumar with a simple vision — to bring luxury grooming within reach of every man. Starting from a single-chair setup in 2010, Sachin built his reputation on precision, patience, and passion for the craft.</p>
                <p>Over 15 years, the salon grew from a neighborhood barber shop into a premium grooming destination, known for exceptional service, hygienic environment, and consistent results. Every cut, every shave, every style is executed with the same dedication that started this journey.</p>
                <p>Today, we serve thousands of clients who trust us with their appearance and their confidence. Our team of expert barbers brings collective expertise of over 60 years to deliver transformations, not just haircuts.</p>
              </div>
              <div className="mt-8 p-6 border-l-2 border-gold-500 bg-dark-700">
                <p className="text-white italic font-serif text-lg">"A man who looks good, feels good. And a man who feels good, conquers the world."</p>
                <p className="text-gold-500 text-sm mt-2">— Sachin Kumar, Founder</p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {STATS.map((s, i) => (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="card-dark p-8 text-center">
                <div className="text-gold-500 flex justify-center mb-4">{s.icon}</div>
                <div className="font-serif text-4xl font-bold gold-text mb-2">{s.value}</div>
                <div className="text-gray-400 text-sm uppercase tracking-widest">{s.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-dark-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader subtitle="Our Purpose" title="Vision & Mission" />
          <div className="grid md:grid-cols-2 gap-8 mt-16">
            {[
              { title: 'Our Vision', icon: '🎯', text: 'To be the most trusted men\'s grooming brand in India — where every man walks out looking and feeling his absolute best. We envision a world where premium grooming is accessible, consistent, and confidence-inspiring.' },
              { title: 'Our Mission', icon: '✦', text: 'To deliver exceptional grooming experiences using the finest techniques and products, in a hygienic and welcoming environment. We are committed to continuous learning, client satisfaction, and setting new standards in men\'s grooming.' },
            ].map((item) => (
              <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card-dark p-10">
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-serif text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader subtitle="Meet the Experts" title="Our Master Barbers" description="Passionate professionals dedicated to making you look your finest." />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-16">
            {TEAM.map((m, i) => (
              <motion.div key={m.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="group text-center">
                <div className="relative mb-6 overflow-hidden rounded-sm">
                  <img src={m.img} alt={m.name} className="w-full h-72 object-cover group-hover:scale-110 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <h3 className="font-serif text-xl font-bold text-white mb-1">{m.name}</h3>
                <p className="text-gold-500 text-sm mb-1">{m.role}</p>
                <p className="text-gray-500 text-xs">{m.exp} Experience</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}