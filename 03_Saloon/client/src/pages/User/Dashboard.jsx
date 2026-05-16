// import React, { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
// import { toast } from 'react-toastify';
// import { FiCalendar, FiUser, FiClock, FiX, FiEdit2, FiCheck } from 'react-icons/fi';
// import { api, useAuth } from '../context/AuthContext';
// import Spinner from '../components/common/Spinner';

// const STATUS_COLORS = {
//   pending: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
//   approved: 'text-green-400 border-green-400/30 bg-green-400/10',
//   cancelled: 'text-red-400 border-red-400/30 bg-red-400/10',
//   completed: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
// };

// export default function Dashboard() {
//   const { user, updateProfile } = useAuth();
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('bookings');
//   const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '' });
//   const [editLoading, setEditLoading] = useState(false);

//   useEffect(() => {
//     api.get('/bookings/user').then(r => setBookings(r.data.bookings)).catch(() => {}).finally(() => setLoading(false));
//   }, []);

//   const cancelBooking = async id => {
//     if (!window.confirm('Cancel this appointment?')) return;
//     try {
//       await api.put(`/bookings/${id}/cancel`);
//       setBookings(prev => prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b));
//       toast.success('Booking cancelled');
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to cancel');
//     }
//   };

//   const handleProfileUpdate = async e => {
//     e.preventDefault();
//     setEditLoading(true);
//     try {
//       await updateProfile(profile);
//       toast.success('Profile updated!');
//     } catch {
//       toast.error('Update failed');
//     } finally {
//       setEditLoading(false);
//     }
//   };

//   const stats = {
//     total: bookings.length,
//     upcoming: bookings.filter(b => b.status === 'approved').length,
//     completed: bookings.filter(b => b.status === 'completed').length,
//   };

//   return (
//     <div className="min-h-screen bg-dark-900 pt-24 pb-16">
//       <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
//         <div className="mb-10">
//           <h1 className="font-serif text-4xl font-bold text-white mb-2">My Dashboard</h1>
//           <p className="text-gray-400">Welcome back, <span className="text-gold-500">{user?.name}</span></p>
//         </div>

//         {/* Stats */}
//         <div className="grid grid-cols-3 gap-4 mb-10">
//           {[
//             { label: 'Total Bookings', value: stats.total },
//             { label: 'Upcoming', value: stats.upcoming },
//             { label: 'Completed', value: stats.completed },
//           ].map(s => (
//             <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="card-dark p-6 text-center">
//               <div className="font-serif text-4xl font-bold gold-text mb-1">{s.value}</div>
//               <div className="text-gray-400 text-xs uppercase tracking-widest">{s.label}</div>
//             </motion.div>
//           ))}
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-4 mb-8 border-b border-dark-600">
//           {['bookings', 'profile'].map(tab => (
//             <button key={tab} onClick={() => setActiveTab(tab)}
//               className={`pb-3 px-1 text-sm uppercase tracking-widest capitalize border-b-2 transition-all ${
//                 activeTab === tab ? 'border-gold-500 text-gold-500' : 'border-transparent text-gray-400'
//               }`}>
//               {tab}
//             </button>
//           ))}
//         </div>

//         {activeTab === 'bookings' && (
//           loading ? <Spinner /> : (
//             bookings.length === 0 ? (
//               <div className="text-center py-20 text-gray-500">
//                 <FiCalendar size={48} className="mx-auto mb-4 opacity-30" />
//                 <p>No appointments yet.</p>
//               </div>
//             ) : (
//               <div className="space-y-4">
//                 {bookings.map(b => (
//                   <motion.div key={b._id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card-dark p-6 flex flex-col md:flex-row gap-4 md:items-center justify-between">
//                     <div className="flex-1">
//                       <div className="flex items-center gap-3 mb-2">
//                         <h3 className="text-white font-semibold">{b.serviceId?.title || 'Service'}</h3>
//                         <span className={`text-xs px-2 py-0.5 border rounded-sm capitalize ${STATUS_COLORS[b.status]}`}>{b.status}</span>
//                       </div>
//                       <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
//                         <span className="flex items-center gap-1"><FiCalendar size={13} />{new Date(b.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
//                         <span className="flex items-center gap-1"><FiClock size={13} />{b.timeSlot}</span>
//                         <span className="text-gold-500 font-semibold">₹{b.serviceId?.price}</span>
//                       </div>
//                     </div>
//                     {(b.status === 'pending' || b.status === 'approved') && (
//                       <button onClick={() => cancelBooking(b._id)} className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm border border-red-400/30 px-4 py-2 transition-colors hover:bg-red-400/10">
//                         <FiX size={14} /> Cancel
//                       </button>
//                     )}
//                   </motion.div>
//                 ))}
//               </div>
//             )
//           )
//         )}

//         {activeTab === 'profile' && (
//           <div className="max-w-md">
//             <form onSubmit={handleProfileUpdate} className="space-y-5 card-dark p-8">
//               <h2 className="font-serif text-2xl font-bold text-white mb-2">Update Profile</h2>
//               <div>
//                 <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Full Name</label>
//                 <input type="text" value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} className="input-dark" />
//               </div>
//               <div>
//                 <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Phone</label>
//                 <input type="tel" value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} className="input-dark" />
//               </div>
//               <div>
//                 <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">Email</label>
//                 <input type="email" value={user?.email} disabled className="input-dark opacity-50 cursor-not-allowed" />
//               </div>
//               <button type="submit" disabled={editLoading} className="btn-gold">
//                 <FiCheck /> {editLoading ? 'Saving...' : 'Save Changes'}
//               </button>
//             </form>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }




import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import { FiCalendar, FiClock, FiX, FiCheck } from 'react-icons/fi';
import Spinner from '../../components/common/Spinner';

const STATUS_COLORS = {
  pending: 'text-yellow-400 border-yellow-400/30 bg-yellow-400/10',
  approved: 'text-green-400 border-green-400/30 bg-green-400/10',
  cancelled: 'text-red-400 border-red-400/30 bg-red-400/10',
  completed: 'text-blue-400 border-blue-400/30 bg-blue-400/10',
};

export default function Dashboard() {

  // ✅ Dummy User
  const user = {
    name: "Prayag Sahu",
    email: "sahuprayag145@gmail.com",
    phone: "7999926855"
  };

  // ✅ Dummy Bookings
  const [bookings, setBookings] = useState([
    {
      _id: "1",
      status: "pending",
      date: "2026-03-10",
      timeSlot: "10:00 AM",
      serviceId: {
        title: "Premium Haircut",
        price: 399
      }
    },
    {
      _id: "2",
      status: "approved",
      date: "2026-03-15",
      timeSlot: "2:00 PM",
      serviceId: {
        title: "Beard Styling",
        price: 299
      }
    },
    {
      _id: "3",
      status: "completed",
      date: "2026-02-20",
      timeSlot: "4:00 PM",
      serviceId: {
        title: "Hair Spa",
        price: 699
      }
    }
  ]);

  const [loading] = useState(false);
  const [activeTab, setActiveTab] = useState('bookings');
  const [profile, setProfile] = useState({
    name: user.name,
    phone: user.phone
  });
  const [editLoading, setEditLoading] = useState(false);

  // ✅ Cancel Booking (Local State Update)
  const cancelBooking = (id) => {
    if (!window.confirm('Cancel this appointment?')) return;

    setBookings(prev =>
      prev.map(b => b._id === id ? { ...b, status: 'cancelled' } : b)
    );

    toast.success('Booking cancelled (Demo Mode)');
  };

  // ✅ Profile Update (Dummy)
  const handleProfileUpdate = (e) => {
    e.preventDefault();
    setEditLoading(true);

    setTimeout(() => {
      toast.success('Profile updated successfully!');
      setEditLoading(false);
    }, 800);
  };

  const stats = {
    total: bookings.length,
    upcoming: bookings.filter(b => b.status === 'approved' || b.status === 'pending').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  };

  return (
    <div className="min-h-screen bg-dark-900 pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="mb-10">
          <h1 className="font-serif text-4xl font-bold text-white mb-2">
            My Dashboard
          </h1>
          <p className="text-gray-400">
            Welcome back, <span className="text-gold-500">{user.name}</span>
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-10">
          {[
            { label: 'Total Bookings', value: stats.total },
            { label: 'Upcoming', value: stats.upcoming },
            { label: 'Completed', value: stats.completed },
          ].map(s => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-dark p-6 text-center"
            >
              <div className="font-serif text-4xl font-bold gold-text mb-1">
                {s.value}
              </div>
              <div className="text-gray-400 text-xs uppercase tracking-widest">
                {s.label}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-dark-600">
          {['bookings', 'profile'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-3 px-1 text-sm uppercase tracking-widest capitalize border-b-2 transition-all ${activeTab === tab
                  ? 'border-gold-500 text-gold-500'
                  : 'border-transparent text-gray-400'
                }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* BOOKINGS TAB */}
        {activeTab === 'bookings' && (
          loading ? (
            <Spinner />
          ) : bookings.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <FiCalendar size={48} className="mx-auto mb-4 opacity-30" />
              <p>No appointments yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {bookings.map(b => (
                <motion.div
                  key={b._id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="card-dark p-6 flex flex-col md:flex-row gap-4 md:items-center justify-between"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-white font-semibold">
                        {b.serviceId?.title}
                      </h3>
                      <span className={`text-xs px-2 py-0.5 border rounded-sm capitalize ${STATUS_COLORS[b.status]}`}>
                        {b.status}
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-4 text-gray-400 text-sm">
                      <span className="flex items-center gap-1">
                        <FiCalendar size={13} />
                        {new Date(b.date).toLocaleDateString('en-IN')}
                      </span>

                      <span className="flex items-center gap-1">
                        <FiClock size={13} />
                        {b.timeSlot}
                      </span>

                      <span className="text-gold-500 font-semibold">
                        ₹{b.serviceId?.price}
                      </span>
                    </div>
                  </div>

                  {(b.status === 'pending' || b.status === 'approved') && (
                    <button
                      onClick={() => cancelBooking(b._id)}
                      className="flex items-center gap-2 text-red-400 hover:text-red-300 text-sm border border-red-400/30 px-4 py-2 transition-colors hover:bg-red-400/10"
                    >
                      <FiX size={14} /> Cancel
                    </button>
                  )}
                </motion.div>
              ))}
            </div>
          )
        )}

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="max-w-md">
            <form onSubmit={handleProfileUpdate} className="space-y-5 card-dark p-8">
              <h2 className="font-serif text-2xl font-bold text-white mb-2">
                Update Profile
              </h2>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={e => setProfile({ ...profile, name: e.target.value })}
                  className="input-dark"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">
                  Phone
                </label>
                <input
                  type="tel"
                  value={profile.phone}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  className="input-dark"
                />
              </div>

              <div>
                <label className="block text-xs uppercase tracking-widest text-gray-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={user.email}
                  disabled
                  className="input-dark opacity-50 cursor-not-allowed"
                />
              </div>

              <button type="submit" disabled={editLoading} className="btn-gold flex items-center gap-2">
                <FiCheck />
                {editLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}