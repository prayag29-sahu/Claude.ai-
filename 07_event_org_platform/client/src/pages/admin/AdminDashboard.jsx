import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { usersAPI } from '../../services/api'
import AdminLayout from '../../components/admin/AdminLayout'
import { StatusBadge } from '../../components/common/StatusBadge'
import { format } from 'date-fns'

export default function AdminDashboard() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    usersAPI.getStats()
      .then(({ data }) => setStats(data.stats))
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const statCards = stats ? [
    { label: 'Total Users', value: stats.totalUsers, icon: '👥', color: 'from-blue-600/20 to-blue-800/20', border: 'border-blue-500/20' },
    { label: 'Total Bookings', value: stats.totalBookings, icon: '📋', color: 'from-purple-600/20 to-purple-800/20', border: 'border-purple-500/20' },
    { label: 'Revenue Collected', value: `₹${(stats.totalRevenue || 0).toLocaleString('en-IN')}`, icon: '💰', color: 'from-gold-600/20 to-gold-800/20', border: 'border-gold-500/20' },
    { label: 'Confirmed Bookings', value: stats.bookingsByStatus?.find(b => b._id === 'confirmed')?.count || 0, icon: '✅', color: 'from-green-600/20 to-green-800/20', border: 'border-green-500/20' },
  ] : []

  return (
    <AdminLayout title="Dashboard Overview">
      <div className="space-y-6">
        {/* Stat Cards */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="glass-card p-6 h-28 shimmer-bg" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
            {statCards.map((card, i) => (
              <div key={i} className={`glass-card p-6 border ${card.border} bg-gradient-to-br ${card.color}`}>
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-body text-white/50 text-sm">{card.label}</p>
                    <p className="font-display text-3xl font-semibold text-white mt-1">{card.value}</p>
                  </div>
                  <span className="text-3xl">{card.icon}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Bookings by Status */}
        {stats?.bookingsByStatus?.length > 0 && (
          <div className="glass-card p-6">
            <h2 className="font-display text-lg font-semibold text-white mb-5">Bookings by Status</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
              {['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].map(status => {
                const found = stats.bookingsByStatus.find(b => b._id === status)
                return (
                  <div key={status} className="text-center p-4 bg-white/5 rounded-xl">
                    <p className="font-display text-2xl font-semibold text-white">{found?.count || 0}</p>
                    <StatusBadge status={status} />
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Recent Bookings */}
        {stats?.recentBookings?.length > 0 && (
          <div className="glass-card p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-lg font-semibold text-white">Recent Bookings</h2>
              <Link to="/admin/bookings" className="text-gold-400 hover:text-gold-300 font-body text-sm transition-colors">
                View All →
              </Link>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    {['Client', 'Service', 'Date', 'Status'].map(h => (
                      <th key={h} className="text-left pb-3 font-body text-white/40 text-xs uppercase tracking-wider px-2 first:pl-0">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {stats.recentBookings.map(booking => (
                    <tr key={booking._id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-2 first:pl-0">
                        <p className="font-body text-white text-sm">{booking.user?.name || 'N/A'}</p>
                      </td>
                      <td className="py-3 px-2">
                        <p className="font-body text-white/70 text-sm">{booking.service?.title || 'N/A'}</p>
                      </td>
                      <td className="py-3 px-2">
                        <p className="font-body text-white/50 text-sm">
                          {booking.eventDate ? format(new Date(booking.eventDate), 'dd MMM yyyy') : 'N/A'}
                        </p>
                      </td>
                      <td className="py-3 px-2">
                        <StatusBadge status={booking.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: 'Manage Bookings', desc: 'View & update all bookings', to: '/admin/bookings', icon: '📋' },
            { label: 'Add New Service', desc: 'Create a new service listing', to: '/admin/services', icon: '➕' },
            { label: 'Manage Users', desc: 'View & manage user accounts', to: '/admin/users', icon: '👥' },
          ].map(action => (
            <Link key={action.label} to={action.to}
              className="glass-card p-5 hover:border-gold-500/30 hover:shadow-gold transition-all duration-300 group">
              <span className="text-3xl block mb-3 group-hover:animate-float">{action.icon}</span>
              <h3 className="font-body text-white font-semibold text-sm">{action.label}</h3>
              <p className="font-body text-white/40 text-xs mt-1">{action.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </AdminLayout>
  )
}
