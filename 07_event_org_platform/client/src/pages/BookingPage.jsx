import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { servicesAPI, bookingsAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

export default function BookingPage() {
  const { serviceId } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [step, setStep] = useState(1)

  const [form, setForm] = useState({
    eventDate: '',
    eventTime: '10:00',
    guestCount: 100,
    requirements: '',
    location: { address: '', city: '', state: '', pincode: '' },
    contactName: user?.name || '',
    contactPhone: user?.phone || '',
    contactEmail: user?.email || '',
  })

  const [errors, setErrors] = useState({})

  useEffect(() => {
    servicesAPI.getOne(serviceId)
      .then(({ data }) => setService(data.service))
      .catch(() => navigate('/services'))
      .finally(() => setLoading(false))
  }, [serviceId, navigate])

  const handleChange = (e) => {
    const { name, value } = e.target
    if (name.startsWith('location.')) {
      const key = name.split('.')[1]
      setForm(p => ({ ...p, location: { ...p.location, [key]: value } }))
    } else {
      setForm(p => ({ ...p, [name]: value }))
    }
    if (errors[name]) setErrors(p => ({ ...p, [name]: '' }))
  }

  const validateStep1 = () => {
    const e = {}
    if (!form.eventDate) e.eventDate = 'Event date is required'
    else if (new Date(form.eventDate) < new Date()) e.eventDate = 'Event date cannot be in the past'
    if (!form.guestCount || form.guestCount < 1) e.guestCount = 'Guest count is required'
    if (!form.location.address) e['location.address'] = 'Address is required'
    if (!form.location.city) e['location.city'] = 'City is required'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const validateStep2 = () => {
    const e = {}
    if (!form.contactName) e.contactName = 'Name is required'
    if (!/^[0-9]{10}$/.test(form.contactPhone)) e.contactPhone = 'Enter valid 10-digit phone'
    if (!/^\S+@\S+\.\S+$/.test(form.contactEmail)) e.contactEmail = 'Enter valid email'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async () => {
    if (!validateStep2()) return
    setSubmitting(true)
    try {
      const { data } = await bookingsAPI.create({ ...form, serviceId })
      toast.success('🎉 Booking confirmed! Check your dashboard.')
      navigate(`/bookings/${data.booking._id}`)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const totalAmount = service
    ? service.category === 'Catering'
      ? service.price * form.guestCount
      : service.price
    : 0
  const advanceAmount = Math.round(totalAmount * 0.3)

  const minDate = new Date()
  minDate.setDate(minDate.getDate() + 1)
  const minDateStr = minDate.toISOString().split('T')[0]

  if (loading) return (
    <div className="min-h-screen pt-24 flex items-center justify-center">
      <div className="w-12 h-12 rounded-full border-2 border-gold-500 border-t-transparent animate-spin" />
    </div>
  )

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="page-container max-w-4xl">
        {/* Header */}
        <div className="text-center mb-10">
          <span className="font-accent text-gold-400 text-xs tracking-widest uppercase">Book Service</span>
          <h1 className="font-display text-3xl md:text-4xl font-semibold text-white mt-2">{service?.title}</h1>
          <p className="font-body text-white/50 mt-2">Complete the form below to secure your booking</p>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-4 mb-10">
          {[
            { n: 1, label: 'Event Details' },
            { n: 2, label: 'Contact Info' },
            { n: 3, label: 'Confirmation' },
          ].map((s, i) => (
            <div key={s.n} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold font-body transition-all duration-300 ${
                  step > s.n ? 'bg-gold-gradient text-regal-950'
                  : step === s.n ? 'bg-gold-500/20 border-2 border-gold-500 text-gold-400'
                  : 'bg-white/5 border border-white/20 text-white/30'
                }`}>
                  {step > s.n ? '✓' : s.n}
                </div>
                <span className={`font-body text-sm hidden sm:block ${step === s.n ? 'text-gold-400' : 'text-white/30'}`}>
                  {s.label}
                </span>
              </div>
              {i < 2 && <div className={`w-12 h-0.5 ${step > s.n ? 'bg-gold-500' : 'bg-white/10'}`} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2">
            {/* Step 1: Event Details */}
            {step === 1 && (
              <div className="glass-card p-6 space-y-5 animate-fade-up">
                <h2 className="font-display text-xl font-semibold text-white">Event Details</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label-luxury">Event Date *</label>
                    <input type="date" name="eventDate" min={minDateStr} value={form.eventDate}
                      onChange={handleChange} className="input-luxury" />
                    {errors.eventDate && <p className="text-red-400 text-xs mt-1">{errors.eventDate}</p>}
                  </div>
                  <div>
                    <label className="label-luxury">Event Time</label>
                    <input type="time" name="eventTime" value={form.eventTime}
                      onChange={handleChange} className="input-luxury" />
                  </div>
                </div>

                <div>
                  <label className="label-luxury">Number of Guests *</label>
                  <input type="number" name="guestCount" min="1" max={service?.capacity}
                    value={form.guestCount} onChange={handleChange} className="input-luxury" />
                  {errors.guestCount && <p className="text-red-400 text-xs mt-1">{errors.guestCount}</p>}
                  <p className="text-white/30 text-xs mt-1">Max capacity: {service?.capacity} guests</p>
                </div>

                <div>
                  <label className="label-luxury">Event Address *</label>
                  <input type="text" name="location.address" placeholder="Street address, venue name"
                    value={form.location.address} onChange={handleChange} className="input-luxury" />
                  {errors['location.address'] && <p className="text-red-400 text-xs mt-1">{errors['location.address']}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="label-luxury">City *</label>
                    <input type="text" name="location.city" placeholder="City"
                      value={form.location.city} onChange={handleChange} className="input-luxury" />
                    {errors['location.city'] && <p className="text-red-400 text-xs mt-1">{errors['location.city']}</p>}
                  </div>
                  <div>
                    <label className="label-luxury">State</label>
                    <input type="text" name="location.state" placeholder="State"
                      value={form.location.state} onChange={handleChange} className="input-luxury" />
                  </div>
                  <div>
                    <label className="label-luxury">Pincode</label>
                    <input type="text" name="location.pincode" placeholder="Pincode"
                      value={form.location.pincode} onChange={handleChange} className="input-luxury" />
                  </div>
                </div>

                <div>
                  <label className="label-luxury">Special Requirements</label>
                  <textarea name="requirements" rows={3} placeholder="Any specific requirements or preferences..."
                    value={form.requirements} onChange={handleChange}
                    className="input-luxury resize-none" />
                </div>

                <button onClick={() => validateStep1() && setStep(2)}
                  className="btn-gold w-full py-3.5 text-base">
                  Continue to Contact Details →
                </button>
              </div>
            )}

            {/* Step 2: Contact Info */}
            {step === 2 && (
              <div className="glass-card p-6 space-y-5 animate-fade-up">
                <div className="flex items-center gap-3">
                  <button onClick={() => setStep(1)} className="text-white/40 hover:text-gold-400 transition-colors">
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <h2 className="font-display text-xl font-semibold text-white">Contact Information</h2>
                </div>

                <div>
                  <label className="label-luxury">Full Name *</label>
                  <input type="text" name="contactName" placeholder="Your full name"
                    value={form.contactName} onChange={handleChange} className="input-luxury" />
                  {errors.contactName && <p className="text-red-400 text-xs mt-1">{errors.contactName}</p>}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label-luxury">Phone Number *</label>
                    <input type="tel" name="contactPhone" placeholder="10-digit mobile number"
                      value={form.contactPhone} onChange={handleChange} className="input-luxury" />
                    {errors.contactPhone && <p className="text-red-400 text-xs mt-1">{errors.contactPhone}</p>}
                  </div>
                  <div>
                    <label className="label-luxury">Email Address *</label>
                    <input type="email" name="contactEmail" placeholder="your@email.com"
                      value={form.contactEmail} onChange={handleChange} className="input-luxury" />
                    {errors.contactEmail && <p className="text-red-400 text-xs mt-1">{errors.contactEmail}</p>}
                  </div>
                </div>

                <div className="p-4 bg-gold-500/10 border border-gold-500/20 rounded-xl">
                  <p className="font-body text-gold-400 text-sm font-medium mb-2">📋 Booking Summary</p>
                  <div className="space-y-1 text-sm font-body text-white/60">
                    <p>Service: <span className="text-white">{service?.title}</span></p>
                    <p>Date: <span className="text-white">{form.eventDate ? new Date(form.eventDate).toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }) : 'Not set'}</span></p>
                    <p>Guests: <span className="text-white">{form.guestCount}</span></p>
                    <p>Venue: <span className="text-white">{form.location.city || 'Not set'}</span></p>
                  </div>
                </div>

                <button onClick={handleSubmit} disabled={submitting}
                  className="btn-gold w-full py-3.5 text-base disabled:opacity-60 flex items-center justify-center gap-2">
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-regal-950 border-t-transparent rounded-full animate-spin" />
                      Processing...
                    </>
                  ) : '🎉 Confirm Booking'}
                </button>
              </div>
            )}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass-card p-5 sticky top-28">
              <img src={service?.image} alt={service?.title}
                className="w-full h-36 object-cover rounded-xl mb-4"
                onError={e => e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400'} />

              <h3 className="font-display text-lg font-semibold text-white mb-1">{service?.title}</h3>
              <span className="badge-gold text-xs mb-4 inline-block">{service?.category}</span>

              <div className="space-y-2 mb-4 pt-3 border-t border-white/10">
                <div className="flex justify-between font-body text-sm">
                  <span className="text-white/50">Service Price</span>
                  <span className="text-white">₹{service?.price?.toLocaleString('en-IN')}{service?.category === 'Catering' ? '/plate' : ''}</span>
                </div>
                {service?.category === 'Catering' && (
                  <div className="flex justify-between font-body text-sm">
                    <span className="text-white/50">× {form.guestCount} guests</span>
                    <span className="text-white">= ₹{totalAmount.toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div className="flex justify-between font-body text-sm pt-2 border-t border-white/10">
                  <span className="text-gold-400 font-medium">Total Amount</span>
                  <span className="text-gradient-gold font-semibold">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between font-body text-sm bg-gold-500/10 p-2 rounded-lg">
                  <span className="text-gold-300">Advance (30%)</span>
                  <span className="text-gold-400 font-semibold">₹{advanceAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <p className="font-body text-white/30 text-xs text-center">
                Remaining balance paid on event day
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
