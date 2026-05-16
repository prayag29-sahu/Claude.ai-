import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const from = location.state?.from || '/'

  const validate = () => {
    const e = {}
    if (!form.email) e.email = 'Email is required'
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email'
    if (!form.password) e.password = 'Password is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const data = await login(form)
      toast.success(`Welcome back, ${data.user.name.split(' ')[0]}! ✨`)
      navigate(data.user.role === 'admin' ? '/admin' : from)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
      setErrors({ general: err.response?.data?.message || 'Invalid credentials' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1600" alt=""
          className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-regal-950/80 backdrop-blur-sm" />
      </div>
      <div className="absolute top-1/4 left-10 w-72 h-72 rounded-full bg-gold-500/5 blur-3xl" />
      <div className="absolute bottom-1/4 right-10 w-72 h-72 rounded-full bg-regal-600/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md px-4 py-16">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold">
              <span className="text-regal-950 font-accent font-bold text-xl">V</span>
            </div>
            <span className="font-accent text-2xl text-gradient-gold">VisionVivaah</span>
          </Link>
          <h1 className="font-display text-3xl font-semibold text-white">Welcome Back</h1>
          <p className="font-body text-white/50 mt-2">Sign in to manage your events</p>
        </div>

        {/* Form Card */}
        <div className="glass-card p-8">
          {errors.general && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-5 text-red-400 font-body text-sm text-center">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-luxury">Email Address</label>
              <input
                type="email"
                placeholder="your@email.com"
                value={form.email}
                onChange={e => { setForm(p => ({ ...p, email: e.target.value })); setErrors(p => ({ ...p, email: '' })) }}
                className="input-luxury"
                autoComplete="email"
              />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="label-luxury">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Your password"
                  value={form.password}
                  onChange={e => { setForm(p => ({ ...p, password: e.target.value })); setErrors(p => ({ ...p, password: '' })) }}
                  className="input-luxury pr-12"
                  autoComplete="current-password"
                />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-sm">
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="btn-gold w-full py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-regal-950 border-t-transparent rounded-full animate-spin" /> Signing In...</>
              ) : 'Sign In →'}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-4 my-6">
            <div className="flex-1 h-px bg-white/10" />
            <span className="font-body text-white/30 text-xs">or continue with</span>
            <div className="flex-1 h-px bg-white/10" />
          </div>

          {/* Demo Credentials */}
          <div className="space-y-2">
            <p className="font-body text-white/30 text-xs text-center mb-3">Demo Credentials</p>
            {[
              { role: 'User', email: 'rajesh@example.com', password: 'User@123' },
              { role: 'Admin', email: 'admin@eventplatform.com', password: 'Admin@123' },
            ].map(demo => (
              <button key={demo.role} type="button"
                onClick={() => setForm({ email: demo.email, password: demo.password })}
                className="w-full glass-card px-4 py-2.5 text-left hover:border-gold-500/30 transition-all duration-200">
                <span className="badge-gold text-xs mr-2">{demo.role}</span>
                <span className="font-body text-white/50 text-xs">{demo.email}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center font-body text-white/40 text-sm mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-gold-400 hover:text-gold-300 transition-colors">
            Create one free →
          </Link>
        </p>
      </div>
    </div>
  )
}
