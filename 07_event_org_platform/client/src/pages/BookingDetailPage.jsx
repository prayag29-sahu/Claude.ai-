import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { bookingsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { StatusBadge, PaymentBadge, STATUS_CONFIG } from '../components/common/StatusBadge'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function BookingDetailPage() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [booking, setBooking] = useState(null)
  const [loading, setLoading] = useState(true)
  const [paying, setPaying] = useState(false)
  const [showPayModal, setShowPayModal] = useState(false)
  const [payMethod, setPayMethod] = useState('UPI')

  useEffect(() => {
    bookingsAPI.getOne(id)
      .then(({ data }) => setBooking(data.booking))
      .catch(() => navigate('/dashboard'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  const handlePay = async () => {
    setPaying(true)
    try {
      const { data } = await bookingsAPI.pay(id, {
        amount: booking.advanceAmount,
        paymentMethod: payMethod,
      })
      toast.success(`Payment successful! ID: ${data.paymentId}`)
      setBooking(data.booking)
      setShowPayModal(false)
    } catch (err) {
      toast.error('Payment failed. Please try again.')
    } finally {
      setPaying(false)
    }
  }

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-2 border-gold-500 border-t-transparent animate-spin" />
    </div>
  )

  if (!booking) return null

  const statusProgress = ['pending', 'confirmed', 'in-progress', 'completed']
  const currentStep = statusProgress.indexOf(booking.status)

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="page-container max-w-4xl">
        {/* Back */}
        <Link to="/dashboard" className="inline-flex items-center gap-2 text-white/50 hover:text-gold-400 font-body text-sm mb-6 transition-colors">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </Link>

        {/* Header */}
        <div className="glass-card p-6 mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div>
              <p className="font-body text-white/40 text-xs mb-1">Booking ID: <span className="text-white/60">{booking._id}</span></p>
              <h1 className="font-display text-2xl font-semibold text-white">{booking.service?.title}</h1>
            </div>
            <div className="flex gap-2">
              <StatusBadge status={booking.status} />
              <PaymentBadge status={booking.paymentStatus} />
            </div>
          </div>

          {/* Progress Tracker */}
          {booking.status !== 'cancelled' && (
            <div className="mt-6">
              <div className="flex items-center justify-between relative">
                <div className="absolute left-0 right-0 top-4 h-0.5 bg-white/10" />
                <div
                  className="absolute left-0 top-4 h-0.5 bg-gold-gradient transition-all duration-1000"
                  style={{ width: currentStep >= 0 ? `${(currentStep / (statusProgress.length - 1)) * 100}%` : '0%' }}
                />
                {statusProgress.map((step, i) => {
                  const config = STATUS_CONFIG[step]
                  const done = i <= currentStep
                  return (
                    <div key={step} className="relative flex flex-col items-center gap-2 z-10">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border-2 transition-all duration-500 ${
                        done ? 'bg-gold-gradient border-gold-500 shadow-gold' : 'bg-regal-900 border-white/20'
                      }`}>
                        {done ? '✓' : config.icon}
                      </div>
                      <span className={`font-body text-xs capitalize ${done ? 'text-gold-400' : 'text-white/30'}`}>
                        {config.label}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Event Info */}
          <div className="glass-card p-6">
            <h2 className="font-display text-lg font-semibold text-white mb-4">Event Details</h2>
            <div className="space-y-3">
              {[
                { icon: '📅', label: 'Date', value: format(new Date(booking.eventDate), 'EEEE, dd MMMM yyyy') },
                { icon: '🕐', label: 'Time', value: booking.eventTime || 'N/A' },
                { icon: '👥', label: 'Guests', value: `${booking.guestCount} people` },
                { icon: '📍', label: 'Address', value: booking.location?.address },
                { icon: '🌆', label: 'City', value: `${booking.location?.city}${booking.location?.state ? ', ' + booking.location.state : ''}` },
                { icon: '📮', label: 'Pincode', value: booking.location?.pincode || 'N/A' },
              ].map((item, i) => (
                <div key={i} className="flex gap-3">
                  <span className="text-lg flex-shrink-0 mt-0.5">{item.icon}</span>
                  <div>
                    <p className="font-body text-white/40 text-xs">{item.label}</p>
                    <p className="font-body text-white text-sm">{item.value}</p>
                  </div>
                </div>
              ))}
              {booking.requirements && (
                <div className="flex gap-3 pt-2 border-t border-white/10">
                  <span className="text-lg flex-shrink-0">📝</span>
                  <div>
                    <p className="font-body text-white/40 text-xs">Special Requirements</p>
                    <p className="font-body text-white text-sm">{booking.requirements}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Contact & Payment */}
          <div className="space-y-6">
            <div className="glass-card p-6">
              <h2 className="font-display text-lg font-semibold text-white mb-4">Contact Details</h2>
              <div className="space-y-3">
                {[
                  { icon: '👤', label: 'Name', value: booking.contactName },
                  { icon: '📞', label: 'Phone', value: booking.contactPhone },
                  { icon: '✉️', label: 'Email', value: booking.contactEmail },
                ].map((item, i) => (
                  <div key={i} className="flex gap-3">
                    <span className="text-lg">{item.icon}</span>
                    <div>
                      <p className="font-body text-white/40 text-xs">{item.label}</p>
                      <p className="font-body text-white text-sm">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card p-6">
              <h2 className="font-display text-lg font-semibold text-white mb-4">Payment Summary</h2>
              <div className="space-y-2 mb-4">
                {[
                  { label: 'Total Amount', value: `₹${booking.totalAmount?.toLocaleString('en-IN')}`, highlight: false },
                  { label: 'Advance (30%)', value: `₹${booking.advanceAmount?.toLocaleString('en-IN')}`, highlight: false },
                  { label: 'Remaining', value: `₹${(booking.totalAmount - booking.advanceAmount)?.toLocaleString('en-IN')}`, highlight: false },
                  { label: 'Payment Status', value: booking.paymentStatus?.toUpperCase(), highlight: true },
                ].map((row, i) => (
                  <div key={i} className={`flex justify-between font-body text-sm ${i === 3 ? 'pt-2 border-t border-white/10' : ''}`}>
                    <span className="text-white/50">{row.label}</span>
                    <span className={row.highlight ? 'text-gold-400 font-semibold' : 'text-white'}>{row.value}</span>
                  </div>
                ))}
              </div>

              {booking.paymentId && (
                <p className="font-body text-white/30 text-xs">Txn ID: {booking.paymentId}</p>
              )}

              {booking.paymentStatus === 'unpaid' && booking.status !== 'cancelled' && (
                <button onClick={() => setShowPayModal(true)}
                  className="btn-gold w-full py-2.5 text-sm mt-3">
                  💳 Pay Advance ₹{booking.advanceAmount?.toLocaleString('en-IN')}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Admin Notes */}
        {booking.adminNotes && (
          <div className="glass-card p-5 mt-6 border-gold-500/20">
            <p className="font-body text-gold-400 text-sm font-medium mb-1">📋 Note from Team</p>
            <p className="font-body text-white/70 text-sm">{booking.adminNotes}</p>
          </div>
        )}
      </div>

      {/* Payment Modal */}
      {showPayModal && (
        <div className="fixed inset-0 bg-regal-950/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="glass-card p-8 max-w-md w-full border-gold-500/20">
            <h2 className="font-display text-2xl font-semibold text-white mb-2">Pay Advance</h2>
            <p className="font-body text-white/50 text-sm mb-6">Amount: <span className="text-gradient-gold font-semibold text-lg">₹{booking.advanceAmount?.toLocaleString('en-IN')}</span></p>

            <div className="space-y-3 mb-6">
              <label className="label-luxury">Payment Method</label>
              {['UPI', 'Net Banking', 'Credit/Debit Card', 'Cash on Day'].map(method => (
                <label key={method} className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                  payMethod === method ? 'bg-gold-500/10 border border-gold-500/30' : 'bg-white/5 border border-white/10 hover:border-white/20'
                }`}>
                  <input type="radio" name="payMethod" value={method} checked={payMethod === method}
                    onChange={() => setPayMethod(method)} className="accent-gold-500" />
                  <span className="font-body text-white/70 text-sm">{method}</span>
                </label>
              ))}
            </div>

            <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded-xl mb-6">
              <p className="font-body text-yellow-400 text-xs">⚠️ This is a demo payment. No real transaction will occur.</p>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setShowPayModal(false)}
                className="flex-1 btn-outline-gold text-sm py-2.5">Cancel</button>
              <button onClick={handlePay} disabled={paying}
                className="flex-1 btn-gold text-sm py-2.5 flex items-center justify-center gap-2 disabled:opacity-60">
                {paying ? <div className="w-4 h-4 border-2 border-regal-950 border-t-transparent rounded-full animate-spin" /> : '✅ Confirm Payment'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
