import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', confirmPassword: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const { register } = useAuth()
  const navigate = useNavigate()

  const validate = () => {
    const e = {}
    if (!form.name || form.name.length < 2) e.name = 'Name must be at least 2 characters'
    if (!form.email || !/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Enter a valid email'
    if (form.phone && !/^[0-9]{10}$/.test(form.phone)) e.phone = 'Enter valid 10-digit phone'
    if (!form.password || form.password.length < 6) e.password = 'Password must be at least 6 characters'
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    try {
      const { name, email, phone, password } = form
      const data = await register({ name, email, phone, password })
      toast.success(`Welcome to VisionVivaah, ${data.user.name.split(' ')[0]}! 🎉`)
      navigate('/')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
      setErrors({ general: err.response?.data?.message || 'Registration failed' })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm(p => ({ ...p, [name]: value }))
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }))
  }

  const passwordStrength = (pwd) => {
    if (!pwd) return { label: '', color: 'bg-white/10', width: '0%' }
    let score = 0
    if (pwd.length >= 6) score++
    if (pwd.length >= 10) score++
    if (/[A-Z]/.test(pwd)) score++
    if (/[0-9]/.test(pwd)) score++
    if (/[^A-Za-z0-9]/.test(pwd)) score++
    const levels = [
      { label: 'Weak', color: 'bg-red-500', width: '20%' },
      { label: 'Fair', color: 'bg-orange-500', width: '40%' },
      { label: 'Good', color: 'bg-yellow-500', width: '60%' },
      { label: 'Strong', color: 'bg-green-500', width: '80%' },
      { label: 'Very Strong', color: 'bg-emerald-500', width: '100%' },
    ]
    return levels[Math.min(score - 1, 4)]
  }

  const strength = passwordStrength(form.password)

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden py-16">
      <div className="absolute inset-0">
        <img src="https://images.unsplash.com/photo-1478146059778-26ede37e3e4e?w=1600" alt=""
          className="w-full h-full object-cover opacity-20" />
        <div className="absolute inset-0 bg-regal-950/80 backdrop-blur-sm" />
      </div>
      <div className="absolute top-1/4 right-10 w-72 h-72 rounded-full bg-gold-500/5 blur-3xl" />
      <div className="absolute bottom-1/4 left-10 w-72 h-72 rounded-full bg-regal-600/10 blur-3xl" />

      <div className="relative z-10 w-full max-w-md px-4">
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-full bg-gold-gradient flex items-center justify-center shadow-gold">
              <span className="text-regal-950 font-accent font-bold text-xl">V</span>
            </div>
            <span className="font-accent text-2xl text-gradient-gold">VisionVivaah</span>
          </Link>
          <h1 className="font-display text-3xl font-semibold text-white">Create Account</h1>
          <p className="font-body text-white/50 mt-2">Join thousands of satisfied clients</p>
        </div>

        <div className="glass-card p-8">
          {errors.general && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 mb-5 text-red-400 font-body text-sm text-center">
              {errors.general}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="label-luxury">Full Name *</label>
              <input type="text" name="name" placeholder="Rajesh Kumar"
                value={form.name} onChange={handleChange} className="input-luxury" autoComplete="name" />
              {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name}</p>}
            </div>

            <div>
              <label className="label-luxury">Email Address *</label>
              <input type="email" name="email" placeholder="your@email.com"
                value={form.email} onChange={handleChange} className="input-luxury" autoComplete="email" />
              {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label className="label-luxury">Phone Number</label>
              <input type="tel" name="phone" placeholder="10-digit mobile number"
                value={form.phone} onChange={handleChange} className="input-luxury" />
              {errors.phone && <p className="text-red-400 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label className="label-luxury">Password *</label>
              <div className="relative">
                <input type={showPassword ? 'text' : 'password'} name="password"
                  placeholder="Min. 6 characters" value={form.password}
                  onChange={handleChange} className="input-luxury pr-12" autoComplete="new-password" />
                <button type="button" onClick={() => setShowPassword(p => !p)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-white/60 transition-colors text-sm">
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
              {form.password && (
                <div className="mt-2">
                  <div className="h-1 rounded-full bg-white/10 overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-300 ${strength.color}`}
                      style={{ width: strength.width }} />
                  </div>
                  <p className="text-xs font-body text-white/40 mt-1">{strength.label}</p>
                </div>
              )}
              {errors.password && <p className="text-red-400 text-xs mt-1">{errors.password}</p>}
            </div>

            <div>
              <label className="label-luxury">Confirm Password *</label>
              <input type="password" name="confirmPassword" placeholder="Re-enter password"
                value={form.confirmPassword} onChange={handleChange}
                className="input-luxury" autoComplete="new-password" />
              {errors.confirmPassword && <p className="text-red-400 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            <p className="font-body text-white/30 text-xs leading-relaxed">
              By registering, you agree to our{' '}
              <a href="#" className="text-gold-400 hover:underline">Terms of Service</a> and{' '}
              <a href="#" className="text-gold-400 hover:underline">Privacy Policy</a>.
            </p>

            <button type="submit" disabled={loading}
              className="btn-gold w-full py-3.5 text-base flex items-center justify-center gap-2 disabled:opacity-60">
              {loading ? (
                <><div className="w-4 h-4 border-2 border-regal-950 border-t-transparent rounded-full animate-spin" /> Creating Account...</>
              ) : 'Create Account ✨'}
            </button>
          </form>
        </div>

        <p className="text-center font-body text-white/40 text-sm mt-6">
          Already have an account?{' '}
          <Link to="/login" className="text-gold-400 hover:text-gold-300 transition-colors">
            Sign in →
          </Link>
        </p>
      </div>
    </div>
  )
}
