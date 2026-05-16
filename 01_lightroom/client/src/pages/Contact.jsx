import { useForm } from 'react-hook-form'
import { Phone, Mail, MapPin, Clock, MessageCircle } from 'lucide-react'
import { useState } from 'react'
import api from '../services/api'
import toast from 'react-hot-toast'
import RevealOnScroll from '../components/ui/RevealOnScroll'

export default function Contact() {
  const [loading, setLoading] = useState(false)
  const { register, handleSubmit, reset } = useForm()

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await api.post('/contact', data)
      toast.success('Message sent! We\'ll respond within 24 hours.')
      reset()
    } catch {
      toast.error('Failed to send message')
    } finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-[5%]">
      <RevealOnScroll className="text-center mb-14">
        <span className="section-label">Reach Out</span>
        <h1 className="section-title">Get In <em className="text-gold italic">Touch</em></h1>
        <div className="divider mx-auto" />
      </RevealOnScroll>

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        <RevealOnScroll direction="left">
          <div className="bg-card border border-border aspect-[4/3] flex items-center justify-center mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#141210] to-[#1c1810]" />
            <div className="relative z-10 flex flex-col items-center gap-3">
              <MapPin size={32} className="text-gold/40" />
              <p className="text-grey text-sm text-center">Studio 4B, Connaught Place<br/>New Delhi – 110001</p>
              <a href="https://maps.google.com" target="_blank" rel="noopener noreferrer" className="btn-gold-outline text-xs mt-2">Open in Maps</a>
            </div>
          </div>

          <div className="space-y-5">
            {[
              { Icon: Phone, label: 'Phone', value: '+91 98765 43210', href: 'tel:+919876543210' },
              { Icon: MessageCircle, label: 'WhatsApp', value: '+91 98765 43210', href: 'https://wa.me/919876543210' },
              { Icon: Mail, label: 'Email', value: 'hello@thelightroom.com', href: 'mailto:hello@thelightroom.com' },
              { Icon: MapPin, label: 'Studio', value: 'Studio 4B, Connaught Place, New Delhi' },
              { Icon: Clock, label: 'Hours', value: 'Mon – Sat: 10am – 7pm' },
            ].map(({ Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-9 h-9 border border-gold/20 flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-gold" />
                </div>
                <div>
                  <p className="text-[0.65rem] uppercase tracking-widest text-gold mb-0.5">{label}</p>
                  {href ? <a href={href} className="text-grey-light text-sm hover:text-gold transition-colors">{value}</a>
                    : <p className="text-grey-light text-sm">{value}</p>}
                </div>
              </div>
            ))}
          </div>
        </RevealOnScroll>

        <RevealOnScroll direction="right">
          <div className="bg-card border border-border p-8">
            <h3 className="font-serif text-2xl font-light mb-6">Send a <em className="text-gold italic">Message</em></h3>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="form-label">Your Name</label>
                <input className="form-input" placeholder="Full name" {...register('name', { required: true })} />
              </div>
              <div>
                <label className="form-label">Email</label>
                <input className="form-input" type="email" placeholder="your@email.com" {...register('email', { required: true })} />
              </div>
              <div>
                <label className="form-label">Subject</label>
                <input className="form-input" placeholder="How can we help?" {...register('subject')} />
              </div>
              <div>
                <label className="form-label">Message</label>
                <textarea className="form-input resize-none" rows={5} placeholder="Tell us about your enquiry..." {...register('message', { required: true })} />
              </div>
              <button type="submit" disabled={loading}
                className="w-full bg-gold text-black py-3.5 text-[0.72rem] tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2">
                {loading && <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
                {loading ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </RevealOnScroll>
      </div>
    </div>
  )
}
