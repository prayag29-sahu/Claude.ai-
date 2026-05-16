import { useState, useEffect, useRef } from 'react'
import { servicesAPI } from '../../services/api'
import AdminLayout from '../../components/admin/AdminLayout'
import toast from 'react-hot-toast'

const CATEGORIES = ['Tent', 'DJ', 'Catering', 'Decoration', 'Full Event', 'Photography', 'Other']
const EMPTY_FORM = { title: '', category: 'Tent', price: '', priceUnit: 'per event', description: '', features: '', capacity: '', isAvailable: true, image: '' }

export default function AdminServices() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [imageFile, setImageFile] = useState(null)
  const [imagePreview, setImagePreview] = useState('')
  const [search, setSearch] = useState('')
  const fileRef = useRef()

  const fetchServices = async () => {
    setLoading(true)
    try {
      const { data } = await servicesAPI.getAll({ limit: 50 })
      setServices(data.services || [])
    } catch { toast.error('Failed to load services') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchServices() }, [])

  const openAdd = () => {
    setEditing(null)
    setForm(EMPTY_FORM)
    setImageFile(null)
    setImagePreview('')
    setShowModal(true)
  }

  const openEdit = (service) => {
    setEditing(service._id)
    setForm({
      title: service.title,
      category: service.category,
      price: service.price,
      priceUnit: service.priceUnit || 'per event',
      description: service.description,
      features: service.features?.join(', ') || '',
      capacity: service.capacity,
      isAvailable: service.isAvailable,
      image: service.image,
    })
    setImagePreview(service.image)
    setImageFile(null)
    setShowModal(true)
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImageFile(file)
    setImagePreview(URL.createObjectURL(file))
  }

  const handleSave = async (e) => {
    e.preventDefault()
    if (!form.title || !form.price || !form.description) {
      toast.error('Please fill all required fields')
      return
    }
    setSaving(true)
    try {
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, v))
      if (imageFile) fd.append('image', imageFile)

      if (editing) {
        await servicesAPI.update(editing, fd)
        toast.success('Service updated!')
      } else {
        await servicesAPI.create(fd)
        toast.success('Service created!')
      }
      setShowModal(false)
      fetchServices()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save service')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this service? This cannot be undone.')) return
    try {
      await servicesAPI.delete(id)
      toast.success('Service deleted')
      fetchServices()
    } catch { toast.error('Failed to delete') }
  }

  const filtered = services.filter(s =>
    s.title.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <AdminLayout title="Services Management">
      <div className="space-y-5">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search services..." value={search}
              onChange={e => setSearch(e.target.value)} className="input-luxury pl-10 py-2.5 text-sm" />
          </div>
          <button onClick={openAdd} className="btn-gold text-sm px-5 py-2.5 whitespace-nowrap">
            + Add Service
          </button>
        </div>

        {/* Services Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => <div key={i} className="glass-card h-48 shimmer-bg" />)}
          </div>
        ) : filtered.length === 0 ? (
          <div className="glass-card p-12 text-center">
            <p className="text-4xl mb-3">🎪</p>
            <p className="font-body text-white/50">No services found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
            {filtered.map(service => (
              <div key={service._id} className="glass-card overflow-hidden group hover:border-gold-500/20 transition-all duration-300">
                <div className="relative h-36 overflow-hidden">
                  <img src={service.image} alt={service.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => e.target.src = 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=400'} />
                  <div className="absolute inset-0 bg-gradient-to-t from-regal-950/80 to-transparent" />
                  <div className="absolute top-2 right-2 flex gap-1">
                    <span className={`badge text-xs ${service.isAvailable ? 'badge-green' : 'badge-red'}`}>
                      {service.isAvailable ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-display text-base font-semibold text-white line-clamp-1">{service.title}</h3>
                    <span className="badge-gold text-xs flex-shrink-0">{service.category}</span>
                  </div>
                  <p className="font-body text-white/50 text-xs mb-3 line-clamp-1">{service.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-gradient-gold font-semibold font-body text-sm">
                      ₹{service.price?.toLocaleString('en-IN')}
                      {service.category === 'Catering' ? '/plate' : ''}
                    </span>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(service)}
                        className="text-xs px-3 py-1.5 rounded-lg glass-card hover:border-gold-500/30 text-white/60 hover:text-gold-400 transition-all font-body">
                        ✏️ Edit
                      </button>
                      <button onClick={() => handleDelete(service._id)}
                        className="text-xs px-3 py-1.5 rounded-lg border border-red-500/20 text-red-400 hover:bg-red-500/10 transition-all font-body">
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-regal-950/90 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="glass-card p-6 w-full max-w-2xl my-4 border-gold-500/20">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-display text-xl font-semibold text-white">
                {editing ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-white/40 hover:text-white transition-colors text-xl">✕</button>
            </div>

            <form onSubmit={handleSave} className="space-y-4">
              {/* Image Upload */}
              <div>
                <label className="label-luxury">Service Image</label>
                <div onClick={() => fileRef.current.click()}
                  className="cursor-pointer border-2 border-dashed border-white/20 rounded-xl p-4 text-center hover:border-gold-500/40 transition-all">
                  {imagePreview ? (
                    <img src={imagePreview} alt="" className="h-32 w-full object-cover rounded-lg" />
                  ) : (
                    <div className="py-6">
                      <p className="text-3xl mb-2">📸</p>
                      <p className="font-body text-white/40 text-sm">Click to upload image</p>
                    </div>
                  )}
                </div>
                <input ref={fileRef} type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                <div className="mt-2">
                  <label className="label-luxury text-xs mt-2">Or paste image URL</label>
                  <input type="text" placeholder="https://..." value={form.image}
                    onChange={e => { setForm(p => ({ ...p, image: e.target.value })); setImagePreview(e.target.value) }}
                    className="input-luxury text-sm py-2" />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="label-luxury">Title *</label>
                  <input type="text" placeholder="Service title" value={form.title}
                    onChange={e => setForm(p => ({ ...p, title: e.target.value }))} className="input-luxury" required />
                </div>
                <div>
                  <label className="label-luxury">Category *</label>
                  <select value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))} className="input-luxury">
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="label-luxury">Price (₹) *</label>
                  <input type="number" placeholder="0" value={form.price}
                    onChange={e => setForm(p => ({ ...p, price: e.target.value }))} className="input-luxury" required />
                </div>
                <div>
                  <label className="label-luxury">Price Unit</label>
                  <select value={form.priceUnit} onChange={e => setForm(p => ({ ...p, priceUnit: e.target.value }))} className="input-luxury">
                    {['per event', 'per plate', 'per day', 'per hour'].map(u => <option key={u}>{u}</option>)}
                  </select>
                </div>
                <div>
                  <label className="label-luxury">Capacity</label>
                  <input type="number" placeholder="100" value={form.capacity}
                    onChange={e => setForm(p => ({ ...p, capacity: e.target.value }))} className="input-luxury" />
                </div>
              </div>

              <div>
                <label className="label-luxury">Description *</label>
                <textarea rows={3} placeholder="Describe this service..." value={form.description}
                  onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                  className="input-luxury resize-none" required />
              </div>

              <div>
                <label className="label-luxury">Features (comma-separated)</label>
                <input type="text" placeholder="Feature 1, Feature 2, Feature 3" value={form.features}
                  onChange={e => setForm(p => ({ ...p, features: e.target.value }))} className="input-luxury" />
              </div>

              <div className="flex items-center gap-3">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" checked={form.isAvailable}
                    onChange={e => setForm(p => ({ ...p, isAvailable: e.target.checked }))} className="sr-only peer" />
                  <div className="w-10 h-6 bg-white/20 peer-checked:bg-gold-500 rounded-full transition-all duration-300 after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:w-5 after:h-5 after:rounded-full after:bg-white after:transition-all peer-checked:after:translate-x-4" />
                </label>
                <span className="font-body text-white/70 text-sm">Available for booking</span>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="flex-1 btn-outline-gold text-sm py-2.5">
                  Cancel
                </button>
                <button type="submit" disabled={saving} className="flex-1 btn-gold text-sm py-2.5 flex items-center justify-center gap-2 disabled:opacity-60">
                  {saving ? <div className="w-4 h-4 border-2 border-regal-950 border-t-transparent rounded-full animate-spin" /> : null}
                  {editing ? 'Update Service' : 'Create Service'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  )
}
