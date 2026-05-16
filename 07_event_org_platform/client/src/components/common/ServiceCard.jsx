import { Link } from 'react-router-dom'

const categoryColors = {
  Tent: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  DJ: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  Catering: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  Decoration: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  'Full Event': 'bg-gold-500/20 text-gold-400 border-gold-500/30',
  Photography: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  Other: 'bg-gray-500/20 text-gray-400 border-gray-500/30',
}

const categoryIcons = {
  Tent: '⛺',
  DJ: '🎵',
  Catering: '🍽️',
  Decoration: '🌸',
  'Full Event': '👑',
  Photography: '📷',
  Other: '✨',
}

export default function ServiceCard({ service }) {
  const formatPrice = (price, category) => {
    if (category === 'Catering') return `₹${price.toLocaleString('en-IN')}/plate`
    return `₹${price.toLocaleString('en-IN')}`
  }

  return (
    <div className="card-luxury group overflow-hidden">
      {/* Image */}
      <div className="relative overflow-hidden aspect-[4/3]">
        <img
          src={service.image}
          alt={service.title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800' }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-regal-950/90 via-regal-950/20 to-transparent" />

        {/* Category Badge */}
        <div className={`absolute top-3 left-3 badge border ${categoryColors[service.category] || categoryColors.Other}`}>
          {categoryIcons[service.category]} {service.category}
        </div>

        {/* Availability */}
        {!service.isAvailable && (
          <div className="absolute top-3 right-3 badge bg-red-500/20 text-red-400 border border-red-500/30">
            Unavailable
          </div>
        )}

        {/* Price on hover */}
        <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-400">
          <div className="flex items-center justify-between">
            <span className="font-display text-2xl font-semibold text-gradient-gold">
              {formatPrice(service.price, service.category)}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-display text-xl font-semibold text-white mb-2 group-hover:text-gradient-gold transition-all duration-200 line-clamp-1">
          {service.title}
        </h3>

        <p className="font-body text-white/50 text-sm leading-relaxed mb-4 line-clamp-2">
          {service.description}
        </p>

        {/* Rating & Capacity */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <svg key={i} className={`w-3.5 h-3.5 ${i <= Math.round(service.rating) ? 'text-gold-400' : 'text-white/20'}`} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className="text-white/40 text-xs font-body">{service.rating} ({service.reviewCount})</span>
          </div>
          <span className="text-white/40 text-xs font-body">👥 Up to {service.capacity}</span>
        </div>

        {/* Features */}
        {service.features?.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {service.features.slice(0, 3).map(f => (
              <span key={f} className="text-xs font-body text-white/40 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                {f}
              </span>
            ))}
            {service.features.length > 3 && (
              <span className="text-xs font-body text-gold-500/70 bg-gold-500/10 px-2 py-0.5 rounded-full border border-gold-500/20">
                +{service.features.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* CTA */}
        <div className="flex gap-2">
          <Link
            to={`/services/${service._id}`}
            className="flex-1 text-center btn-outline-gold text-sm py-2"
          >
            View Details
          </Link>
          <Link
            to={service.isAvailable ? `/book/${service._id}` : '#'}
            className={`flex-1 text-center btn-gold text-sm py-2 ${!service.isAvailable ? 'opacity-50 cursor-not-allowed' : ''}`}
            onClick={e => !service.isAvailable && e.preventDefault()}
          >
            Book Now
          </Link>
        </div>
      </div>
    </div>
  )
}
