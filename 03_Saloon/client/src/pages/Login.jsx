import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiMail, FiLock, FiEye, FiEyeOff, FiScissors } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  // const handleSubmit = async e => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const data = await login(form.email, form.password);
  //     toast.success(`Welcome back, ${data.user.name}!`);
  //     navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');
  //   } catch (err) {
  //     toast.error(err.response?.data?.message || 'Login failed');
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);

    try {
      // ✅ DEMO LOGIN CONDITION
      if (
        form.email === 'admin@sachinsaloon.com' &&
        form.password === 'Admin@123'
      ) {
        toast.success('Welcome back, Demo Admin!');

        // Store demo user in localStorage (optional)
        const demoUser = {
          user: {
            name: 'Demo Admin',
            email: 'admin@sachinsaloon.com',
            role: 'admin',
          },
          token: 'demo-token'
        };

        localStorage.setItem('auth', JSON.stringify(demoUser));
        navigate('/dashboard');
        return;
      }

      // ✅ Normal Backend Login
      const data = await login(form.email, form.password);
      toast.success(`Welcome back, ${data.user.name}!`);
      navigate(data.user.role === 'admin' ? '/admin' : '/dashboard');

    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="card-dark p-10">
          <div className="text-center mb-10">
            <FiScissors className="text-gold-500 mx-auto mb-4" size={36} />
            <h1 className="font-serif text-3xl font-bold text-white">Welcome Back</h1>
            <p className="text-gray-400 mt-2 text-sm">Sign in to your account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Email</label>
              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="input-dark pl-10" placeholder="your@email.com" required />
              </div>
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                <input type={showPass ? 'text' : 'password'} value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} className="input-dark pl-10 pr-10" placeholder="••••••••" required />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gold-500">
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-gold w-full justify-center py-3.5 disabled:opacity-50">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-4 p-3 bg-dark-600 rounded-sm text-xs text-gray-500 text-center">
            <p>Demo: <span className="text-gold-500">admin@sachinsaloon.com</span> / Admin@123</p>
          </div>

          <p className="text-center text-gray-400 text-sm mt-6">
            Don't have an account? <Link to="/register" className="text-gold-500 hover:underline">Register</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}