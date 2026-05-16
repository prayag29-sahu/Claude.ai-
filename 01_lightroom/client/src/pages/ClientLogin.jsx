import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useState } from 'react'
import toast from 'react-hot-toast'

export default function ClientLogin() {
  const { login, register: registerUser } = useAuth()
  const navigate = useNavigate()
  const [isRegister, setIsRegister] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors } } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      if (isRegister) {
        await registerUser(data)
        toast.success('Account created!')
      } else {
        await login(data.email, data.password)
        toast.success('Welcome back!')
      }
      navigate('/client/dashboard')
    } catch (e) {
      toast.error(e.response?.data?.message || 'Authentication failed')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link to="/" className="font-serif text-2xl text-cream">The <span className="text-gold italic">Lightroom</span></Link>
          <p className="text-grey-light text-sm mt-2">Client Portal</p>
        </div>
        <div className="bg-card border border-border p-8">
          <h2 className="font-serif text-2xl font-light mb-6">{isRegister ? 'Create Account' : 'Welcome Back'}</h2>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {isRegister && (
              <div>
                <label className="form-label">Full Name</label>
                <input className="form-input" placeholder="Your name" {...register('name', { required: isRegister })} />
              </div>
            )}
            <div>
              <label className="form-label">Email</label>
              <input className="form-input" type="email" placeholder="your@email.com" {...register('email', { required: true })} />
            </div>
            <div>
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="••••••••" {...register('password', { required: true, minLength: 6 })} />
            </div>
            {isRegister && (
              <div>
                <label className="form-label">Phone</label>
                <input className="form-input" placeholder="+91 00000 00000" {...register('phone')} />
              </div>
            )}
            <button type="submit" disabled={loading}
              className="w-full bg-gold text-black py-3.5 text-xs tracking-widest uppercase mt-2 hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2">
              {loading && <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
              {loading ? 'Please wait...' : (isRegister ? 'Create Account' : 'Login')}
            </button>
          </form>
          <p className="text-grey text-xs text-center mt-4">
            {isRegister ? 'Already have an account? ' : "Don't have an account? "}
            <button onClick={() => setIsRegister(!isRegister)} className="text-gold hover:underline">
              {isRegister ? 'Login' : 'Register'}
            </button>
          </p>
        </div>
        <p className="text-center mt-4 text-grey text-xs">
          <Link to="/admin/login" className="hover:text-gold transition-colors">Admin Login →</Link>
        </p>
      </div>
    </div>
  )
}
