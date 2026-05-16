import { useState, useEffect, useCallback } from 'react'
import { useSearchParams } from 'react-router-dom'
import { servicesAPI } from '../services/api'
import ServiceCard from '../components/common/ServiceCard'

const CATEGORIES = ['All', 'Tent', 'DJ', 'Catering', 'Decoration', 'Full Event', 'Photography', 'Other']
const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest First' },
  { value: '-rating', label: 'Top Rated' },
  { value: 'price', label: 'Price: Low to High' },
  { value: '-price', label: 'Price: High to Low' },
]

export default function ServicesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [services, setServices] = useState([])
  const [total, setTotal] = useState(0)
  const [pages, setPages] = useState(1)
  const [loading, setLoading] = useState(true)

  const [filters, setFilters] = useState({
    category: searchParams.get('category') || 'All',
    search: searchParams.get('search') || '',
    sort: '-createdAt',
    page: 1,
    minPrice: '',
    maxPrice: '',
  })

  const fetchServices = useCallback(async () => {
    setLoading(true)
    try {
      const params = { limit: 9, ...filters }
      if (filters.category === 'All') delete params.category
      if (!filters.search) delete params.search
      if (!filters.minPrice) delete params.minPrice
      if (!filters.maxPrice) delete params.maxPrice

      const { data } = await servicesAPI.getAll(params)
      setServices(data.services || [])
      setTotal(data.total || 0)
      setPages(data.pages || 1)
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [filters])

  useEffect(() => { fetchServices() }, [fetchServices])

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }))
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Page Header */}
      <div className="relative py-16 bg-regal-900/30 border-b border-white/5 mb-10">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-gold-500/5 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-regal-600/10 blur-3xl" />
        </div>
        <div className="relative page-container text-center">
          <span className="font-accent text-gold-400 text-xs tracking-widest uppercase">Our Offerings</span>
          <h1 className="section-title mt-2">Event Services</h1>
          <p className="section-subtitle mx-auto mt-3">
            Discover our complete range of premium event services
          </p>
        </div>
      </div>

      <div className="page-container">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative max-w-2xl mx-auto">
            <svg className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={filters.search}
              onChange={e => updateFilter('search', e.target.value)}
              placeholder="Search services — DJ, catering, decoration..."
              className="input-luxury pl-12 text-base"
            />
          </div>
        </div>

        {/* Filters Row */}
        <div className="flex flex-col lg:flex-row gap-4 mb-8">
          {/* Categories */}
          <div className="flex flex-wrap gap-2 flex-1">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => updateFilter('category', cat)}
                className={`px-4 py-2 rounded-full font-body text-sm font-medium transition-all duration-200 ${
                  filters.category === cat
                    ? 'bg-gold-gradient text-regal-950 shadow-gold'
                    : 'glass-card text-white/60 hover:text-white hover:border-gold-500/30'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort & Price */}
          <div className="flex gap-3">
            <select
              value={filters.sort}
              onChange={e => updateFilter('sort', e.target.value)}
              className="input-luxury py-2 text-sm min-w-[160px]"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Price Range */}
        <div className="flex gap-3 mb-8">
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">₹</span>
            <input
              type="number"
              value={filters.minPrice}
              onChange={e => updateFilter('minPrice', e.target.value)}
              placeholder="Min Price"
              className="input-luxury pl-8 py-2 text-sm w-36"
            />
          </div>
          <div className="relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">₹</span>
            <input
              type="number"
              value={filters.maxPrice}
              onChange={e => updateFilter('maxPrice', e.target.value)}
              placeholder="Max Price"
              className="input-luxury pl-8 py-2 text-sm w-36"
            />
          </div>
          {(filters.minPrice || filters.maxPrice) && (
            <button
              onClick={() => setFilters(prev => ({ ...prev, minPrice: '', maxPrice: '', page: 1 }))}
              className="text-red-400 text-sm hover:text-red-300 font-body"
            >
              Clear
            </button>
          )}
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="font-body text-white/40 text-sm">
            {loading ? 'Loading...' : `${total} service${total !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(9)].map((_, i) => (
              <div key={i} className="card-luxury overflow-hidden">
                <div className="aspect-[4/3] shimmer-bg" />
                <div className="p-5 space-y-3">
                  <div className="h-6 shimmer-bg rounded-lg w-3/4" />
                  <div className="h-4 shimmer-bg rounded-lg" />
                  <div className="h-4 shimmer-bg rounded-lg w-5/6" />
                  <div className="h-10 shimmer-bg rounded-lg mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : services.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🎪</div>
            <h3 className="font-display text-2xl text-white mb-2">No services found</h3>
            <p className="font-body text-white/40 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => setFilters({ category: 'All', search: '', sort: '-createdAt', page: 1, minPrice: '', maxPrice: '' })}
              className="btn-outline-gold text-sm"
            >
              Clear All Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map(service => (
              <ServiceCard key={service._id} service={service} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex justify-center gap-2 mt-10">
            <button
              disabled={filters.page === 1}
              onClick={() => updateFilter('page', filters.page - 1)}
              className="w-10 h-10 glass-card rounded-xl flex items-center justify-center disabled:opacity-30 hover:border-gold-500/30 transition-all"
            >
              <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            {[...Array(pages)].map((_, i) => (
              <button
                key={i}
                onClick={() => updateFilter('page', i + 1)}
                className={`w-10 h-10 rounded-xl font-body text-sm transition-all ${
                  filters.page === i + 1
                    ? 'bg-gold-gradient text-regal-950 font-semibold shadow-gold'
                    : 'glass-card text-white/60 hover:border-gold-500/30'
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              disabled={filters.page === pages}
              onClick={() => updateFilter('page', filters.page + 1)}
              className="w-10 h-10 glass-card rounded-xl flex items-center justify-center disabled:opacity-30 hover:border-gold-500/30 transition-all"
            >
              <svg className="w-4 h-4 text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
