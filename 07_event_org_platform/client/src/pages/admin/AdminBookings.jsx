import { useState, useEffect } from 'react'
import { bookingsAPI } from '../../services/api'
import AdminLayout from '../../components/admin/AdminLayout'
import { StatusBadge, PaymentBadge } from '../../components/common/StatusBadge'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

const STATUSES = ['All', 'pending', 'confirmed', 'in-progress', 'completed', 'cancelled']

export default function AdminBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('All')
  const [total, setTotal] = useState(0)
  const [selectedBooking, setSelectedBooking] = useState(null)
  const [updateForm, setUpdateForm] = useState({ status: '', adminNotes: '', paymentStatus: '' })
  const [updating, setUpdating] = useState(false)

  const fetchBookings = async (status) => {
    setLoading(true)
    try {
      const params = status !== 'All' ? { status } : {}
      const { data } = await bookingsAPI.getAllBookings({ ...params, limit: 50 })
      setBookings(data.bookings || [])
      setTotal(data.total || 0)
    } catch { toast.error('Failed to load bookings') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchBookings(statusFilter) }, [statusFilter])

  const openUpdate = (booking) => {
    setSelectedBooking(booking)
    setUpdateForm({ status: booking.status, adminNotes: booking.adminNotes || '', paymentStatus: booking.paymentStatus })
  }

  const handleUpdate = async () => {
    setUpdating(true)
    try {
      await bookingsAPI.updateStatus(selectedBooking._id, updateForm)
      toast.success('Booking updated!')
      setSelectedBooking(null)
      fetchBookings(statusFilter)
    } catch { toast.error('Update failed') }
    finally { setUpdating(false) }
  }

  return (
    <AdminLayout title="Bookings Management">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <p className="font-body text-white/50 text-sm">{total} total bookings</p>
        </div>

        {/* Status Filter */}
        <div className="flex flex-wrap gap-2">
          {STATUSES.map(s => (
            <button key={s} onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-full font-body text-xs capitalize transition-all ${
                statusFilter === s
                  ? 'bg-gold-gradient text-regal-950 shadow-gold'
                  : 'glass-card text-white/60 hover:text-white hover:border-gold-500/30'
              }`}>
              {s}
            </button>
          ))}
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {['Client', 'Service', 'Event Date', 'City', 'Amount', 'Status', 'Payment', 'Actions'].map(h => (
                    <th key={h} className="text-left py-4 px-4 font-body text-white/40 text-xs uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  [...Array(8)].map((_, i) => (
                    <tr key={i}><td colSpan={8} className="py-3 px-4"><div className="h-8 shimmer-bg rounded" /></td></tr>
                  ))
                ) : bookings.length === 0 ? (
                  <tr><td colSpan={8} className="py-12 text-center font-body text-white/30">No bookings found</td></tr>
                ) : (
                  bookings.map(b => (
                    <tr key={b._id} className="hover:bg-white/5 transition-colors group">
                      <td className="py-3 px-4">
                        <p className="font-body text-white text-sm font-medium">{b.user?.name || 'N/A'}</p>
                        <p className="font-body text-white/30 text-xs">{b.user?.email}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-body text-white/80 text-sm line-clamp-1 max-w-[150px]">{b.service?.title || 'N/A'}</p>
                        <span className="badge-gold text-xs">{b.service?.category}</span>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <p className="font-body text-white/70 text-sm">
                          {b.eventDate ? format(new Date(b.eventDate), 'dd MMM yyyy') : 'N/A'}
                        </p>
                        <p className="font-body text-white/30 text-xs">{b.eventTime}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-body text-white/60 text-sm">{b.location?.city}</p>
                      </td>
                      <td className="py-3 px-4 whitespace-nowrap">
                        <p className="font-body text-gold-400 text-sm font-semibold">₹{b.totalAmount?.toLocaleString('en-IN')}</p>
                        <p className="font-body text-white/30 text-xs">Adv: ₹{b.advanceAmount?.toLocaleString('en-IN')}</p>
                      </td>
                      <td className="py-3 px-4"><StatusBadge status={b.status} /></td>
                      <td className="py-3 px-4"><PaymentBadge status={b.paymentStatus} /></td>
                      <td className="py-3 px-4">
                        <button onClick={() => openUpdate(b)}
                          className="text-xs px-3 py-1.5 glass-card rounded-lg text-white/60 hover:text-gold-400 hover:border-gold-500/30 transition-all font-body whitespace-nowrap">
                          ✏️ Update
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Update Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-regal-950/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 w-full max-w-lg border-gold-500/20">
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-display text-xl font-semibold text-white">Update Booking</h2>
              <button onClick={() => setSelectedBooking(null)} className="text-white/40 hover:text-white text-xl">✕</button>
            </div>

            <div className="bg-white/5 rounded-xl p-4 mb-5 text-sm font-body">
              <p className="text-white font-medium">{selectedBooking.service?.title}</p>
              <p className="text-white/50">{selectedBooking.user?.name} • {selectedBooking.location?.city}</p>
              <p className="text-gold-400 font-semibold mt-1">₹{selectedBooking.totalAmount?.toLocaleString('en-IN')}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="label-luxury">Booking Status</label>
                <select value={updateForm.status} onChange={e => setUpdateForm(p => ({ ...p, status: e.target.value }))} className="input-luxury">
                  {['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'].map(s => (
                    <option key={s} value={s} className="capitalize">{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label-luxury">Payment Status</label>
                <select value={updateForm.paymentStatus} onChange={e => setUpdateForm(p => ({ ...p, paymentStatus: e.target.value }))} className="input-luxury">
                  {['unpaid', 'partial', 'paid'].map(s => (
                    <option key={s} value={s} className="capitalize">{s}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="label-luxury">Admin Notes (visible to client)</label>
                <textarea rows={3} placeholder="Add notes for the client..."
                  value={updateForm.adminNotes} onChange={e => setUpdateForm(p => ({ ...p, adminNotes: e.target.value }))}
                  className="input-luxury resize-none" />
              </div>
            </div>

            <div className="flex gap-3 mt-5">
              <button onClick={() => setSelectedBooking(null)} className="flex-1 btn-outline-gold text-sm py-2.5">Cancel</button>
              <button onClick={handleUpdate} disabled={updating}
                className="flex-1 btn-gold text-sm py-2.5 flex items-center justify-center gap-2 disabled:opacity-60">
                {updating ? <div className="w-4 h-4 border-2 border-regal-950 border-t-transparent rounded-full animate-spin" /> : null}
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
