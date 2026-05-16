import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMenuOpen(false)
    setUserMenuOpen(false)
  }, [location])

  const handleLogout = () => {
    logout()
    toast.success('Logged out successfully')
    navigate('/')
  }

  const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/services', label: 'Services' },
  ]

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
      scrolled ? 'bg-regal-950/95 backdrop-blur-xl shadow-lg border-b border-white/5' : 'bg-transparent'
    }`}>
      <div className="page-container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold group-hover:shadow-gold-lg transition-shadow duration-300">
              <span className="text-regal-950 font-accent font-bold text-lg">V</span>
            </div>
            <div>
              <span className="font-accent text-xl font-semibold text-gradient-gold">VisionVivaah</span>
              <p className="text-white/40 text-xs font-body tracking-widest -mt-1">EVENT MANAGEMENT</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => (
              <Link
                key={link.to}
                to={link.to}
                className={`font-body text-sm font-medium transition-colors duration-200 ${
                  location.pathname === link.to
                    ? 'text-gold-400'
                    : 'text-white/70 hover:text-gold-400'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin && (
              <Link
                to="/admin"
                className={`font-body text-sm font-medium transition-colors duration-200 ${
                  location.pathname.startsWith('/admin') ? 'text-gold-400' : 'text-white/70 hover:text-gold-400'
                }`}
              >
                Admin
              </Link>
            )}
          </div>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 glass-card px-3 py-2 hover:border-gold-500/30 transition-all duration-200"
                >
                  <div className="w-8 h-8 rounded-full bg-gold-gradient flex items-center justify-center">
                    <span className="text-regal-950 font-bold text-sm">{user?.name?.[0]?.toUpperCase()}</span>
                  </div>
                  <span className="text-white/80 font-body text-sm">{user?.name?.split(' ')[0]}</span>
                  <svg className={`w-4 h-4 text-white/40 transition-transform ${userMenuOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 glass-card border border-white/10 rounded-xl overflow-hidden shadow-card">
                    <Link to="/dashboard" className="block px-4 py-3 text-white/80 hover:text-gold-400 hover:bg-white/5 font-body text-sm transition-colors">
                      📋 My Bookings
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="block px-4 py-3 text-white/80 hover:text-gold-400 hover:bg-white/5 font-body text-sm transition-colors">
                        ⚙️ Admin Panel
                      </Link>
                    )}
                    <hr className="border-white/10" />
                    <button onClick={handleLogout} className="w-full text-left px-4 py-3 text-red-400 hover:bg-red-500/10 font-body text-sm transition-colors">
                      🚪 Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link to="/login" className="btn-ghost text-sm">Login</Link>
                <Link to="/register" className="btn-gold text-sm px-5 py-2.5">Get Started</Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-white/70 hover:text-gold-400 p-2"
          >
            {menuOpen ? (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden glass-card border-t border-white/10 py-4 px-2 mb-2 rounded-xl">
            {navLinks.map(link => (
              <Link key={link.to} to={link.to} className="block px-4 py-3 text-white/80 hover:text-gold-400 font-body text-sm">
                {link.label}
              </Link>
            ))}
            {isAdmin && <Link to="/admin" className="block px-4 py-3 text-white/80 hover:text-gold-400 font-body text-sm">Admin Panel</Link>}
            <hr className="border-white/10 my-2" />
            {isAuthenticated ? (
              <>
                <Link to="/dashboard" className="block px-4 py-3 text-white/80 hover:text-gold-400 font-body text-sm">My Bookings</Link>
                <button onClick={handleLogout} className="block w-full text-left px-4 py-3 text-red-400 font-body text-sm">Logout</button>
              </>
            ) : (
              <div className="flex gap-3 px-4 pt-2">
                <Link to="/login" className="btn-outline-gold text-sm flex-1 text-center">Login</Link>
                <Link to="/register" className="btn-gold text-sm flex-1 text-center">Register</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}
