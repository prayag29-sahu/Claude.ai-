import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiUser, FiMail, FiLock, FiPhone, FiScissors } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = await register(form);
      toast.success(`Account created! Welcome, ${data.user.name}!`);
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { label: 'Full Name', name: 'name', type: 'text', icon: <FiUser />, placeholder: 'Your full name' },
    { label: 'Email', name: 'email', type: 'email', icon: <FiMail />, placeholder: 'your@email.com' },
    { label: 'Phone', name: 'phone', type: 'tel', icon: <FiPhone />, placeholder: '+91 99999 99999' },
    { label: 'Password', name: 'password', type: 'password', icon: <FiLock />, placeholder: '••••••••' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-900 px-4 py-12">
      <div className="w-full max-w-md">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="card-dark p-10">
          <div className="text-center mb-10">
            <FiScissors className="text-gold-500 mx-auto mb-4" size={36} />
            <h1 className="font-serif text-3xl font-bold text-white">Create Account</h1>
            <p className="text-gray-400 mt-2 text-sm">Join Sachin Men's Saloon</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {fields.map(f => (
              <div key={f.name}>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">{f.label}</label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">{f.icon}</span>
                  <input
                    type={f.type} name={f.name}
                    value={form[f.name]}
                    onChange={e => setForm({ ...form, [e.target.name]: e.target.value })}
                    className="input-dark pl-10" placeholder={f.placeholder}
                    required={f.name !== 'phone'}
                    minLength={f.name === 'password' ? 6 : undefined}
                  />
                </div>
              </div>
            ))}
            <button type="submit" disabled={loading} className="btn-gold w-full justify-center py-3.5 disabled:opacity-50">
              {loading ? 'Creating...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center text-gray-400 text-sm mt-6">
            Already have an account? <Link to="/login" className="text-gold-500 hover:underline">Sign In</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}