import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { servicesAPI } from '../services/api'
import { useAuth } from '../context/AuthContext'

export default function ServiceDetailPage() {
  const { id } = useParams()
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(true)
  const { isAuthenticated } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    servicesAPI.getOne(id)
      .then(({ data }) => setService(data.service))
      .catch(() => navigate('/services'))
      .finally(() => setLoading(false))
  }, [id, navigate])

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-gold-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  if (!service) return null

  const formatPrice = (price, category) =>
    category === 'Catering' ? `₹${price.toLocaleString('en-IN')}/plate` : `₹${price.toLocaleString('en-IN')}`

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero */}
      <div className="relative h-[50vh] min-h-[400px] overflow-hidden">
        <img src={service.image} alt={service.title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-regal-950 via-regal-950/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-8 page-container">
          <Link to="/services" className="inline-flex items-center gap-2 text-white/60 hover:text-gold-400 font-body text-sm mb-4 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to Services
          </Link>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <span className="badge-gold mb-2 inline-block">{service.category}</span>
              <h1 className="font-display text-4xl md:text-5xl font-semibold text-white">{service.title}</h1>
            </div>
            <div className="text-right">
              <p className="font-display text-3xl md:text-4xl font-semibold text-gradient-gold">
                {formatPrice(service.price, service.category)}
              </p>
              <p className="font-body text-white/40 text-sm">Starting price</p>
            </div>
          </div>
        </div>
      </div>

      <div className="page-container py-10">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Description */}
            <div className="glass-card p-6">
              <h2 className="font-display text-2xl font-semibold text-white mb-4">About This Service</h2>
              <p className="font-body text-white/70 leading-relaxed">{service.description}</p>
            </div>

            {/* Features */}
            {service.features?.length > 0 && (
              <div className="glass-card p-6">
                <h2 className="font-display text-2xl font-semibold text-white mb-4">What's Included</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {service.features.map((f, i) => (
                    <div key={i} className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                      <div className="w-6 h-6 rounded-full bg-gold-500/20 border border-gold-500/30 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-gold-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="font-body text-white/70 text-sm">{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Service Details */}
            <div className="glass-card p-6">
              <h2 className="font-display text-2xl font-semibold text-white mb-4">Service Details</h2>
              <div className="grid grid-cols-2 gap-4">
                {[
                  { label: 'Category', value: service.category, icon: '🏷️' },
                  { label: 'Max Capacity', value: `${service.capacity} guests`, icon: '👥' },
                  { label: 'Rating', value: `${service.rating}/5 (${service.reviewCount} reviews)`, icon: '⭐' },
                  { label: 'Availability', value: service.isAvailable ? 'Available' : 'Unavailable', icon: service.isAvailable ? '✅' : '❌' },
                ].map((item, i) => (
                  <div key={i} className="p-4 bg-white/5 rounded-xl">
                    <p className="text-2xl mb-1">{item.icon}</p>
                    <p className="font-body text-white/40 text-xs mb-1">{item.label}</p>
                    <p className="font-body text-white font-medium text-sm">{item.value}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar Booking Card */}
          <div className="lg:col-span-1">
            <div className="glass-card p-6 sticky top-28">
              <div className="text-center mb-6">
                <p className="font-body text-white/50 text-sm mb-1">Starting from</p>
                <p className="font-display text-4xl font-semibold text-gradient-gold">
                  {formatPrice(service.price, service.category)}
                </p>
                {service.category === 'Catering' && (
                  <p className="font-body text-white/40 text-xs mt-1">Final amount depends on guest count</p>
                )}
              </div>

              <div className="space-y-3 mb-6">
                {[
                  '30% advance booking amount',
                  'Dedicated event coordinator',
                  'Free consultation call',
                  'Easy cancellation policy',
                ].map((b, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gold-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span className="font-body text-white/60 text-sm">{b}</span>
                  </div>
                ))}
              </div>

              {service.isAvailable ? (
                <div className="space-y-3">
                  {isAuthenticated ? (
                    <Link to={`/book/${service._id}`} className="btn-gold w-full text-center block py-3.5 text-base">
                      Book This Service
                    </Link>
                  ) : (
                    <Link to="/login" state={{ from: `/book/${service._id}` }} className="btn-gold w-full text-center block py-3.5 text-base">
                      Login to Book
                    </Link>
                  )}
                  <a href="tel:+919876543210" className="btn-outline-gold w-full text-center block py-3 text-sm">
                    📞 Call for Enquiry
                  </a>
                </div>
              ) : (
                <div className="text-center p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                  <p className="text-red-400 font-body text-sm">This service is currently unavailable</p>
                </div>
              )}

              <p className="font-body text-white/30 text-xs text-center mt-4">
                ✦ No payment required at this stage ✦
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
