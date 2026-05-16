// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { toast } from 'react-toastify';
// import {
//   BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
// } from 'recharts';
// import { FiUsers, FiCalendar, FiDollarSign, FiScissors, FiPlus, FiEdit2, FiTrash2, FiCheck, FiX } from 'react-icons/fi';
// import { api } from '../../context/AuthContext';
// import Spinner from '../../components/common/Spinner';

// const TABS = ['Overview', 'Bookings', 'Services', 'Gallery'];

// const STATUS_COLORS = {
//   pending: 'text-yellow-400',
//   approved: 'text-green-400',
//   cancelled: 'text-red-400',
//   completed: 'text-blue-400',
// };

// export default function AdminDashboard() {
//   const [activeTab, setActiveTab] = useState('Overview');
//   const [analytics, setAnalytics] = useState(null);
//   const [bookings, setBookings] = useState([]);
//   const [services, setServices] = useState([]);
//   const [loading, setLoading] = useState(true);

//   // Service form
//   const [showServiceForm, setShowServiceForm] = useState(false);
//   const [editingService, setEditingService] = useState(null);
//   const [serviceForm, setServiceForm] = useState({ title: '', category: 'Haircut', description: '', price: '', duration: '', image: '' });

//   // Gallery form
//   const [galleryImages, setGalleryImages] = useState([]);
//   const [galleryForm, setGalleryForm] = useState({ image: '', category: 'General', caption: '' });

//   useEffect(() => {
//     const load = async () => {
//       try {
//         const [analyticsRes, bookingsRes, servicesRes, galleryRes] = await Promise.all([
//           api.get('/bookings/analytics'),
//           api.get('/bookings/admin'),
//           api.get('/services'),
//           api.get('/gallery'),
//         ]);
//         setAnalytics(analyticsRes.data.analytics);
//         setBookings(bookingsRes.data.bookings);
//         setServices(servicesRes.data.services);
//         setGalleryImages(galleryRes.data.images);
//       } catch (err) {
//         toast.error('Failed to load data');
//       } finally {
//         setLoading(false);
//       }
//     };
//     load();
//   }, []);

//   const updateBookingStatus = async (id, status) => {
//     try {
//       await api.put(`/bookings/${id}/status`, { status });
//       setBookings(prev => prev.map(b => b._id === id ? { ...b, status } : b));
//       toast.success(`Booking ${status}`);
//     } catch { toast.error('Failed'); }
//   };

//   const handleServiceSubmit = async e => {
//     e.preventDefault();
//     try {
//       if (editingService) {
//         const res = await api.put(`/services/${editingService._id}`, serviceForm);
//         setServices(prev => prev.map(s => s._id === editingService._id ? res.data.service : s));
//         toast.success('Service updated!');
//       } else {
//         const res = await api.post('/services', serviceForm);
//         setServices(prev => [...prev, res.data.service]);
//         toast.success('Service added!');
//       }
//       setShowServiceForm(false);
//       setEditingService(null);
//       setServiceForm({ title: '', category: 'Haircut', description: '', price: '', duration: '', image: '' });
//     } catch { toast.error('Failed'); }
//   };

//   const deleteService = async id => {
//     if (!window.confirm('Delete this service?')) return;
//     try {
//       await api.delete(`/services/${id}`);
//       setServices(prev => prev.filter(s => s._id !== id));
//       toast.success('Service deleted');
//     } catch { toast.error('Failed'); }
//   };

//   const addGalleryImage = async e => {
//     e.preventDefault();
//     try {
//       const res = await api.post('/gallery', galleryForm);
//       setGalleryImages(prev => [res.data.image, ...prev]);
//       setGalleryForm({ image: '', category: 'General', caption: '' });
//       toast.success('Image added!');
//     } catch { toast.error('Failed'); }
//   };

//   const deleteGalleryImage = async id => {
//     if (!window.confirm('Remove image?')) return;
//     try {
//       await api.delete(`/gallery/${id}`);
//       setGalleryImages(prev => prev.filter(i => i._id !== id));
//       toast.success('Image removed');
//     } catch { toast.error('Failed'); }
//   };

//   if (loading) return <div className="min-h-screen bg-dark-900 pt-24 flex items-center justify-center"><Spinner size="lg" /></div>;

//   const STAT_CARDS = [
//     { icon: <FiCalendar />, label: 'Total Bookings', value: analytics?.totalBookings || 0 },
//     { icon: <FiUsers />, label: 'Pending', value: analytics?.pending || 0, color: 'text-yellow-400' },
//     { icon: <FiCheck />, label: 'Approved', value: analytics?.approved || 0, color: 'text-green-400' },
//     { icon: <FiScissors />, label: 'Services', value: services.length },
//   ];

//   return (
//     <div className="min-h-screen bg-dark-900 pt-24 pb-16">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="mb-10">
//           <h1 className="font-serif text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
//           <p className="text-gray-400">Manage your saloon operations</p>
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-4 mb-10 border-b border-dark-600 overflow-x-auto">
//           {TABS.map(tab => (
//             <button key={tab} onClick={() => setActiveTab(tab)}
//               className={`pb-3 px-1 text-sm uppercase tracking-widest whitespace-nowrap border-b-2 transition-all ${
//                 activeTab === tab ? 'border-gold-500 text-gold-500' : 'border-transparent text-gray-400'
//               }`}>
//               {tab}
//             </button>
//           ))}
//         </div>

//         {/* OVERVIEW */}
//         {activeTab === 'Overview' && (
//           <div className="space-y-8">
//             <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
//               {STAT_CARDS.map((s, i) => (
//                 <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="card-dark p-6">
//                   <div className={`${s.color || 'text-gold-500'} mb-3`}>{s.icon}</div>
//                   <div className="font-serif text-4xl font-bold gold-text mb-1">{s.value}</div>
//                   <div className="text-gray-400 text-xs uppercase tracking-widest">{s.label}</div>
//                 </motion.div>
//               ))}
//             </div>

//             {analytics?.revenueData?.length > 0 && (
//               <div className="card-dark p-6">
//                 <h3 className="font-serif text-xl font-bold text-white mb-6">Revenue Overview</h3>
//                 <ResponsiveContainer width="100%" height={300}>
//                   <BarChart data={analytics.revenueData}>
//                     <CartesianGrid strokeDasharray="3 3" stroke="#222" />
//                     <XAxis dataKey="_id" stroke="#666" tick={{ fill: '#666', fontSize: 12 }} />
//                     <YAxis stroke="#666" tick={{ fill: '#666', fontSize: 12 }} />
//                     <Tooltip contentStyle={{ background: '#1a1a1a', border: '1px solid #d4af37', color: '#fff' }} />
//                     <Bar dataKey="revenue" fill="#d4af37" radius={[4, 4, 0, 0]} />
//                   </BarChart>
//                 </ResponsiveContainer>
//               </div>
//             )}
//           </div>
//         )}

//         {/* BOOKINGS */}
//         {activeTab === 'Bookings' && (
//           <div className="space-y-3">
//             {bookings.map(b => (
//               <div key={b._id} className="card-dark p-5 flex flex-col md:flex-row gap-4 md:items-center justify-between">
//                 <div className="flex-1">
//                   <div className="flex items-center gap-2 mb-1 flex-wrap">
//                     <span className="text-white font-semibold">{b.userId?.name}</span>
//                     <span className="text-gray-500 text-xs">→</span>
//                     <span className="text-gold-500 text-sm">{b.serviceId?.title}</span>
//                     <span className={`text-xs px-2 py-0.5 border border-current/30 bg-current/10 capitalize rounded-sm ${STATUS_COLORS[b.status]}`}>{b.status}</span>
//                   </div>
//                   <div className="text-gray-400 text-sm flex flex-wrap gap-3">
//                     <span>{new Date(b.date).toLocaleDateString('en-IN')}</span>
//                     <span>{b.timeSlot}</span>
//                     <span>{b.userId?.phone}</span>
//                     <span className="text-gold-500">₹{b.serviceId?.price}</span>
//                   </div>
//                 </div>
//                 <div className="flex gap-2 flex-shrink-0">
//                   {b.status === 'pending' && (
//                     <>
//                       <button onClick={() => updateBookingStatus(b._id, 'approved')} className="flex items-center gap-1 text-xs border border-green-400/40 text-green-400 px-3 py-1.5 hover:bg-green-400/10">
//                         <FiCheck size={12} /> Approve
//                       </button>
//                       <button onClick={() => updateBookingStatus(b._id, 'cancelled')} className="flex items-center gap-1 text-xs border border-red-400/40 text-red-400 px-3 py-1.5 hover:bg-red-400/10">
//                         <FiX size={12} /> Reject
//                       </button>
//                     </>
//                   )}
//                   {b.status === 'approved' && (
//                     <button onClick={() => updateBookingStatus(b._id, 'completed')} className="flex items-center gap-1 text-xs border border-blue-400/40 text-blue-400 px-3 py-1.5 hover:bg-blue-400/10">
//                       <FiCheck size={12} /> Mark Done
//                     </button>
//                   )}
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}

//         {/* SERVICES */}
//         {activeTab === 'Services' && (
//           <div>
//             <div className="flex justify-between items-center mb-6">
//               <h2 className="font-serif text-2xl font-bold text-white">Services ({services.length})</h2>
//               <button onClick={() => { setShowServiceForm(true); setEditingService(null); setServiceForm({ title: '', category: 'Haircut', description: '', price: '', duration: '', image: '' }); }} className="btn-gold text-sm py-2">
//                 <FiPlus /> Add Service
//               </button>
//             </div>

//             {showServiceForm && (
//               <div className="card-dark p-6 mb-6">
//                 <h3 className="font-serif text-xl font-bold text-white mb-5">{editingService ? 'Edit' : 'Add'} Service</h3>
//                 <form onSubmit={handleServiceSubmit} className="grid md:grid-cols-2 gap-4">
//                   <input value={serviceForm.title} onChange={e => setServiceForm({ ...serviceForm, title: e.target.value })} placeholder="Title" className="input-dark" required />
//                   <select value={serviceForm.category} onChange={e => setServiceForm({ ...serviceForm, category: e.target.value })} className="input-dark">
//                     {['Haircut', 'Beard Styling', 'Hair Coloring', 'Facial & Skin Care', 'Hair Spa', 'Groom Package'].map(c => <option key={c} value={c}>{c}</option>)}
//                   </select>
//                   <input value={serviceForm.price} onChange={e => setServiceForm({ ...serviceForm, price: e.target.value })} placeholder="Price (₹)" type="number" className="input-dark" required />
//                   <input value={serviceForm.duration} onChange={e => setServiceForm({ ...serviceForm, duration: e.target.value })} placeholder="Duration (minutes)" type="number" className="input-dark" required />
//                   <input value={serviceForm.image} onChange={e => setServiceForm({ ...serviceForm, image: e.target.value })} placeholder="Image URL" className="input-dark" />
//                   <textarea value={serviceForm.description} onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })} placeholder="Description" className="input-dark resize-none" rows={2} required />
//                   <div className="flex gap-3 md:col-span-2">
//                     <button type="submit" className="btn-gold">{editingService ? 'Update' : 'Add Service'}</button>
//                     <button type="button" onClick={() => setShowServiceForm(false)} className="btn-outline-gold">Cancel</button>
//                   </div>
//                 </form>
//               </div>
//             )}

//             <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
//               {services.map(s => (
//                 <div key={s._id} className="card-dark p-5">
//                   {s.image && <img src={s.image} alt={s.title} className="w-full h-40 object-cover mb-4 rounded-sm" />}
//                   <div className="flex justify-between items-start">
//                     <div>
//                       <h4 className="text-white font-semibold">{s.title}</h4>
//                       <p className="text-gold-500 text-xs mt-0.5">{s.category}</p>
//                       <p className="text-gray-400 text-sm mt-2">₹{s.price} · {s.duration} min</p>
//                     </div>
//                     <div className="flex gap-2">
//                       <button onClick={() => { setEditingService(s); setServiceForm({ title: s.title, category: s.category, description: s.description, price: s.price, duration: s.duration, image: s.image || '' }); setShowServiceForm(true); }} className="text-gold-500 hover:text-gold-400">
//                         <FiEdit2 size={16} />
//                       </button>
//                       <button onClick={() => deleteService(s._id)} className="text-red-400 hover:text-red-300">
//                         <FiTrash2 size={16} />
//                       </button>
//                     </div>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}

//         {/* GALLERY */}
//         {activeTab === 'Gallery' && (
//           <div>
//             <h2 className="font-serif text-2xl font-bold text-white mb-6">Gallery Management</h2>
//             <div className="card-dark p-6 mb-8">
//               <h3 className="text-white font-semibold mb-4">Add Image</h3>
//               <form onSubmit={addGalleryImage} className="flex flex-wrap gap-3">
//                 <input value={galleryForm.image} onChange={e => setGalleryForm({ ...galleryForm, image: e.target.value })} placeholder="Image URL" className="input-dark flex-1 min-w-48" required />
//                 <select value={galleryForm.category} onChange={e => setGalleryForm({ ...galleryForm, category: e.target.value })} className="input-dark w-40">
//                   {['Haircut', 'Beard', 'Color', 'Facial', 'General'].map(c => <option key={c} value={c}>{c}</option>)}
//                 </select>
//                 <input value={galleryForm.caption} onChange={e => setGalleryForm({ ...galleryForm, caption: e.target.value })} placeholder="Caption" className="input-dark flex-1 min-w-32" />
//                 <button type="submit" className="btn-gold"><FiPlus /> Add</button>
//               </form>
//             </div>

//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//               {galleryImages.map(img => (
//                 <div key={img._id} className="relative group overflow-hidden rounded-sm">
//                   <img src={img.image} alt={img.caption} className="w-full h-40 object-cover" onError={e => e.target.src = 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=300'} />
//                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
//                     <button onClick={() => deleteGalleryImage(img._id)} className="text-red-400 hover:text-red-300 p-2">
//                       <FiTrash2 size={20} />
//                     </button>
//                   </div>
//                   {img.caption && <p className="absolute bottom-0 left-0 right-0 bg-black/70 text-white text-xs p-2">{img.caption}</p>}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }



import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import {
  FiUsers, FiCalendar, FiScissors, FiPlus,
  FiEdit2, FiTrash2, FiCheck, FiX
} from 'react-icons/fi';
import Spinner from '../../components/common/Spinner';

const TABS = ['Overview', 'Bookings', 'Services', 'Gallery'];

const STATUS_COLORS = {
  pending: 'text-yellow-400',
  approved: 'text-green-400',
  cancelled: 'text-red-400',
  completed: 'text-blue-400',
};

export default function AdminDashboard() {

  const [activeTab, setActiveTab] = useState('Overview');
  const [loading] = useState(false);

  // ✅ Dummy Analytics
  const [analytics, setAnalytics] = useState({
    totalBookings: 12,
    pending: 3,
    approved: 5,
    revenueData: [
      { _id: 'Jan', revenue: 12000 },
      { _id: 'Feb', revenue: 18000 },
      { _id: 'Mar', revenue: 15000 },
      { _id: 'Apr', revenue: 22000 },
    ]
  });

  // ✅ Dummy Bookings
  const [bookings, setBookings] = useState([
    {
      _id: '1',
      status: 'pending',
      date: '2026-03-10',
      timeSlot: '10:00 AM',
      userId: { name: 'Rahul', phone: '9876543210' },
      serviceId: { title: 'Haircut', price: 399 }
    },
    {
      _id: '2',
      status: 'approved',
      date: '2026-03-12',
      timeSlot: '2:00 PM',
      userId: { name: 'Aman', phone: '9123456780' },
      serviceId: { title: 'Beard Styling', price: 299 }
    }
  ]);

  // ✅ Dummy Services
  const [services, setServices] = useState([
    {
      _id: 's1',
      title: 'Premium Haircut',
      category: 'Haircut',
      description: 'Stylish modern haircut',
      price: 399,
      duration: 45,
      image: 'https://images.unsplash.com/photo-1517832606299-7ae9b720a186'
    }
  ]);

  // ✅ Dummy Gallery
  const [galleryImages, setGalleryImages] = useState([
    {
      _id: 'g1',
      image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1',
      caption: 'Premium Look'
    }
  ]);

  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [serviceForm, setServiceForm] = useState({
    title: '',
    category: 'Haircut',
    description: '',
    price: '',
    duration: '',
    image: ''
  });

  const [galleryForm, setGalleryForm] = useState({
    image: '',
    category: 'General',
    caption: ''
  });

  // ✅ Booking Status Update (Local)
  const updateBookingStatus = (id, status) => {
    setBookings(prev =>
      prev.map(b => b._id === id ? { ...b, status } : b)
    );
    toast.success(`Booking ${status}`);
  };

  // ✅ Service Add/Edit
  const handleServiceSubmit = (e) => {
    e.preventDefault();

    if (editingService) {
      setServices(prev =>
        prev.map(s => s._id === editingService._id
          ? { ...s, ...serviceForm }
          : s)
      );
      toast.success('Service updated!');
    } else {
      const newService = {
        _id: Date.now().toString(),
        ...serviceForm
      };
      setServices(prev => [...prev, newService]);
      toast.success('Service added!');
    }

    setShowServiceForm(false);
    setEditingService(null);
    setServiceForm({ title: '', category: 'Haircut', description: '', price: '', duration: '', image: '' });
  };

  const deleteService = (id) => {
    if (!window.confirm('Delete this service?')) return;
    setServices(prev => prev.filter(s => s._id !== id));
    toast.success('Service deleted');
  };

  // ✅ Gallery Add/Delete
  const addGalleryImage = (e) => {
    e.preventDefault();
    const newImage = {
      _id: Date.now().toString(),
      ...galleryForm
    };
    setGalleryImages(prev => [newImage, ...prev]);
    setGalleryForm({ image: '', category: 'General', caption: '' });
    toast.success('Image added!');
  };

  const deleteGalleryImage = (id) => {
    if (!window.confirm('Remove image?')) return;
    setGalleryImages(prev => prev.filter(i => i._id !== id));
    toast.success('Image removed');
  };

  if (loading)
    return <div className="min-h-screen bg-dark-900 pt-24 flex items-center justify-center"><Spinner size="lg" /></div>;

  const STAT_CARDS = [
    { icon: <FiCalendar />, label: 'Total Bookings', value: analytics.totalBookings },
    { icon: <FiUsers />, label: 'Pending', value: analytics.pending, color: 'text-yellow-400' },
    { icon: <FiCheck />, label: 'Approved', value: analytics.approved, color: 'text-green-400' },
    { icon: <FiScissors />, label: 'Services', value: services.length },
  ];

  return (
    <div className="min-h-screen bg-dark-900 pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <div className="mb-10">
          <h1 className="font-serif text-4xl font-bold text-white mb-2">Admin Dashboard</h1>
          <p className="text-gray-400">Manage your saloon operations</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-10 border-b border-dark-600 overflow-x-auto">
          {TABS.map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 text-sm uppercase tracking-widest whitespace-nowrap border-b-2 transition-all ${activeTab === tab
                  ? 'border-gold-500 text-gold-500'
                  : 'border-transparent text-gray-400'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* OVERVIEW */}
        {activeTab === 'Overview' && (
          <div className="space-y-8">

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {STAT_CARDS.map((s, i) => (
                <motion.div
                  key={s.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  className="card-dark p-6"
                >
                  <div className={`${s.color || 'text-gold-500'} mb-3`}>{s.icon}</div>
                  <div className="font-serif text-4xl font-bold gold-text mb-1">{s.value}</div>
                  <div className="text-gray-400 text-xs uppercase tracking-widest">{s.label}</div>
                </motion.div>
              ))}
            </div>

            <div className="card-dark p-6">
              <h3 className="font-serif text-xl font-bold text-white mb-6">Revenue Overview</h3>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={analytics.revenueData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#222" />
                  <XAxis dataKey="_id" stroke="#666" />
                  <YAxis stroke="#666" />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#d4af37" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        )}

        {/* BOOKINGS */}
        {activeTab === 'Bookings' && (
          <div className="space-y-3">
            {bookings.map(b => (
              <div key={b._id} className="card-dark p-5 flex flex-col md:flex-row gap-4 md:items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-white font-semibold">{b.userId.name}</span>
                    <span className="text-gray-500 text-xs">→</span>
                    <span className="text-gold-500 text-sm">{b.serviceId.title}</span>
                    <span className={`text-xs px-2 py-0.5 capitalize ${STATUS_COLORS[b.status]}`}>
                      {b.status}
                    </span>
                  </div>
                  <div className="text-gray-400 text-sm flex gap-3">
                    <span>{b.date}</span>
                    <span>{b.timeSlot}</span>
                    <span>{b.userId.phone}</span>
                    <span className="text-gold-500">₹{b.serviceId.price}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  {b.status === 'pending' && (
                    <>
                      <button onClick={() => updateBookingStatus(b._id, 'approved')}
                        className="text-green-400 text-xs border border-green-400/40 px-3 py-1.5">
                        Approve
                      </button>
                      <button onClick={() => updateBookingStatus(b._id, 'cancelled')}
                        className="text-red-400 text-xs border border-red-400/40 px-3 py-1.5">
                        Reject
                      </button>
                    </>
                  )}
                  {b.status === 'approved' && (
                    <button onClick={() => updateBookingStatus(b._id, 'completed')}
                      className="text-blue-400 text-xs border border-blue-400/40 px-3 py-1.5">
                      Mark Done
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SERVICES */}
        {activeTab === 'Services' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-serif text-2xl font-bold text-white">Services ({services.length})</h2>
              <button onClick={() => setShowServiceForm(true)} className="btn-gold text-sm py-2">
                <FiPlus /> Add Service
              </button>
            </div>

            {showServiceForm && (
              <div className="card-dark p-6 mb-6">
                <form onSubmit={handleServiceSubmit} className="grid md:grid-cols-2 gap-4">
                  <input placeholder="Title" className="input-dark"
                    value={serviceForm.title}
                    onChange={e => setServiceForm({ ...serviceForm, title: e.target.value })} required />
                  <input placeholder="Price" type="number" className="input-dark"
                    value={serviceForm.price}
                    onChange={e => setServiceForm({ ...serviceForm, price: e.target.value })} required />
                  <input placeholder="Duration" type="number" className="input-dark"
                    value={serviceForm.duration}
                    onChange={e => setServiceForm({ ...serviceForm, duration: e.target.value })} required />
                  <input placeholder="Image URL" className="input-dark"
                    value={serviceForm.image}
                    onChange={e => setServiceForm({ ...serviceForm, image: e.target.value })} />
                  <textarea placeholder="Description" className="input-dark md:col-span-2"
                    value={serviceForm.description}
                    onChange={e => setServiceForm({ ...serviceForm, description: e.target.value })} />
                  <button type="submit" className="btn-gold md:col-span-2">
                    {editingService ? 'Update Service' : 'Add Service'}
                  </button>
                </form>
              </div>
            )}

            <div className="grid md:grid-cols-3 gap-4">
              {services.map(s => (
                <div key={s._id} className="card-dark p-5">
                  {s.image && <img src={s.image} alt="" className="w-full h-40 object-cover mb-4" />}
                  <h4 className="text-white font-semibold">{s.title}</h4>
                  <p className="text-gold-500 text-xs">{s.category}</p>
                  <p className="text-gray-400 text-sm mt-2">₹{s.price} · {s.duration} min</p>
                  <button onClick={() => deleteService(s._id)}
                    className="text-red-400 text-xs mt-3">
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* GALLERY */}
        {activeTab === 'Gallery' && (
          <div>
            <h2 className="font-serif text-2xl font-bold text-white mb-6">Gallery</h2>

            <form onSubmit={addGalleryImage} className="flex gap-3 mb-6">
              <input placeholder="Image URL" className="input-dark flex-1"
                value={galleryForm.image}
                onChange={e => setGalleryForm({ ...galleryForm, image: e.target.value })} required />
              <input placeholder="Caption" className="input-dark"
                value={galleryForm.caption}
                onChange={e => setGalleryForm({ ...galleryForm, caption: e.target.value })} />
              <button type="submit" className="btn-gold">Add</button>
            </form>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {galleryImages.map(img => (
                <div key={img._id} className="relative group">
                  <img src={img.image} alt="" className="w-full h-40 object-cover" />
                  <button
                    onClick={() => deleteGalleryImage(img._id)}
                    className="absolute top-2 right-2 bg-black/70 text-red-400 px-2 py-1 text-xs opacity-0 group-hover:opacity-100"
                  >
                    Delete
                  </button>
                  {img.caption &&
                    <p className="absolute bottom-0 bg-black/70 text-white text-xs w-full p-1">
                      {img.caption}
                    </p>}
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}