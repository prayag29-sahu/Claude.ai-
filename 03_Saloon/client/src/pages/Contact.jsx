import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiPhone, FiMail, FiMapPin, FiClock } from 'react-icons/fi';
import { FaWhatsapp, FaInstagram } from 'react-icons/fa';

export default function Contact() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    await new Promise(r => setTimeout(r, 1000));
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: '', email: '', phone: '', message: '' });
    setLoading(false);
  };

  const INFO = [
    { icon: <FiMapPin size={20} />, title: 'Our Location', text: '123, Main Street, Near City Mall, Your City - 400001' },
    { icon: <FiPhone size={20} />, title: 'Call Us', text: '+91 98765 43210', link: 'tel:+919876543210' },
    { icon: <FiMail size={20} />, title: 'Email Us', text: 'info@sachinsaloon.com', link: 'mailto:info@sachinsaloon.com' },
    { icon: <FiClock size={20} />, title: 'Working Hours', text: 'Mon–Sat: 9AM–8PM | Sun: 10AM–6PM' },
  ];

  return (
    <div className="pt-20">
      <div className="py-24 bg-dark-800 text-center">
        <p className="section-subtitle">Get In Touch</p>
        <h1 className="section-title">Contact Us</h1>
        <div className="gold-divider" />
      </div>

      <section className="py-24 bg-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            {/* Form */}
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="font-serif text-3xl font-bold text-white mb-8">Send Us a Message</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Name *</label>
                    <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-dark" placeholder="Your name" required />
                  </div>
                  <div>
                    <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Phone</label>
                    <input type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} className="input-dark" placeholder="+91 99999 99999" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Email *</label>
                  <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-dark" placeholder="your@email.com" required />
                </div>
                <div>
                  <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Message *</label>
                  <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={5} className="input-dark resize-none" placeholder="How can we help you?" required />
                </div>
                <button type="submit" disabled={loading} className="btn-gold w-full justify-center py-4">
                  {loading ? 'Sending...' : 'Send Message'}
                </button>
              </form>

              <div className="flex gap-4 mt-8">
                <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors text-sm">
                  <FaWhatsapp size={20} /> WhatsApp Us
                </a>
                <a href="https://instagram.com" target="_blank" rel="noreferrer" className="flex items-center gap-2 text-pink-400 hover:text-pink-300 transition-colors text-sm">
                  <FaInstagram size={20} /> Follow on Instagram
                </a>
              </div>
            </motion.div>

            {/* Info */}
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="space-y-4 mb-10">
                {INFO.map((item, i) => (
                  <div key={i} className="card-dark p-6 flex items-start gap-4">
                    <div className="text-gold-500 mt-0.5 flex-shrink-0">{item.icon}</div>
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gray-500 mb-1">{item.title}</p>
                      {item.link ? (
                        <a href={item.link} className="text-white hover:text-gold-500 transition-colors">{item.text}</a>
                      ) : (
                        <p className="text-white">{item.text}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Map */}
              <div className="rounded-sm overflow-hidden h-72">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d241317.11609823055!2d72.88118615!3d19.0822507!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7b63aceef0c55%3A0xe0b9538c0a47aa16!2sMumbai%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1704067200000!5m2!1sen!2sin"
                  width="100%"
                  height="100%"
                  style={{ border: 0, filter: 'grayscale(80%) invert(90%)' }}
                  allowFullScreen=""
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Sachin Saloon Location"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  );
}