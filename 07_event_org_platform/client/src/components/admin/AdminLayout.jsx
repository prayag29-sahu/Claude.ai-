import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: '📊', exact: true },
  { to: '/admin/bookings', label: 'Bookings', icon: '📋' },
  { to: '/admin/services', label: 'Services', icon: '🎪' },
  { to: '/admin/users', label: 'Users', icon: '👥' },
]

export default function AdminLayout({ children, title }) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    toast.success('Logged out')
    navigate('/')
  }

  const isActive = (item) =>
    item.exact ? location.pathname === item.to : location.pathname.startsWith(item.to)

  return (
    <div className="min-h-screen flex bg-regal-950">
      {/* Sidebar Overlay (mobile) */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 w-64 flex flex-col bg-regal-900/80 backdrop-blur-xl border-r border-white/5
        transform transition-transform duration-300 lg:translate-x-0
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold">
              <span className="text-regal-950 font-accent font-bold text-lg">V</span>
            </div>
            <div>
              <span className="font-accent text-lg text-gradient-gold block">VisionVivaah</span>
              <span className="font-body text-white/30 text-xs">Admin Panel</span>
            </div>
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => (
            <Link key={item.to} to={item.to}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-body text-sm font-medium transition-all duration-200 ${
                isActive(item)
                  ? 'bg-gold-gradient text-regal-950 shadow-gold'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`}>
              <span className="text-base">{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>

        {/* User */}
        <div className="p-4 border-t border-white/5">
          <div className="glass-card p-3 flex items-center gap-3 mb-3">
            <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0">
              <span className="text-regal-950 font-bold text-sm">{user?.name?.[0]}</span>
            </div>
            <div className="min-w-0">
              <p className="font-body text-white text-sm font-medium truncate">{user?.name}</p>
              <p className="font-body text-white/30 text-xs">Administrator</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Link to="/" className="flex-1 text-center btn-ghost text-xs py-2">← Site</Link>
            <button onClick={handleLogout} className="flex-1 text-center text-xs py-2 rounded-lg border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all font-body">
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Bar */}
        <header className="sticky top-0 z-20 bg-regal-950/90 backdrop-blur-xl border-b border-white/5 px-6 py-4 flex items-center gap-4">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-white/50 hover:text-white">
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <h1 className="font-display text-xl font-semibold text-white">{title}</h1>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
