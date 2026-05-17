import { useForm } from 'react-hook-form'
import { Phone, Mail, MapPin, Clock, MessageCircle, Package, Send, CheckCircle } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import emailjs from '@emailjs/browser'
import toast from 'react-hot-toast'
import RevealOnScroll from '../components/ui/RevealOnScroll'

// ── EmailJS Config ────────────────────────────────────────────────────────────
// Replace these with your actual EmailJS credentials from emailjs.com
const EMAILJS_SERVICE_ID  = 'service_lightroom'   // your service ID
const EMAILJS_TEMPLATE_ID = 'template_contact'    // your template ID
const EMAILJS_PUBLIC_KEY  = 'YOUR_PUBLIC_KEY'     // your public key
// ─────────────────────────────────────────────────────────────────────────────

const OWNER_PHONE_1  = '+91 91094 22772'
const OWNER_PHONE_2  = '+91 77718 50846'
const OWNER_EMAIL    = 'photoking324@gmail.com'
const OWNER_WHATSAPP = '919109422772'

export default function Contact() {
  const location   = useLocation()
  const formRef    = useRef(null)
  const [loading, setLoading]       = useState(false)
  const [submitted, setSubmitted]   = useState(false)
  const [selectedPkg, setSelectedPkg] = useState(null)

  const { register, handleSubmit, reset, setValue } = useForm()

  // ── Auto-fill from Pricing page ──────────────────────────────────────────
  useEffect(() => {
    const state = location.state
    if (state?.packageName) {
      setSelectedPkg(state)
      setValue('package_name',    state.packageName)
      setValue('package_price',   state.packagePrice)
      setValue('package_details', state.packageDetails)
      // Scroll to form smoothly
      setTimeout(() => {
        document.getElementById('contact-form')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 300)
    }
  }, [location.state])

  const onSubmit = async (data) => {
    setLoading(true)
    try {
      await emailjs.sendForm(
        EMAILJS_SERVICE_ID,
        EMAILJS_TEMPLATE_ID,
        formRef.current,
        EMAILJS_PUBLIC_KEY
      )
      toast.success('Message sent! We\'ll get back to you soon.')
      setSubmitted(true)
      reset()
      setSelectedPkg(null)
    } catch (err) {
      console.error('EmailJS error:', err)
      // Fallback – open mailto so message is never lost
      const subject = encodeURIComponent(`Enquiry: ${data.package_name || 'General'}`)
      const body    = encodeURIComponent(
        `Name: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email || '-'}\n\nPackage: ${data.package_name || '-'} (${data.package_price || '-'})\n\nMessage:\n${data.message}`
      )
      window.location.href = `mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`
      toast.success('Opening your email app to send the message.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-16 px-[5%]">
      {/* Header */}
      <RevealOnScroll className="text-center mb-14">
        <span className="section-label">Reach Out</span>
        <h1 className="section-title">Get In <em className="text-gold italic">Touch</em></h1>
        <div className="divider mx-auto" />
        <p className="text-grey-light text-sm max-w-xl mx-auto">
          Select a package and fill in your details — we'll get back to you to confirm availability and discuss your vision.
        </p>
      </RevealOnScroll>

      {/* Selected Package Banner */}
      {selectedPkg && (
        <div className="max-w-5xl mx-auto mb-8">
          <div className="border border-gold/40 bg-gold/5 p-4 flex items-start gap-4">
            <Package size={20} className="text-gold shrink-0 mt-0.5" />
            <div>
              <p className="text-[0.65rem] tracking-widest uppercase text-gold mb-1">Selected Package</p>
              <p className="text-cream font-serif text-lg font-light">{selectedPkg.packageName}</p>
              <p className="text-gold text-sm mt-0.5">{selectedPkg.packagePrice}</p>
            </div>
          </div>
        </div>
      )}

      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
        {/* Left – Contact Info */}
        <RevealOnScroll direction="left">
          {/* Map placeholder */}
          <div className="bg-card border border-border aspect-[4/3] flex items-center justify-center mb-6 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#141210] to-[#1c1810]" />
            <div className="relative z-10 flex flex-col items-center gap-3">
              <MapPin size={32} className="text-gold/40" />
              <p className="text-grey text-sm text-center leading-relaxed">The Lightroom Photography<br />@photoking324</p>
              <a
                href={`https://wa.me/${OWNER_WHATSAPP}`}
                target="_blank" rel="noopener noreferrer"
                className="btn-gold-outline text-xs mt-2"
              >
                Chat on WhatsApp
              </a>
            </div>
          </div>

          {/* Contact Details */}
          <div className="space-y-5">
            {[
              { Icon: Phone,         label: 'Phone 1',   value: OWNER_PHONE_1,  href: `tel:${OWNER_PHONE_1.replace(/\s/g, '')}` },
              { Icon: Phone,         label: 'Phone 2',   value: OWNER_PHONE_2,  href: `tel:${OWNER_PHONE_2.replace(/\s/g, '')}` },
              { Icon: MessageCircle, label: 'WhatsApp',  value: OWNER_PHONE_1,  href: `https://wa.me/${OWNER_WHATSAPP}` },
              { Icon: Mail,          label: 'Email',     value: OWNER_EMAIL,    href: `mailto:${OWNER_EMAIL}` },
              { Icon: Clock,         label: 'Hours',     value: 'Mon – Sun: 9am – 8pm' },
            ].map(({ Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-4">
                <div className="w-9 h-9 border border-gold/20 flex items-center justify-center shrink-0">
                  <Icon size={14} className="text-gold" />
                </div>
                <div>
                  <p className="text-[0.65rem] uppercase tracking-widest text-gold mb-0.5">{label}</p>
                  {href
                    ? <a href={href} className="text-grey-light text-sm hover:text-gold transition-colors">{value}</a>
                    : <p className="text-grey-light text-sm">{value}</p>}
                </div>
              </div>
            ))}
          </div>

          {/* Instagram handle */}
          <div className="mt-6 border-t border-border pt-5">
            <p className="text-grey text-xs tracking-widest uppercase mb-2">Follow Our Work</p>
            <a
              href="https://www.instagram.com/photoking324"
              target="_blank" rel="noopener noreferrer"
              className="text-gold text-sm hover:underline"
            >
              @photoking324
            </a>
          </div>
        </RevealOnScroll>

        {/* Right – Contact Form */}
        <RevealOnScroll direction="right" id="contact-form">
          <div className="bg-card border border-border p-8">
            {submitted ? (
              /* Success State */
              <div className="flex flex-col items-center justify-center py-12 gap-4 text-center">
                <CheckCircle size={48} className="text-gold" />
                <h3 className="font-serif text-2xl font-light">Message Sent!</h3>
                <p className="text-grey-light text-sm max-w-xs">
                  Thank you for reaching out. We'll contact you within 24 hours to discuss your booking.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="btn-gold-outline text-xs mt-4"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <>
                <h3 className="font-serif text-2xl font-light mb-2">
                  {selectedPkg ? 'Enquire About Package' : 'Send a'}{' '}
                  {!selectedPkg && <em className="text-gold italic">Message</em>}
                </h3>
                {selectedPkg && (
                  <p className="text-gold font-serif text-lg italic mb-4">{selectedPkg.packageName}</p>
                )}

                <form ref={formRef} onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  {/* Hidden fields for package info */}
                  <input type="hidden" {...register('package_name')} />
                  <input type="hidden" {...register('package_price')} />
                  <input type="hidden" {...register('package_details')} />
                  {/* Hidden field with recipient email */}
                  <input type="hidden" name="to_email" value={OWNER_EMAIL} />

                  <div>
                    <label className="form-label">Your Name *</label>
                    <input
                      className="form-input"
                      placeholder="Full name"
                      {...register('name', { required: true })}
                    />
                  </div>

                  <div>
                    <label className="form-label">Phone Number *</label>
                    <input
                      className="form-input"
                      type="tel"
                      placeholder="+91 XXXXX XXXXX"
                      {...register('phone', { required: true })}
                    />
                  </div>

                  <div>
                    <label className="form-label">Email (optional)</label>
                    <input
                      className="form-input"
                      type="email"
                      placeholder="your@email.com"
                      {...register('email')}
                    />
                  </div>

                  <div>
                    <label className="form-label">Event Date</label>
                    <input
                      className="form-input"
                      type="date"
                      {...register('event_date')}
                    />
                  </div>

                  <div>
                    <label className="form-label">Message / Additional Details</label>
                    <textarea
                      className="form-input resize-none"
                      rows={4}
                      placeholder={selectedPkg
                        ? `I'm interested in the ${selectedPkg.packageName}. Please let me know availability...`
                        : 'Tell us about your event, date, location, or any special requirements...'}
                      {...register('message', { required: true })}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-gold text-black py-3.5 text-[0.72rem] tracking-widest uppercase hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2"
                  >
                    {loading && <span className="w-4 h-4 border-2 border-black/30 border-t-black rounded-full animate-spin" />}
                    <Send size={14} />
                    {loading ? 'Sending...' : 'Send Enquiry'}
                  </button>

                  <p className="text-grey text-[0.65rem] text-center">
                    Or call us directly at{' '}
                    <a href={`tel:+919109422772`} className="text-gold hover:underline">+91 91094 22772</a>
                    {' '}|{' '}
                    <a href={`tel:+917771850846`} className="text-gold hover:underline">+91 77718 50846</a>
                  </p>
                </form>
              </>
            )}
          </div>
        </RevealOnScroll>
      </div>
    </div>
  )
}
