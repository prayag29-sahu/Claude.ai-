import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { Shield } from 'lucide-react'

export default function AdminLogin() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const user = await login(data.email, data.password)
      if (user.role !== 'admin') { toast.error('Not authorized as admin'); return }
      toast.success('Welcome, Admin!')
      navigate('/admin/dashboard')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Login failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <Link to="/" className="font-serif text-2xl text-cream">The <span className="text-gold italic">Lightroom</span></Link>
          <div className="flex items-center justify-center gap-2 mt-2">
            <Shield size={14} className="text-gold" />
            <p className="text-grey-light text-sm">Admin Portal</p>
          </div>
        </div>
        <div className="bg-card border border-border p-8">
          <h2 className="font-serif text-2xl font-light mb-6">Admin Login</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="form-label">Email</label>
              <input className="form-input" type="email" {...register('email', { required: true })} />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input className="form-input" type="password" {...register('password', { required: true })} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-gold text-black py-3.5 text-xs tracking-widest uppercase hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
              {loading ? 'Authenticating...' : 'Login as Admin'}
            </button>
          </form>
        </div>
        <p className="text-center mt-4 text-grey text-xs">
          <Link to="/client/login" className="hover:text-gold transition-colors">← Client Login</Link>
        </p>
      </div>
    </div>
  )
}
