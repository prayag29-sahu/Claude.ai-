import { useState, useEffect } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

const links = [
  { to: '/', label: 'Home' },
  { to: '/portfolio', label: 'Portfolio' },
  { to: '/services', label: 'Services' },
  { to: '/videos', label: 'Films' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/contact', label: 'Contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen]         = useState(false)
  const { pathname }            = useLocation()

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  useEffect(() => setOpen(false), [pathname])

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-[100] flex items-center justify-between transition-all duration-500 ${
        scrolled ? 'bg-black/95 backdrop-blur-xl border-b border-border py-4 px-[5%]' : 'py-6 px-[5%]'
      }`}>
        <Link to="/" className="font-serif text-xl tracking-wide text-cream">
          The <span className="text-gold italic">Lightroom</span>
        </Link>

        {/* Desktop Links */}
        <ul className="hidden lg:flex items-center gap-8">
          {links.map(l => (
            <li key={l.to}>
              <NavLink to={l.to} end={l.to === '/'}
                className={({ isActive }) =>
                  `text-[0.72rem] tracking-[0.15em] uppercase transition-colors duration-300 ${isActive ? 'text-gold' : 'text-grey-light hover:text-gold'}`
                }>
                {l.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Desktop CTA – Contact (Login/Signup hidden but not removed) */}
        <div className="hidden lg:flex items-center gap-3">
          {/* Auth buttons intentionally hidden for public-facing mode */}
          {/* <Link to="/client/login" className="...">Login</Link> */}
          <Link
            to="/contact"
            className="text-[0.72rem] tracking-[0.15em] uppercase border border-gold text-gold px-5 py-2.5 hover:bg-gold hover:text-black transition-all duration-300"
          >
            Get a Quote
          </Link>
        </div>

        {/* Mobile hamburger */}
        <button onClick={() => setOpen(!open)} className="lg:hidden text-cream">
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[99] bg-black/98 backdrop-blur-2xl flex flex-col items-center justify-center gap-8">
            {links.map((l, i) => (
              <motion.div key={l.to} initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}>
                <Link to={l.to} onClick={() => setOpen(false)}
                  className="font-serif text-4xl font-light text-cream hover:text-gold transition-colors duration-300">
                  {l.label}
                </Link>
              </motion.div>
            ))}
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
              <Link to="/contact" onClick={() => setOpen(false)} className="btn-primary mt-4">Get a Quote</Link>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
