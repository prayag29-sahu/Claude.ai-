import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { servicesAPI } from '../services/api'
import ServiceCard from '../components/common/ServiceCard'

const heroImages = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=1600',
  'https://images.unsplash.com/photo-1478146059778-26ede37e3e4e?w=1600',
  'https://images.unsplash.com/photo-1511578314322-379afb476865?w=1600',
]

const stats = [
  { label: 'Events Completed', value: '2,500+', icon: '🎪' },
  { label: 'Happy Clients', value: '1,800+', icon: '😊' },
  { label: 'Cities Covered', value: '25+', icon: '🌆' },
  { label: 'Years Experience', value: '12+', icon: '⭐' },
]

const whyUs = [
  { icon: '👑', title: 'Luxury Experience', desc: 'We craft premium events with attention to every tiny detail, ensuring nothing short of perfection.' },
  { icon: '🤝', title: 'Dedicated Manager', desc: 'A personal event manager assigned to you from day one till the final moment of your event.' },
  { icon: '💎', title: 'Premium Vendors', desc: 'We work only with vetted, top-tier vendors who meet our strict quality standards.' },
  { icon: '📋', title: 'End-to-End Planning', desc: 'From concept to execution, we handle every aspect so you can enjoy your special day.' },
  { icon: '⏰', title: 'On-Time Delivery', desc: 'We respect time as much as you do — 99.8% of our events run perfectly on schedule.' },
  { icon: '💰', title: 'Transparent Pricing', desc: 'No hidden charges ever. What we quote is what you pay — complete financial transparency.' },
]

const testimonials = [
  { name: 'Anjali Mehta', event: 'Wedding Reception', rating: 5, text: 'VisionVivaah transformed our wedding into an absolute dream. Every detail was perfect, every moment magical.' },
  { name: 'Rohit Sharma', event: 'Corporate Annual Meet', rating: 5, text: 'Exceptional professionalism. Our corporate event was flawlessly executed — attendees are still talking about it.' },
  { name: 'Priya Kapoor', event: 'Birthday Celebration', rating: 5, text: 'The decoration was breathtaking. My daughter\'s birthday looked like it came straight out of a fairy tale.' },
]

export default function HomePage() {
  const [heroIndex, setHeroIndex] = useState(0)
  const [featuredServices, setFeaturedServices] = useState([])

  useEffect(() => {
    const interval = setInterval(() => setHeroIndex(i => (i + 1) % heroImages.length), 5000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    servicesAPI.getAll({ limit: 6, sort: '-rating' })
      .then(({ data }) => setFeaturedServices(data.services || []))
      .catch(console.error)
  }, [])

  return (
    <div className="particles-bg">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background Slideshow */}
        {heroImages.map((img, i) => (
          <div
            key={i}
            className="absolute inset-0 transition-opacity duration-1000"
            style={{ opacity: i === heroIndex ? 1 : 0 }}
          >
            <img src={img} alt="" className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-hero-gradient" />
          </div>
        ))}

        {/* Decorative Elements */}
        <div className="absolute top-1/4 left-10 w-40 h-40 rounded-full bg-gold-500/5 blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-10 w-60 h-60 rounded-full bg-regal-600/10 blur-3xl animate-float" style={{animationDelay:'1.5s'}} />

        {/* Hero Content */}
        <div className="relative z-10 text-center page-container py-32 pt-40">
          <div className="animate-fade-up">
            <span className="inline-block font-accent text-gold-400 text-xs tracking-[0.4em] uppercase mb-6 border border-gold-500/30 px-6 py-2 rounded-full bg-gold-500/10 backdrop-blur-sm">
              ✦ Premium Event Management ✦
            </span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold text-white leading-tight mb-6 animate-fade-up delay-100">
            Where Dreams<br />
            <span className="text-gradient-gold italic">Become Reality</span>
          </h1>

          <p className="font-body text-white/60 text-lg sm:text-xl max-w-2xl mx-auto mb-10 animate-fade-up delay-200">
            From intimate gatherings to grand celebrations — we craft extraordinary experiences with unmatched elegance and precision.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-up delay-300">
            <Link to="/services" className="btn-gold text-base px-8 py-4 inline-flex items-center gap-2">
              Explore Services
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
            <a href="tel:+919876543210" className="btn-outline-gold text-base px-8 py-4 inline-flex items-center gap-2">
              📞 Call Us Now
            </a>
          </div>

          {/* Slideshow Dots */}
          <div className="flex justify-center gap-2 mt-16">
            {heroImages.map((_, i) => (
              <button
                key={i}
                onClick={() => setHeroIndex(i)}
                className={`rounded-full transition-all duration-300 ${
                  i === heroIndex ? 'w-8 h-2 bg-gold-400' : 'w-2 h-2 bg-white/30 hover:bg-white/50'
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="relative z-10 -mt-1 bg-regal-900/50 backdrop-blur-xl border-y border-white/5">
        <div className="page-container py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center">
                <div className="text-3xl mb-1">{stat.icon}</div>
                <div className="font-display text-3xl font-semibold text-gradient-gold">{stat.value}</div>
                <div className="font-body text-white/50 text-sm">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Services */}
      <section className="py-24">
        <div className="page-container">
          <div className="text-center mb-14">
            <span className="font-accent text-gold-400 text-xs tracking-widest uppercase">What We Offer</span>
            <div className="gold-divider" />
            <h2 className="section-title">Our Premium Services</h2>
            <p className="section-subtitle mx-auto">
              Carefully curated services to make every event a masterpiece
            </p>
          </div>

          {featuredServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredServices.map(service => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="card-luxury overflow-hidden">
                  <div className="aspect-[4/3] shimmer-bg" />
                  <div className="p-5 space-y-3">
                    <div className="h-6 shimmer-bg rounded-lg w-3/4" />
                    <div className="h-4 shimmer-bg rounded-lg" />
                    <div className="h-4 shimmer-bg rounded-lg w-5/6" />
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="text-center mt-10">
            <Link to="/services" className="btn-outline-gold text-sm px-8 py-3 inline-flex items-center gap-2">
              View All Services
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-regal-900/30">
        <div className="page-container">
          <div className="text-center mb-14">
            <span className="font-accent text-gold-400 text-xs tracking-widest uppercase">Why VisionVivaah</span>
            <div className="gold-divider" />
            <h2 className="section-title">The Gold Standard in Events</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUs.map((item, i) => (
              <div key={i} className="card-luxury p-6 group">
                <div className="text-4xl mb-4 group-hover:animate-float inline-block">{item.icon}</div>
                <h3 className="font-display text-xl font-semibold text-white mb-2 group-hover:text-gradient-gold transition-all duration-300">
                  {item.title}
                </h3>
                <p className="font-body text-white/50 text-sm leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24">
        <div className="page-container">
          <div className="text-center mb-14">
            <span className="font-accent text-gold-400 text-xs tracking-widest uppercase">Client Love</span>
            <div className="gold-divider" />
            <h2 className="section-title">What Our Clients Say</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t, i) => (
              <div key={i} className="card-luxury p-6">
                <div className="flex mb-4">
                  {[...Array(t.rating)].map((_, j) => (
                    <svg key={j} className="w-4 h-4 text-gold-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="font-body text-white/70 text-sm leading-relaxed mb-5 italic">"{t.text}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gold-gradient flex items-center justify-center">
                    <span className="text-regal-950 font-bold text-sm">{t.name[0]}</span>
                  </div>
                  <div>
                    <p className="font-body text-white font-medium text-sm">{t.name}</p>
                    <p className="font-body text-white/40 text-xs">{t.event}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-regal-900/50">
        <div className="page-container text-center">
          <div className="max-w-3xl mx-auto glass-card p-12 border-gold-500/20">
            <span className="text-5xl block mb-6">👑</span>
            <h2 className="font-display text-4xl md:text-5xl font-semibold text-white mb-4">
              Ready to Create<br />
              <span className="text-gradient-gold">Something Extraordinary?</span>
            </h2>
            <p className="font-body text-white/60 text-lg mb-8">
              Let's start planning your perfect event today. Our team is ready to bring your vision to life.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/services" className="btn-gold text-base px-8 py-4">Browse Services</Link>
              <Link to="/register" className="btn-outline-gold text-base px-8 py-4">Create Account</Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
