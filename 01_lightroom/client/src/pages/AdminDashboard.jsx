import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import api from '../services/api'
import toast from 'react-hot-toast'
import { Users, Image, BookOpen, FileText, TrendingUp, Check, X, LogOut, Upload, BarChart2 } from 'lucide-react'

const TABS = ['Overview','Bookings','Gallery','Blog','Clients']

export default function AdminDashboard() {
  const { logout } = useAuth()
  const navigate = useNavigate()
  const qc = useQueryClient()
  const [tab, setTab] = useState('Overview')

  const { data: bookings = [] } = useQuery({ queryKey: ['adminBookings'], queryFn: () => api.get('/bookings').then(r => r.data.bookings) })
  const { data: clients = [] } = useQuery({ queryKey: ['adminClients'], queryFn: () => api.get('/users').then(r => r.data.users) })

  const updateBooking = useMutation({
    mutationFn: ({ id, status }) => api.patch(`/bookings/${id}/status`, { status }),
    onSuccess: () => { qc.invalidateQueries(['adminBookings']); toast.success('Booking updated!') }
  })

  const stats = [
    { icon: BookOpen, label: 'Total Bookings', val: bookings.length, color: 'text-blue-400' },
    { icon: Check, label: 'Approved', val: bookings.filter(b => b.status === 'approved').length, color: 'text-green-400' },
    { icon: Users, label: 'Clients', val: clients.length, color: 'text-purple-400' },
    { icon: TrendingUp, label: 'Pending', val: bookings.filter(b => b.status === 'pending').length, color: 'text-yellow-400' },
  ]

  const statusColor = { pending: 'bg-yellow-400/10 text-yellow-400', approved: 'bg-green-400/10 text-green-400', rejected: 'bg-red-400/10 text-red-400' }

  return (
    <div className="min-h-screen bg-black">
      <div className="bg-dark border-b border-border px-[5%] py-4 flex justify-between items-center">
        <div className="font-serif text-xl">The <span className="text-gold italic">Lightroom</span> <span className="text-grey-light text-sm font-sans font-light ml-2">Admin</span></div>
        <button onClick={() => { logout(); navigate('/') }} className="flex items-center gap-2 text-grey-light text-xs hover:text-gold uppercase tracking-widest">
          <LogOut size={14} /> Logout
        </button>
      </div>

      <div className="flex min-h-[calc(100vh-61px)]">
        {/* Sidebar */}
        <aside className="w-52 bg-dark border-r border-border py-6 hidden md:block shrink-0">
          {TABS.map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`w-full text-left px-6 py-3 text-xs uppercase tracking-widest transition-colors ${tab === t ? 'text-gold border-r border-gold bg-gold/5' : 'text-grey-light hover:text-gold'}`}>
              {t}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main className="flex-1 p-8 overflow-auto">
          {tab === 'Overview' && (
            <div>
              <h2 className="font-serif text-2xl font-light mb-6">Dashboard <em className="text-gold italic">Overview</em></h2>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map(({ icon: Icon, label, val, color }) => (
                  <div key={label} className="bg-card border border-border p-5">
                    <div className="flex justify-between items-start mb-3">
                      <p className="text-grey text-xs uppercase tracking-wider">{label}</p>
                      <Icon size={16} className={color} />
                    </div>
                    <p className={`font-serif text-4xl font-light ${color}`}>{val}</p>
                  </div>
                ))}
              </div>
              <div className="bg-card border border-border p-6">
                <h3 className="font-serif text-lg font-light mb-4">Recent Bookings</h3>
                {bookings.slice(0, 5).map(b => (
                  <div key={b._id} className="flex justify-between items-center py-3 border-b border-border last:border-0">
                    <div>
                      <p className="text-sm">{b.name || 'Client'}</p>
                      <p className="text-grey text-xs">{b.eventType} · {new Date(b.eventDate).toLocaleDateString()}</p>
                    </div>
                    <span className={`text-[0.65rem] uppercase tracking-wider px-2 py-1 rounded ${statusColor[b.status]}`}>{b.status}</span>
                  </div>
                ))}
                {bookings.length === 0 && <p className="text-grey-light text-sm text-center py-4">No bookings yet</p>}
              </div>
            </div>
          )}

          {tab === 'Bookings' && (
            <div>
              <h2 className="font-serif text-2xl font-light mb-6">Manage <em className="text-gold italic">Bookings</em></h2>
              <div className="space-y-3">
                {bookings.length === 0 && <div className="bg-card border border-border p-8 text-center text-grey-light text-sm">No bookings found</div>}
                {bookings.map(b => (
                  <div key={b._id} className="bg-card border border-border p-5">
                    <div className="flex flex-wrap gap-4 justify-between items-start">
                      <div>
                        <h4 className="text-sm font-medium">{b.name || b.clientId?.name || 'Client'}</h4>
                        <p className="text-grey text-xs mt-1">{b.eventType} · {new Date(b.eventDate).toLocaleDateString()} · {b.location}</p>
                        <p className="text-grey text-xs">{b.email || b.clientId?.email} · {b.phone}</p>
                        {b.message && <p className="text-grey-light text-xs mt-2 max-w-md">{b.message}</p>}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`text-[0.65rem] uppercase tracking-wider px-2 py-1 ${statusColor[b.status]}`}>{b.status}</span>
                        {b.status === 'pending' && (
                          <>
                            <button onClick={() => updateBooking.mutate({ id: b._id, status: 'approved' })}
                              className="w-7 h-7 bg-green-400/10 text-green-400 hover:bg-green-400 hover:text-black flex items-center justify-center transition-all">
                              <Check size={12} />
                            </button>
                            <button onClick={() => updateBooking.mutate({ id: b._id, status: 'rejected' })}
                              className="w-7 h-7 bg-red-400/10 text-red-400 hover:bg-red-400 hover:text-black flex items-center justify-center transition-all">
                              <X size={12} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'Gallery' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl font-light">Manage <em className="text-gold italic">Gallery</em></h2>
                <button className="btn-primary text-xs flex items-center gap-2"><Upload size={12}/> Upload Media</button>
              </div>
              <div className="bg-card border border-dashed border-border p-12 text-center">
                <Upload size={32} className="text-gold/30 mx-auto mb-3" />
                <p className="text-grey-light text-sm">Upload images and videos to create gallery collections</p>
                <p className="text-grey text-xs mt-1">Supported: JPG, PNG, MP4 | Max 50MB each</p>
                <button className="btn-gold-outline text-xs mt-4">Browse Files</button>
              </div>
            </div>
          )}

          {tab === 'Clients' && (
            <div>
              <h2 className="font-serif text-2xl font-light mb-6">Manage <em className="text-gold italic">Clients</em></h2>
              <div className="space-y-3">
                {clients.length === 0 && <div className="bg-card border border-border p-8 text-center text-grey-light text-sm">No clients registered yet</div>}
                {clients.map(c => (
                  <div key={c._id} className="bg-card border border-border p-4 flex justify-between items-center">
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-grey text-xs">{c.email} · {c.phone}</p>
                    </div>
                    <span className="text-[0.65rem] text-gold uppercase tracking-wider border border-gold/20 px-2 py-0.5">{c.role}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {tab === 'Blog' && (
            <div>
              <div className="flex justify-between items-center mb-6">
                <h2 className="font-serif text-2xl font-light">Manage <em className="text-gold italic">Blog</em></h2>
                <button className="btn-primary text-xs">+ New Post</button>
              </div>
              <div className="bg-card border border-border p-8 text-center">
                <p className="text-grey-light text-sm">Blog management interface. Create, edit, and publish posts.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
