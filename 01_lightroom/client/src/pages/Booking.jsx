import { useForm } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Phone, Mail, MapPin, Upload, CheckCircle } from 'lucide-react'
import { useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'
import RevealOnScroll from '../components/ui/RevealOnScroll'

export default function Booking() {
  const [submitted, setSubmitted] = useState(false)
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, formState: { errors }, reset } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      const formData = new FormData()
      Object.entries(data).forEach(([k, v]) => {
        if (k === 'referenceImages') {
          if (v && v[0]) Array.from(v).forEach(f => formData.append('referenceImages', f))
        } else {
          formData.append(k, v)
        }
      })
      await api.post('/bookings', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
      setSubmitted(true)
      reset()
      toast.success('Booking request submitted!')
    } catch(e) {
      toast.error('Failed to submit booking. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-[5%]">
      <RevealOnScroll className="text-center mb-14">
        <span className="section-label">Get In Touch</span>
        <h1 className="section-title">Book Your <em className="text-gold italic">Session</em></h1>
        <div className="divider mx-auto" />
        <p className="text-grey-light text-sm max-w-lg mx-auto">Let's create something beautiful together. Tell us about your vision.</p>
      </RevealOnScroll>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
        {/* Left Info */}
        <RevealOnScroll direction="left">
          <h2 className="font-serif text-2xl font-light mb-4">Let's Create Something<br/><em className="text-gold italic">Beautiful</em> Together</h2>
          <div className="divider" />
          <p className="text-grey-light text-sm leading-relaxed mb-4">Every great photograph begins with a conversation. Tell us about your vision, your story, and the moments you want to preserve forever.</p>
          <p className="text-grey-light text-sm leading-relaxed mb-8">We typically respond within 24 hours and would love to discuss how we can make your event unforgettable.</p>

          <div className="space-y-4 mb-8">
            {[
              { Icon: Phone, text: '+91 98765 43210' },
              { Icon: Mail, text: 'hello@thelightroom.com' },
              { Icon: MapPin, text: 'Studio 4B, Connaught Place, New Delhi – 110001' },
            ].map(({ Icon, text }) => (
              <div key={text} className="flex items-start gap-3">
                <div className="w-8 h-8 border border-gold/20 flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-gold" />
                </div>
                <p className="text-grey-light text-sm leading-relaxed">{text}</p>
              </div>
            ))}
          </div>

          <div className="bg-gradient-to-br from-[#1a1508] to-[#111] border border-gold/20 p-6">
            <h4 className="font-serif text-lg text-gold italic mb-2">Why Choose Us?</h4>
            {['10+ years of professional experience','Cinematic high-resolution delivery','Dedicated client portal & gallery','Flexible packages for every budget'].map(t => (
              <div key={t} className="flex items-center gap-2 text-sm text-grey-light mt-2">
                <CheckCircle size={12} className="text-gold shrink-0" />
                {t}
              </div>
            ))}
          </div>
        </RevealOnScroll>

        {/* Right Form */}
        <RevealOnScroll direction="right">
          {submitted ? (
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-card border border-gold/30 p-12 text-center">
              <CheckCircle size={48} className="text-gold mx-auto mb-4" />
              <h3 className="font-serif text-2xl mb-2">Request Submitted!</h3>
              <p className="text-grey-light text-sm mb-6">Thank you! We'll contact you within 24 hours to discuss your booking.</p>
              <button onClick={() => setSubmitted(false)} className="btn-gold-outline">Submit Another Request</button>
            </motion.div>
          ) : (
            <div className="bg-card border border-border p-8">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Full Name *</label>
                    <input className="form-input" placeholder="Your full name" {...register('name', { required: true })} />
                    {errors.name && <p className="text-red-400 text-xs mt-1">Required</p>}
                  </div>
                  <div>
                    <label className="form-label">Email *</label>
                    <input className="form-input" type="email" placeholder="your@email.com" {...register('email', { required: true })} />
                    {errors.email && <p className="text-red-400 text-xs mt-1">Required</p>}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Phone *</label>
                    <input className="form-input" placeholder="+91 00000 00000" {...register('phone', { required: true })} />
                  </div>
                  <div>
                    <label className="form-label">Event Type *</label>
                    <select className="form-input" {...register('eventType', { required: true })}>
                      <option value="">Select type</option>
                      {['Wedding','Birthday','Pre-Wedding','Bridal Shoot','Corporate Event','Fashion Shoot','Baby Shoot','Engagement'].map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="form-label">Event Date *</label>
                    <input className="form-input" type="date" {...register('eventDate', { required: true })} />
                  </div>
                  <div>
                    <label className="form-label">Budget Range</label>
                    <select className="form-input" {...register('budget')}>
                      <option>Select range</option>
                      <option>₹20,000 – ₹40,000</option>
                      <option>₹40,000 – ₹70,000</option>
                      <option>₹70,000 – ₹1,00,000</option>
                      <option>Above ₹1,00,000</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="form-label">Event Location</label>
                  <input className="form-input" placeholder="City or venue" {...register('location')} />
                </div>

                <div>
                  <label className="form-label">Message / Requirements</label>
                  <textarea className="form-input resize-none" rows={4} placeholder="Tell us about your vision, theme, or special requirements..." {...register('message')} />
                </div>

                <div>
                  <label className="form-label">Reference Images (optional)</label>
                  <label className="border border-dashed border-border hover:border-gold/50 p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors duration-300 group">
                    <Upload size={20} className="text-grey-light group-hover:text-gold transition-colors" />
                    <p className="text-grey text-xs text-center">Click to upload reference images<br/><span className="text-gold">JPG, PNG</span> up to 10MB each</p>
                    <input type="file" multiple accept="image/*" className="hidden" {...register('referenceImages')} />
                  </label>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full bg-gold text-black py-4 text-xs tracking-[0.2em] uppercase font-medium hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                  {loading ? <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" /> : null}
                  {loading ? 'Submitting...' : 'Submit Booking Request'}
                </button>
              </form>
            </div>
          )}
        </RevealOnScroll>
      </div>
    </div>
  )
}
