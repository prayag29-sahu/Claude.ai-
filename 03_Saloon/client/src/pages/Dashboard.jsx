// import React, { useState, useEffect } from 'react';
// import { Link } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { toast } from 'react-toastify';
// import { FaCalendarAlt, FaUser, FaHistory, FaTimes, FaCheckCircle, FaClock, FaScissors } from 'react-icons/fa';
// import API from '../utils/api';
// import { useAuth } from '../context/AuthContext';
// import { Badge, Spinner, EmptyState } from '../components/ui';

// const statusConfig = {
//   pending: { color: 'yellow', label: 'Pending' },
//   approved: { color: 'green', label: 'Approved' },
//   cancelled: { color: 'red', label: 'Cancelled' },
//   completed: { color: 'blue', label: 'Completed' },
// };

// const Dashboard = () => {
//   const { user, updateUser } = useAuth();
//   const [bookings, setBookings] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [activeTab, setActiveTab] = useState('bookings');
//   const [profile, setProfile] = useState({ name: user?.name || '', phone: user?.phone || '' });
//   const [profileLoading, setProfileLoading] = useState(false);

//   useEffect(() => {
//     fetchBookings();
//   }, []);

//   const fetchBookings = async () => {
//     try {
//       const { data } = await API.get('/bookings/user');
//       setBookings(data.bookings || []);
//     } catch (err) {
//       toast.error('Failed to load bookings');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const cancelBooking = async (id) => {
//     if (!window.confirm('Cancel this appointment?')) return;
//     try {
//       await API.put(`/bookings/${id}`, { status: 'cancelled' });
//       toast.success('Booking cancelled');
//       fetchBookings();
//     } catch (err) {
//       toast.error(err.response?.data?.message || 'Failed to cancel');
//     }
//   };

//   const updateProfile = async (e) => {
//     e.preventDefault();
//     setProfileLoading(true);
//     try {
//       const { data } = await API.put('/auth/profile', profile);
//       updateUser(data.user);
//       toast.success('Profile updated!');
//     } catch (err) {
//       toast.error('Failed to update profile');
//     } finally {
//       setProfileLoading(false);
//     }
//   };

//   const stats = {
//     total: bookings.length,
//     upcoming: bookings.filter((b) => b.status === 'approved' || b.status === 'pending').length,
//     completed: bookings.filter((b) => b.status === 'completed').length,
//     cancelled: bookings.filter((b) => b.status === 'cancelled').length,
//   };

//   return (
//     <div className="pt-20 min-h-screen bg-dark">
//       <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">
//         {/* Header */}
//         <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
//           <div>
//             <h1 className="font-serif text-3xl md:text-4xl text-white">
//               My <span className="gold-gradient">Dashboard</span>
//             </h1>
//             <p className="text-gray-500 mt-1">Welcome back, {user?.name}</p>
//           </div>
//           <Link to="/book" className="gold-btn">+ Book Appointment</Link>
//         </div>

//         {/* Stats Cards */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
//           {[
//             { label: 'Total Bookings', value: stats.total, icon: <FaCalendarAlt />, color: 'text-gold' },
//             { label: 'Upcoming', value: stats.upcoming, icon: <FaClock />, color: 'text-blue-400' },
//             { label: 'Completed', value: stats.completed, icon: <FaCheckCircle />, color: 'text-green-400' },
//             { label: 'Cancelled', value: stats.cancelled, icon: <FaTimes />, color: 'text-red-400' },
//           ].map(({ label, value, icon, color }) => (
//             <motion.div
//               key={label}
//               initial={{ opacity: 0, y: 20 }}
//               animate={{ opacity: 1, y: 0 }}
//               className="bg-dark-200 border border-dark-400 p-5"
//             >
//               <div className={`text-2xl ${color} mb-2`}>{icon}</div>
//               <div className="font-serif text-3xl font-bold text-white">{value}</div>
//               <div className="text-gray-500 text-xs mt-1">{label}</div>
//             </motion.div>
//           ))}
//         </div>

//         {/* Tabs */}
//         <div className="flex gap-1 mb-8 bg-dark-200 p-1 w-fit">
//           {[
//             { id: 'bookings', label: 'My Bookings', icon: <FaCalendarAlt /> },
//             { id: 'history', label: 'History', icon: <FaHistory /> },
//             { id: 'profile', label: 'Profile', icon: <FaUser /> },
//           ].map(({ id, label, icon }) => (
//             <button
//               key={id}
//               onClick={() => setActiveTab(id)}
//               className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest transition-all ${
//                 activeTab === id ? 'bg-gold text-black' : 'text-gray-400 hover:text-white'
//               }`}
//             >
//               {icon} {label}
//             </button>
//           ))}
//         </div>

//         {/* Content */}
//         {loading ? (
//           <div className="flex justify-center py-12"><Spinner gold size="lg" /></div>
//         ) : (
//           <>
//             {/* Bookings Tab */}
//             {(activeTab === 'bookings' || activeTab === 'history') && (
//               <div className="space-y-4">
//                 {bookings
//                   .filter((b) =>
//                     activeTab === 'bookings'
//                       ? ['pending', 'approved'].includes(b.status)
//                       : ['cancelled', 'completed'].includes(b.status)
//                   )
//                   .length === 0 ? (
//                   <EmptyState
//                     icon={<FaScissors />}
//                     title="No bookings found"
//                     subtitle={activeTab === 'bookings' ? 'You have no upcoming appointments.' : 'No past bookings.'}
//                     action={<Link to="/book" className="gold-btn">Book Now</Link>}
//                   />
//                 ) : (
//                   bookings
//                     .filter((b) =>
//                       activeTab === 'bookings'
//                         ? ['pending', 'approved'].includes(b.status)
//                         : ['cancelled', 'completed'].includes(b.status)
//                     )
//                     .map((booking) => {
//                       const cfg = statusConfig[booking.status];
//                       const svc = booking.serviceId;
//                       return (
//                         <motion.div
//                           key={booking._id}
//                           initial={{ opacity: 0, y: 10 }}
//                           animate={{ opacity: 1, y: 0 }}
//                           className="bg-dark-200 border border-dark-400 p-5 flex flex-col md:flex-row gap-4 md:items-center"
//                         >
//                           {svc?.image && (
//                             <img src={svc.image} alt="" className="w-16 h-16 object-cover flex-shrink-0" />
//                           )}
//                           <div className="flex-1">
//                             <div className="flex flex-wrap items-start justify-between gap-3">
//                               <div>
//                                 <h3 className="text-white font-semibold">{svc?.title || 'Service'}</h3>
//                                 <p className="text-gray-500 text-sm">{svc?.category}</p>
//                               </div>
//                               <Badge color={cfg.color}>{cfg.label}</Badge>
//                             </div>
//                             <div className="flex flex-wrap gap-4 mt-3 text-sm text-gray-400">
//                               <span>📅 {booking.date}</span>
//                               <span>🕐 {booking.timeSlot}</span>
//                               <span className="text-gold font-bold">₹{booking.totalAmount}</span>
//                             </div>
//                           </div>
//                           {booking.status === 'pending' && (
//                             <button
//                               onClick={() => cancelBooking(booking._id)}
//                               className="text-red-400 hover:text-red-300 text-xs uppercase tracking-wider border border-red-500/30 hover:border-red-400 px-3 py-2 transition-all"
//                             >
//                               Cancel
//                             </button>
//                           )}
//                         </motion.div>
//                       );
//                     })
//                 )}
//               </div>
//             )}

//             {/* Profile Tab */}
//             {activeTab === 'profile' && (
//               <div className="max-w-lg">
//                 <form onSubmit={updateProfile} className="bg-dark-200 border border-dark-400 p-6 space-y-5">
//                   <h3 className="font-serif text-xl text-white">Update Profile</h3>
//                   <div>
//                     <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Full Name</label>
//                     <input type="text" value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} className="input-field" required />
//                   </div>
//                   <div>
//                     <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Email (read-only)</label>
//                     <input type="email" value={user?.email} className="input-field opacity-50 cursor-not-allowed" disabled />
//                   </div>
//                   <div>
//                     <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Phone Number</label>
//                     <input type="tel" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} className="input-field" />
//                   </div>
//                   <button type="submit" disabled={profileLoading} className="gold-btn w-full flex items-center justify-center gap-2">
//                     {profileLoading ? <><Spinner size="sm" /> Updating...</> : 'Update Profile'}
//                   </button>
//                 </form>
//               </div>
//             )}
//           </>
//         )}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;






import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaUser, FaHistory, FaTimes, FaCheckCircle, FaClock, FaScissors } from 'react-icons/fa';
import { Badge, Spinner, EmptyState } from '../components/ui';

const statusConfig = {
  pending: { color: 'yellow', label: 'Pending' },
  approved: { color: 'green', label: 'Approved' },
  cancelled: { color: 'red', label: 'Cancelled' },
  completed: { color: 'blue', label: 'Completed' },
};

const Dashboard = () => {

  // ✅ Dummy User
  const dummyUser = {
    name: "Sachin Sharma",
    email: "sachin@gmail.com",
    phone: "9876543210"
  };

  // ✅ Dummy Bookings
  const [bookings, setBookings] = useState([
    {
      _id: "1",
      date: "2026-03-05",
      timeSlot: "10:00 AM",
      status: "pending",
      totalAmount: 399,
      serviceId: {
        title: "Premium Haircut",
        category: "Haircut",
        image: "https://images.unsplash.com/photo-1517832606299-7ae9b720a186"
      }
    },
    {
      _id: "2",
      date: "2026-02-20",
      timeSlot: "4:00 PM",
      status: "completed",
      totalAmount: 699,
      serviceId: {
        title: "Beard Styling + Facial",
        category: "Grooming",
        image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9"
      }
    },
    {
      _id: "3",
      date: "2026-02-15",
      timeSlot: "1:00 PM",
      status: "cancelled",
      totalAmount: 299,
      serviceId: {
        title: "Hair Spa",
        category: "Hair Care",
        image: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70"
      }
    }
  ]);

  const [loading] = useState(false);
  const [activeTab, setActiveTab] = useState('bookings');
  const [profile, setProfile] = useState({
    name: dummyUser.name,
    phone: dummyUser.phone
  });

  const cancelBooking = (id) => {
    if (!window.confirm('Cancel this appointment?')) return;

    const updated = bookings.map(b =>
      b._id === id ? { ...b, status: "cancelled" } : b
    );

    setBookings(updated);
  };

  const updateProfile = (e) => {
    e.preventDefault();
    alert("Profile updated successfully! (Dummy Mode)");
  };

  const stats = {
    total: bookings.length,
    upcoming: bookings.filter(b => b.status === 'approved' || b.status === 'pending').length,
    completed: bookings.filter(b => b.status === 'completed').length,
    cancelled: bookings.filter(b => b.status === 'cancelled').length,
  };

  return (
    <div className="pt-20 min-h-screen bg-dark">
      <div className="max-w-6xl mx-auto px-4 md:px-8 py-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="font-serif text-3xl md:text-4xl text-white">
              My <span className="gold-gradient">Dashboard</span>
            </h1>
            <p className="text-gray-500 mt-1">Welcome back, {dummyUser.name}</p>
          </div>
          <Link to="/book" className="gold-btn">+ Book Appointment</Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { label: 'Total Bookings', value: stats.total, icon: <FaCalendarAlt />, color: 'text-gold' },
            { label: 'Upcoming', value: stats.upcoming, icon: <FaClock />, color: 'text-blue-400' },
            { label: 'Completed', value: stats.completed, icon: <FaCheckCircle />, color: 'text-green-400' },
            { label: 'Cancelled', value: stats.cancelled, icon: <FaTimes />, color: 'text-red-400' },
          ].map(({ label, value, icon, color }) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-dark-200 border border-dark-400 p-5"
            >
              <div className={`text-2xl ${color} mb-2`}>{icon}</div>
              <div className="font-serif text-3xl font-bold text-white">{value}</div>
              <div className="text-gray-500 text-xs mt-1">{label}</div>
            </motion.div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-8 bg-dark-200 p-1 w-fit">
          {[
            { id: 'bookings', label: 'My Bookings', icon: <FaCalendarAlt /> },
            { id: 'history', label: 'History', icon: <FaHistory /> },
            { id: 'profile', label: 'Profile', icon: <FaUser /> },
          ].map(({ id, label, icon }) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex items-center gap-2 px-4 py-2 text-xs uppercase tracking-widest transition-all ${activeTab === id ? 'bg-gold text-black' : 'text-gray-400 hover:text-white'
                }`}
            >
              {icon} {label}
            </button>
          ))}
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center py-12"><Spinner gold size="lg" /></div>
        ) : (
          <>
            {(activeTab === 'bookings' || activeTab === 'history') && (
              <div className="space-y-4">
                {bookings
                  .filter(b =>
                    activeTab === 'bookings'
                      ? ['pending', 'approved'].includes(b.status)
                      : ['cancelled', 'completed'].includes(b.status)
                  )
                  .length === 0 ? (
                  <EmptyState
                    icon={<FaScissors />}
                    title="No bookings found"
                    subtitle="No data available."
                    action={<Link to="/book" className="gold-btn">Book Now</Link>}
                  />
                ) : (
                  bookings
                    .filter(b =>
                      activeTab === 'bookings'
                        ? ['pending', 'approved'].includes(b.status)
                        : ['cancelled', 'completed'].includes(b.status)
                    )
                    .map(booking => {
                      const cfg = statusConfig[booking.status];
                      const svc = booking.serviceId;
                      return (
                        <motion.div
                          key={booking._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="bg-dark-200 border border-dark-400 p-5 flex flex-col md:flex-row gap-4 md:items-center"
                        >
                          <img src={svc.image} alt="" className="w-16 h-16 object-cover flex-shrink-0" />
                          <div className="flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="text-white font-semibold">{svc.title}</h3>
                                <p className="text-gray-500 text-sm">{svc.category}</p>
                              </div>
                              <Badge color={cfg.color}>{cfg.label}</Badge>
                            </div>
                            <div className="flex gap-4 mt-3 text-sm text-gray-400">
                              <span>📅 {booking.date}</span>
                              <span>🕐 {booking.timeSlot}</span>
                              <span className="text-gold font-bold">₹{booking.totalAmount}</span>
                            </div>
                          </div>
                          {booking.status === 'pending' && (
                            <button
                              onClick={() => cancelBooking(booking._id)}
                              className="text-red-400 border border-red-500/30 px-3 py-2 text-xs"
                            >
                              Cancel
                            </button>
                          )}
                        </motion.div>
                      );
                    })
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="max-w-lg">
                <form onSubmit={updateProfile} className="bg-dark-200 border border-dark-400 p-6 space-y-5">
                  <h3 className="font-serif text-xl text-white">Update Profile</h3>
                  <input
                    type="text"
                    value={profile.name}
                    onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    className="input-field"
                  />
                  <input
                    type="email"
                    value={dummyUser.email}
                    disabled
                    className="input-field opacity-50"
                  />
                  <input
                    type="tel"
                    value={profile.phone}
                    onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                    className="input-field"
                  />
                  <button className="gold-btn w-full">Update Profile</button>
                </form>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Dashboard;