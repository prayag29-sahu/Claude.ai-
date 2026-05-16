import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMenu, FiX, FiScissors, FiUser, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/services', label: 'Services' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/gallery', label: 'Gallery' },
  { to: '/contact', label: 'Contact' },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className={`fixed w-full z-50 transition-all duration-500 ${
      scrolled ? 'bg-dark-900/95 backdrop-blur-md shadow-lg border-b border-gold-500/20' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="text-gold-500 group-hover:scale-110 transition-transform">
              <FiScissors size={28} />
            </div>
            <div>
              <div className="font-serif font-bold text-xl text-white leading-none">Sachin</div>
              <div className="text-gold-500 text-xs tracking-[0.25em] uppercase leading-none">Men's Saloon</div>
            </div>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `text-sm uppercase tracking-widest transition-colors duration-200 ${
                    isActive ? 'text-gold-500' : 'text-gray-300 hover:text-gold-500'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          {/* Actions */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <>
                <Link
                  to={user.role === 'admin' ? '/admin' : '/dashboard'}
                  className="flex items-center gap-2 text-sm text-gray-300 hover:text-gold-500 transition-colors"
                >
                  <FiUser size={16} />
                  {user.name.split(' ')[0]}
                </Link>
                <button onClick={handleLogout} className="text-gray-400 hover:text-red-400 transition-colors">
                  <FiLogOut size={18} />
                </button>
              </>
            ) : (
              <Link to="/login" className="btn-outline-gold text-xs py-2 px-4">Login</Link>
            )}
            <Link to="/book" className="btn-gold text-xs py-2 px-5">Book Now</Link>
          </div>

          {/* Mobile hamburger */}
          <button className="lg:hidden text-white" onClick={() => setOpen(!open)}>
            {open ? <FiX size={24} /> : <FiMenu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-dark-800 border-t border-dark-600"
          >
            <div className="px-4 py-6 flex flex-col gap-4">
              {navLinks.map((link) => (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `text-sm uppercase tracking-widest py-2 ${isActive ? 'text-gold-500' : 'text-gray-300'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
              <div className="flex flex-col gap-3 pt-4 border-t border-dark-600">
                {user ? (
                  <>
                    <Link to={user.role === 'admin' ? '/admin' : '/dashboard'} onClick={() => setOpen(false)} className="btn-outline-gold text-center">
                      Dashboard
                    </Link>
                    <button onClick={() => { handleLogout(); setOpen(false); }} className="btn-outline-gold opacity-70">
                      Logout
                    </button>
                  </>
                ) : (
                  <Link to="/login" onClick={() => setOpen(false)} className="btn-outline-gold text-center">Login</Link>
                )}
                <Link to="/book" onClick={() => setOpen(false)} className="btn-gold text-center justify-center">
                  Book Now
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
