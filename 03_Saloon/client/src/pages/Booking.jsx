import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiCalendar, FiClock, FiUser, FiPhone, FiMail, FiArrowRight } from 'react-icons/fi';
import { api } from '../context/AuthContext';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/common/Spinner';

export default function Booking() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [services, setServices] = useState([]);
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(false);
  const [slotsLoading, setSlotsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    serviceId: location.state?.serviceId || '',
    date: '',
    timeSlot: '',
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
    paymentMethod: 'cash',
    notes: '',
  });

  useEffect(() => {
    api.get('/services').then(r => setServices(r.data.services)).catch(() => {});
  }, []);

  useEffect(() => {
    if (form.date) {
      setSlotsLoading(true);
      api.get(`/bookings/slots?date=${form.date}`)
        .then(r => setSlots(r.data.slots || []))
        .catch(() => setSlots([]))
        .finally(() => setSlotsLoading(false));
    }
  }, [form.date]);

  const handleChange = e => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async e => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (!form.serviceId || !form.date || !form.timeSlot) {
      toast.error('Please fill all required fields'); return;
    }
    setLoading(true);
    try {
      await api.post('/bookings', form);
      setSuccess(true);
      toast.success('Appointment booked successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-dark-900 pt-20">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center max-w-md mx-auto px-4">
          <div className="w-24 h-24 border-2 border-gold-500 rounded-full flex items-center justify-center mx-auto mb-8">
            <span className="text-4xl">✓</span>
          </div>
          <h2 className="font-serif text-4xl font-bold text-white mb-4">Booking Confirmed!</h2>
          <p className="text-gray-400 mb-8">Your appointment has been booked. We'll see you soon!</p>
          <div className="flex gap-4 justify-center">
            <button onClick={() => navigate('/dashboard')} className="btn-gold">View Dashboard</button>
            <button onClick={() => { setSuccess(false); setForm({ ...form, date: '', timeSlot: '' }); }} className="btn-outline-gold">Book Another</button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="pt-20 min-h-screen bg-dark-900">
      <div className="py-20 bg-dark-800 text-center">
        <p className="section-subtitle">Reserve Your Slot</p>
        <h1 className="section-title">Book Appointment</h1>
        <div className="gold-divider" />
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {!user && (
          <div className="mb-8 p-4 border border-gold-500/40 bg-gold-500/5 text-center rounded-sm">
            <p className="text-gold-500 text-sm">Please <button onClick={() => navigate('/login')} className="underline font-semibold">login</button> to book an appointment.</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Service */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Select Service *</label>
            <select name="serviceId" value={form.serviceId} onChange={handleChange} className="input-dark" required>
              <option value="">Choose a service...</option>
              {services.map(s => (
                <option key={s._id} value={s._id}>{s.title} — ₹{s.price} ({s.duration} min)</option>
              ))}
            </select>
          </div>

          {/* Date */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Select Date *</label>
              <input type="date" name="date" min={today} value={form.date} onChange={handleChange} className="input-dark" required />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Select Time Slot *</label>
              {slotsLoading ? <div className="input-dark flex items-center gap-2 text-gray-500"><Spinner size="sm" /> Loading slots...</div> : (
                <select name="timeSlot" value={form.timeSlot} onChange={handleChange} className="input-dark" required disabled={!form.date}>
                  <option value="">{form.date ? 'Select time...' : 'Choose date first'}</option>
                  {slots.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              )}
            </div>
          </div>

          {/* Personal Info */}
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Full Name *</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} className="input-dark" placeholder="Your full name" required />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Phone *</label>
              <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="input-dark" placeholder="+91 99999 99999" required />
            </div>
          </div>

          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Email</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} className="input-dark" placeholder="your@email.com" />
          </div>

          {/* Payment Method */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-3">Payment Method</label>
            <div className="flex gap-4">
              {['cash', 'online'].map(method => (
                <label key={method} className={`flex-1 flex items-center justify-center gap-2 py-3 border cursor-pointer transition-all text-sm uppercase tracking-widest ${
                  form.paymentMethod === method ? 'border-gold-500 text-gold-500 bg-gold-500/10' : 'border-dark-500 text-gray-400'
                }`}>
                  <input type="radio" name="paymentMethod" value={method} checked={form.paymentMethod === method} onChange={handleChange} className="hidden" />
                  {method === 'cash' ? '💵 Cash' : '📱 Online'}
                </label>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Special Notes</label>
            <textarea name="notes" value={form.notes} onChange={handleChange} rows={3} className="input-dark resize-none" placeholder="Any special requests or preferences..." />
          </div>

          <button type="submit" disabled={loading || !user} className="btn-gold w-full justify-center py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? 'Booking...' : <>Confirm Appointment <FiArrowRight /></>}
          </button>
        </form>
      </div>
    </div>
  );
}