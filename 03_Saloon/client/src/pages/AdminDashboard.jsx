import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, CartesianGrid,
} from 'recharts';
import {
  FaUsers, FaCalendarAlt, FaMoneyBillWave, FaCheck, FaTimes, FaTrash,
  FaPlus, FaScissors, FaImage, FaTachometerAlt, FaListAlt, FaCog, FaChartBar,
} from 'react-icons/fa';
import API from '../utils/api';
import { Badge, Spinner, EmptyState } from '../components/ui';

const CATEGORIES = ['Haircut', 'Beard Styling', 'Hair Coloring', 'Facial & Skin Care', 'Hair Spa', 'Groom Package'];

// ─── Custom Tooltip for Charts ────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload?.length) {
    return (
      <div className="bg-dark-200 border border-dark-400 p-3 text-xs">
        <p className="text-gold">{label}</p>
        {payload.map((p) => (
          <p key={p.name} className="text-white">
            {p.name === 'revenue' ? `₹${p.value.toLocaleString()}` : p.value} {p.name}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// ─── Stats Card ───────────────────────────────────────────────
const StatCard = ({ icon, title, value, sub, color = 'text-gold' }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className="bg-dark-200 border border-dark-400 p-5"
  >
    <div className={`text-2xl ${color} mb-3`}>{icon}</div>
    <div className="font-serif text-3xl font-bold text-white mb-1">{value}</div>
    <div className="text-gray-500 text-sm">{title}</div>
    {sub && <div className="text-xs text-gray-600 mt-1">{sub}</div>}
  </motion.div>
);

// ─── Admin Dashboard ─────────────────────────────────────────
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('analytics');
  const [analytics, setAnalytics] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [services, setServices] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Service form state
  const [serviceForm, setServiceForm] = useState({ title: '', category: 'Haircut', description: '', price: '', duration: '', image: '' });
  const [serviceLoading, setServiceLoading] = useState(false);
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'analytics') {
        const { data } = await API.get('/admin/analytics');
        setAnalytics(data);
      } else if (activeTab === 'bookings') {
        const { data } = await API.get('/bookings/admin?limit=50');
        setBookings(data.bookings || []);
      } else if (activeTab === 'services') {
        const { data } = await API.get('/services?active=all');
        setServices(data.services || []);
      } else if (activeTab === 'users') {
        const { data } = await API.get('/admin/users');
        setUsers(data.users || []);
      }
    } catch (err) {
      toast.error('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  const updateBookingStatus = async (id, status) => {
    try {
      await API.put(`/bookings/${id}`, { status });
      toast.success(`Booking ${status}`);
      fetchData();
    } catch (err) {
      toast.error('Failed to update booking');
    }
  };

  const handleServiceSubmit = async (e) => {
    e.preventDefault();
    setServiceLoading(true);
    try {
      if (editingService) {
        await API.put(`/services/${editingService._id}`, serviceForm);
        toast.success('Service updated');
        setEditingService(null);
      } else {
        await API.post('/services', serviceForm);
        toast.success('Service created');
      }
      setServiceForm({ title: '', category: 'Haircut', description: '', price: '', duration: '', image: '' });
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed');
    } finally {
      setServiceLoading(false);
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try {
      await API.delete(`/services/${id}`);
      toast.success('Service deleted');
      fetchData();
    } catch (err) {
      toast.error('Failed to delete');
    }
  };

  const startEditService = (svc) => {
    setEditingService(svc);
    setServiceForm({ title: svc.title, category: svc.category, description: svc.description, price: svc.price, duration: svc.duration, image: svc.image || '' });
    setActiveTab('services');
    window.scrollTo(0, 0);
  };

  const cancelEdit = () => {
    setEditingService(null);
    setServiceForm({ title: '', category: 'Haircut', description: '', price: '', duration: '', image: '' });
  };

  const tabs = [
    { id: 'analytics', label: 'Analytics', icon: <FaChartBar /> },
    { id: 'bookings', label: 'Bookings', icon: <FaCalendarAlt /> },
    { id: 'services', label: 'Services', icon: <FaScissors /> },
    { id: 'users', label: 'Users', icon: <FaUsers /> },
  ];

  const statusColor = { pending: 'yellow', approved: 'green', cancelled: 'red', completed: 'blue' };

  return (
    <div className="pt-20 min-h-screen bg-dark">
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        {/* Header */}
        <div className="mb-10">
          <h1 className="font-serif text-3xl md:text-4xl font-bold text-white">
            Admin <span className="gold-gradient">Dashboard</span>
          </h1>
          <p className="text-gray-500 mt-1">Manage your saloon from one place</p>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-1 mb-8 bg-dark-200 p-1 w-fit">
          {tabs.map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest transition-all ${
                activeTab === id ? 'bg-gold text-black' : 'text-gray-400 hover:text-white'
              }`}
            >
              {icon} <span className="hidden sm:inline">{label}</span>
            </button>
          ))}
        </div>

        {/* ── Analytics Tab ── */}
        {activeTab === 'analytics' && (
          <div>
            {loading || !analytics ? (
              <div className="flex justify-center py-16"><Spinner gold size="lg" /></div>
            ) : (
              <>
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
                  <StatCard icon={<FaCalendarAlt />} title="Total Bookings" value={analytics.stats.totalBookings} />
                  <StatCard icon={<FaCog />} title="Pending" value={analytics.stats.pendingBookings} color="text-yellow-400" />
                  <StatCard icon={<FaCheck />} title="Approved" value={analytics.stats.approvedBookings} color="text-green-400" />
                  <StatCard icon={<FaMoneyBillWave />} title="Total Revenue" value={`₹${analytics.stats.totalRevenue?.toLocaleString()}`} color="text-gold" />
                  <StatCard icon={<FaUsers />} title="Total Clients" value={analytics.stats.totalUsers} color="text-blue-400" />
                  <StatCard icon={<FaScissors />} title="Active Services" value={analytics.stats.totalServices} color="text-purple-400" />
                  <StatCard icon={<FaTimes />} title="Cancelled" value={analytics.stats.cancelledBookings} color="text-red-400" />
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                  <div className="bg-dark-200 border border-dark-400 p-5">
                    <h3 className="font-serif text-white text-lg mb-5">Monthly Revenue</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={analytics.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                        <XAxis dataKey="month" stroke="#666" tick={{ fill: '#888', fontSize: 11 }} />
                        <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="revenue" fill="#d4af37" radius={[2, 2, 0, 0]} name="revenue" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="bg-dark-200 border border-dark-400 p-5">
                    <h3 className="font-serif text-white text-lg mb-5">Monthly Bookings</h3>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={analytics.chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                        <XAxis dataKey="month" stroke="#666" tick={{ fill: '#888', fontSize: 11 }} />
                        <YAxis stroke="#666" tick={{ fill: '#888', fontSize: 11 }} />
                        <Tooltip content={<CustomTooltip />} />
                        <Line type="monotone" dataKey="bookings" stroke="#d4af37" strokeWidth={2} dot={{ fill: '#d4af37', r: 4 }} name="bookings" />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Top Services */}
                {analytics.topServices?.length > 0 && (
                  <div className="bg-dark-200 border border-dark-400">
                    <div className="px-5 py-3 border-b border-dark-400">
                      <h3 className="font-serif text-white">Top Performing Services</h3>
                    </div>
                    <div className="divide-y divide-dark-400">
                      {analytics.topServices.map((svc, i) => (
                        <div key={svc._id} className="flex items-center justify-between px-5 py-3">
                          <div className="flex items-center gap-3">
                            <span className="text-gold font-bold text-sm w-6">#{i + 1}</span>
                            <span className="text-white text-sm">{svc.name}</span>
                          </div>
                          <div className="flex gap-6 text-sm">
                            <span className="text-gray-500">{svc.count} bookings</span>
                            <span className="text-gold font-bold">₹{svc.revenue?.toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* ── Bookings Tab ── */}
        {activeTab === 'bookings' && (
          <div>
            {loading ? (
              <div className="flex justify-center py-12"><Spinner gold /></div>
            ) : bookings.length === 0 ? (
              <EmptyState icon={<FaCalendarAlt />} title="No bookings" subtitle="No bookings found." />
            ) : (
              <div className="space-y-3">
                {bookings.map((b) => (
                  <div key={b._id} className="bg-dark-200 border border-dark-400 p-4 flex flex-col md:flex-row gap-4 md:items-center">
                    <div className="flex-1">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-white font-medium">{b.serviceId?.title || 'Service'}</p>
                          <p className="text-gray-500 text-sm">{b.customerName} • {b.customerPhone}</p>
                        </div>
                        <Badge color={statusColor[b.status] || 'gold'}>{b.status}</Badge>
                      </div>
                      <div className="flex flex-wrap gap-4 mt-2 text-xs text-gray-500">
                        <span>📅 {b.date}</span>
                        <span>🕐 {b.timeSlot}</span>
                        <span className="text-gold">₹{b.totalAmount}</span>
                        <span>{b.paymentMethod}</span>
                      </div>
                    </div>
                    {b.status === 'pending' && (
                      <div className="flex gap-2">
                        <button onClick={() => updateBookingStatus(b._id, 'approved')} className="bg-green-600/20 hover:bg-green-600 text-green-400 hover:text-white border border-green-600/30 px-3 py-1.5 text-xs transition-all">
                          <FaCheck /> Approve
                        </button>
                        <button onClick={() => updateBookingStatus(b._id, 'cancelled')} className="bg-red-500/10 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 px-3 py-1.5 text-xs transition-all">
                          <FaTimes /> Reject
                        </button>
                      </div>
                    )}
                    {b.status === 'approved' && (
                      <button onClick={() => updateBookingStatus(b._id, 'completed')} className="bg-blue-500/10 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 px-3 py-1.5 text-xs transition-all">
                        Mark Complete
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Services Tab ── */}
        {activeTab === 'services' && (
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form */}
            <div>
              <h3 className="font-serif text-xl text-white mb-5">
                {editingService ? 'Edit Service' : 'Add New Service'}
              </h3>
              <form onSubmit={handleServiceSubmit} className="bg-dark-200 border border-dark-400 p-5 space-y-4">
                <div>
                  <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Title *</label>
                  <input type="text" value={serviceForm.title} onChange={(e) => setServiceForm({ ...serviceForm, title: e.target.value })} className="input-field" required placeholder="Service name" />
                </div>
                <div>
                  <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Category *</label>
                  <select value={serviceForm.category} onChange={(e) => setServiceForm({ ...serviceForm, category: e.target.value })} className="input-field">
                    {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Description *</label>
                  <textarea value={serviceForm.description} onChange={(e) => setServiceForm({ ...serviceForm, description: e.target.value })} className="input-field resize-none" rows={3} required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Price (₹) *</label>
                    <input type="number" value={serviceForm.price} onChange={(e) => setServiceForm({ ...serviceForm, price: e.target.value })} className="input-field" required min={0} />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Duration (min) *</label>
                    <input type="number" value={serviceForm.duration} onChange={(e) => setServiceForm({ ...serviceForm, duration: e.target.value })} className="input-field" required min={5} />
                  </div>
                </div>
                <div>
                  <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Image URL</label>
                  <input type="url" value={serviceForm.image} onChange={(e) => setServiceForm({ ...serviceForm, image: e.target.value })} className="input-field" placeholder="https://..." />
                </div>
                <div className="flex gap-3">
                  <button type="submit" disabled={serviceLoading} className="gold-btn flex-1 flex items-center justify-center gap-2">
                    {serviceLoading ? <Spinner size="sm" /> : <FaPlus />}
                    {editingService ? 'Update' : 'Add Service'}
                  </button>
                  {editingService && <button type="button" onClick={cancelEdit} className="outline-btn px-3">Cancel</button>}
                </div>
              </form>
            </div>

            {/* Services List */}
            <div className="lg:col-span-2">
              <h3 className="font-serif text-xl text-white mb-5">All Services ({services.length})</h3>
              {loading ? (
                <div className="flex justify-center py-12"><Spinner gold /></div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto pr-1">
                  {services.map((svc) => (
                    <div key={svc._id} className="bg-dark-200 border border-dark-400 flex gap-3 p-3">
                      <img src={svc.image || 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=100'} alt="" className="w-16 h-16 object-cover flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <p className="text-white font-medium text-sm truncate">{svc.title}</p>
                            <p className="text-gray-500 text-xs">{svc.category}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-gold font-bold text-sm">₹{svc.price}</span>
                            <Badge color={svc.isActive ? 'green' : 'red'}>{svc.isActive ? 'Active' : 'Off'}</Badge>
                          </div>
                        </div>
                        <div className="flex gap-2 mt-2">
                          <button onClick={() => startEditService(svc)} className="text-xs border border-dark-400 hover:border-gold text-gray-400 hover:text-gold px-2 py-1 transition-colors">Edit</button>
                          <button onClick={() => deleteService(svc._id)} className="text-xs border border-red-500/30 hover:border-red-400 text-red-400 hover:text-red-300 px-2 py-1 transition-colors"><FaTrash /></button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── Users Tab ── */}
        {activeTab === 'users' && (
          <div>
            {loading ? (
              <div className="flex justify-center py-12"><Spinner gold /></div>
            ) : (
              <div className="space-y-3">
                {users.map((u) => (
                  <div key={u._id} className="bg-dark-200 border border-dark-400 px-5 py-4 flex items-center gap-4">
                    <div className="w-10 h-10 bg-gold/10 border border-gold/30 flex items-center justify-center text-gold font-bold flex-shrink-0">
                      {u.name?.[0]?.toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-medium">{u.name}</p>
                      <p className="text-gray-500 text-sm truncate">{u.email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600 text-xs">{u.phone || '-'}</span>
                      <Badge color={u.isActive ? 'green' : 'red'}>{u.isActive ? 'Active' : 'Inactive'}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
