import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { bookingsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { StatusBadge, PaymentBadge } from '../components/common/StatusBadge'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const STATUS_FILTERS = ['All', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled']

export default function UserDashboard() {
  const { user } = useAuth()
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('All')
  const [total, setTotal] = useState(0)

  const fetchBookings = async (status) => {
    setLoading(true)
    try {
      const params = status !== 'All' ? { status } : {}
      const { data } = await bookingsAPI.getUserBookings(params)
      setBookings(data.bookings || [])
      setTotal(data.total || 0)
    } catch (err) {
      toast.error('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { fetchBookings(statusFilter) }, [statusFilter])

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return
    try {
      await bookingsAPI.cancel(bookingId)
      toast.success('Booking cancelled')
      fetchBookings(statusFilter)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to cancel')
    }
  }

  const stats = {
    total: bookings.length,
    confirmed: bookings.filter(b => b.status === 'confirmed').length,
    pending: bookings.filter(b => b.status === 'pending').length,
    completed: bookings.filter(b => b.status === 'completed').length,
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="page-container">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-10">
          <div>
            <h1 className="font-display text-3xl md:text-4xl font-semibold text-white">
              My Dashboard
            </h1>
            <p className="font-body text-white/50 mt-1">Welcome back, {user?.name?.split(' ')[0]} 👋</p>
          </div>
          <Link to="/services" className="btn-gold text-sm px-6 py-3 self-start sm:self-center">
            + Book New Service
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Bookings', value: total, icon: '📋', color: 'text-white' },
            { label: 'Confirmed', value: stats.confirmed, icon: '✅', color: 'text-green-400' },
            { label: 'Pending', value: stats.pending, icon: '⏳', color: 'text-yellow-400' },
            { label: 'Completed', value: stats.completed, icon: '🎉', color: 'text-gold-400' },
          ].map((s, i) => (
            <div key={i} className="glass-card p-5 text-center">
              <div className="text-3xl mb-2">{s.icon}</div>
              <div className={`font-display text-2xl font-semibold ${s.color}`}>{s.value}</div>
              <div className="font-body text-white/40 text-sm mt-1">{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 mb-6">
          {STATUS_FILTERS.map(f => (
            <button key={f} onClick={() => setStatusFilter(f)}
              className={`px-4 py-1.5 rounded-full font-body text-sm transition-all duration-200 capitalize ${
                statusFilter === f
                  ? 'bg-gold-gradient text-regal-950 shadow-gold'
                  : 'glass-card text-white/60 hover:text-white hover:border-gold-500/30'
              }`}>
              {f}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="glass-card p-6 flex gap-4">
                <div className="w-20 h-20 shimmer-bg rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 shimmer-bg rounded w-1/3" />
                  <div className="h-4 shimmer-bg rounded w-1/2" />
                  <div className="h-4 shimmer-bg rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-20 glass-card">
            <div className="text-6xl mb-4">📋</div>
            <h3 className="font-display text-2xl text-white mb-2">No bookings yet</h3>
            <p className="font-body text-white/40 mb-6">
              {statusFilter !== 'All' ? `No ${statusFilter} bookings found.` : 'Start exploring our services to book your first event!'}
            </p>
            <Link to="/services" className="btn-gold text-sm px-6 py-3">Browse Services</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map(booking => (
              <div key={booking._id} className="glass-card p-5 hover:border-gold-500/20 transition-all duration-300 group">
                <div className="flex flex-col sm:flex-row gap-4">
                  {/* Service Image */}
                  <div className="w-full sm:w-24 h-40 sm:h-24 flex-shrink-0 rounded-xl overflow-hidden">
                    <img
                      src={booking.service?.image}
                      alt={booking.service?.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={e => e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=200'}
                    />
                  </div>

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 mb-2">
                      <div>
                        <h3 className="font-display text-lg font-semibold text-white group-hover:text-gradient-gold transition-all duration-300 truncate">
                          {booking.service?.title}
                        </h3>
                        <p className="font-body text-white/40 text-sm">{booking.service?.category}</p>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <StatusBadge status={booking.status} />
                        <PaymentBadge status={booking.paymentStatus} />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-3">
                      {[
                        { icon: '📅', label: booking.eventDate ? format(new Date(booking.eventDate), 'dd MMM yyyy') : 'N/A' },
                        { icon: '📍', label: booking.location?.city || 'N/A' },
                        { icon: '👥', label: `${booking.guestCount} guests` },
                        { icon: '💰', label: `₹${booking.totalAmount?.toLocaleString('en-IN')}` },
                      ].map((item, i) => (
                        <div key={i} className="flex items-center gap-1.5">
                          <span className="text-sm">{item.icon}</span>
                          <span className="font-body text-white/60 text-xs truncate">{item.label}</span>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2">
                      <Link to={`/bookings/${booking._id}`}
                        className="btn-outline-gold text-xs px-4 py-1.5">
                        View Details
                      </Link>
                      {['pending', 'confirmed'].includes(booking.status) && (
                        <button onClick={() => handleCancel(booking._id)}
                          className="text-xs px-4 py-1.5 rounded-full border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all duration-200 font-body">
                          Cancel
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
