import React from 'react';
import { Link } from 'react-router-dom';
import { FiScissors, FiPhone, FiMail, FiMapPin, FiInstagram, FiYoutube } from 'react-icons/fi';
import { FaWhatsapp, FaFacebook } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="bg-dark-800 border-t border-dark-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-3 mb-6">
              <FiScissors className="text-gold-500" size={28} />
              <div>
                <div className="font-serif font-bold text-xl">Sachin</div>
                <div className="text-gold-500 text-xs tracking-[0.25em] uppercase">Men's Saloon</div>
              </div>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Premium grooming experience for the modern man. Style that defines your personality since 2010.
            </p>
            <div className="flex gap-4">
              {[
                { icon: <FaWhatsapp />, href: 'https://wa.me/919876543210', color: 'hover:text-green-400' },
                { icon: <FiInstagram />, href: '#', color: 'hover:text-pink-400' },
                { icon: <FaFacebook />, href: '#', color: 'hover:text-blue-400' },
                { icon: <FiYoutube />, href: '#', color: 'hover:text-red-400' },
              ].map((s, i) => (
                <a key={i} href={s.href} target="_blank" rel="noreferrer"
                  className={`text-gray-400 ${s.color} transition-colors text-xl`}>
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold uppercase tracking-widest text-sm mb-6">Quick Links</h4>
            <ul className="space-y-3">
              {['/', '/about', '/services', '/pricing', '/gallery', '/book', '/contact'].map((path) => (
                <li key={path}>
                  <Link to={path} className="text-gray-400 hover:text-gold-500 transition-colors text-sm capitalize">
                    {path === '/' ? 'Home' : path.replace('/', '').charAt(0).toUpperCase() + path.slice(2)}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-white font-semibold uppercase tracking-widest text-sm mb-6">Our Services</h4>
            <ul className="space-y-3">
              {['Haircut & Styling', 'Beard Grooming', 'Hair Coloring', 'Facial & Skin Care', 'Hair Spa', 'Groom Packages'].map((s) => (
                <li key={s}>
                  <Link to="/services" className="text-gray-400 hover:text-gold-500 transition-colors text-sm">{s}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold uppercase tracking-widest text-sm mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-sm text-gray-400">
                <FiMapPin className="text-gold-500 mt-0.5 flex-shrink-0" />
                <span>123, Main Street, Near City Mall, Your City - 400001</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <FiPhone className="text-gold-500 flex-shrink-0" />
                <a href="tel:+919876543210" className="hover:text-gold-500 transition-colors">+91 98765 43210</a>
              </li>
              <li className="flex items-center gap-3 text-sm text-gray-400">
                <FiMail className="text-gold-500 flex-shrink-0" />
                <a href="mailto:info@sachinsaloon.com" className="hover:text-gold-500 transition-colors">info@sachinsaloon.com</a>
              </li>
            </ul>
            <div className="mt-6 pt-6 border-t border-dark-600">
              <p className="text-xs text-gold-500 uppercase tracking-widest mb-2">Hours</p>
              <p className="text-sm text-gray-400">Mon – Sat: 9:00 AM – 8:00 PM</p>
              <p className="text-sm text-gray-400">Sunday: 10:00 AM – 6:00 PM</p>
            </div>
          </div>
        </div>
      </div>
      <div className="border-t border-dark-600 py-6 text-center text-gray-500 text-sm">
        © {new Date().getFullYear()} Sachin Men's Saloon. All rights reserved. | Crafted with ❤️
      </div>
    </footer>
  );
}
