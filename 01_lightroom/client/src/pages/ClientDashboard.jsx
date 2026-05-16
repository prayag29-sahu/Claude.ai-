import { useAuth } from '../context/AuthContext'
import { useQuery } from '@tanstack/react-query'
import api from '../services/api'
import { LogOut, Download, Image, FileText, CreditCard, Clock } from 'lucide-react'
import { Link, useNavigate } from 'react-router-dom'

export default function ClientDashboard() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const { data: bookings = [] } = useQuery({
    queryKey: ['myBookings'],
    queryFn: () => api.get('/bookings/my').then(r => r.data.bookings),
    initialData: []
  })
  const { data: galleries = [] } = useQuery({
    queryKey: ['myGalleries'],
    queryFn: () => api.get('/gallery/my').then(r => r.data.galleries),
    initialData: []
  })

  const statusColor = { pending:'text-yellow-400', approved:'text-green-400', rejected:'text-red-400' }

  return (
    <div className="min-h-screen bg-black pt-20">
      <div className="bg-dark border-b border-border px-[5%] py-5 flex justify-between items-center">
        <div>
          <p className="text-grey text-xs uppercase tracking-widest mb-1">Client Portal</p>
          <h1 className="font-serif text-2xl font-light">Welcome, <em className="text-gold italic">{user?.name}</em></h1>
        </div>
        <button onClick={() => { logout(); navigate('/') }} className="flex items-center gap-2 text-grey-light text-xs hover:text-gold transition-colors uppercase tracking-widest">
          <LogOut size={14} /> Logout
        </button>
      </div>

      <div className="px-[5%] py-10 max-w-6xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {[
            { icon: FileText, label: 'Bookings', val: bookings.length },
            { icon: Image, label: 'Galleries', val: galleries.length },
            { icon: CreditCard, label: 'Invoices', val: 0 },
            { icon: Clock, label: 'Pending', val: bookings.filter(b => b.status === 'pending').length },
          ].map(({ icon: Icon, label, val }) => (
            <div key={label} className="bg-card border border-border p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-grey text-xs uppercase tracking-wider">{label}</span>
                <Icon size={14} className="text-gold" />
              </div>
              <p className="font-serif text-3xl font-light text-gold">{val}</p>
            </div>
          ))}
        </div>

        {/* Bookings */}
        <div className="mb-10">
          <h2 className="font-serif text-xl font-light mb-4">My <em className="text-gold italic">Bookings</em></h2>
          {bookings.length === 0 ? (
            <div className="bg-card border border-border p-8 text-center">
              <p className="text-grey-light text-sm mb-4">No bookings yet</p>
              <Link to="/booking" className="btn-gold-outline text-xs">Book a Session</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {bookings.map(b => (
                <div key={b._id} className="bg-card border border-border p-5 flex justify-between items-center flex-wrap gap-3">
                  <div>
                    <h4 className="text-sm font-medium">{b.eventType}</h4>
                    <p className="text-grey text-xs mt-1">{new Date(b.eventDate).toLocaleDateString()} · {b.location}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className={`text-xs uppercase tracking-widest ${statusColor[b.status] || 'text-grey'}`}>{b.status}</span>
                    {b.status === 'approved' && (
                      <Link to={`/client/contract/${b._id}`} className="text-xs text-gold border border-gold/30 px-3 py-1 hover:bg-gold/10 transition-colors">
                        Sign Contract
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Galleries */}
        <div>
          <h2 className="font-serif text-xl font-light mb-4">My <em className="text-gold italic">Galleries</em></h2>
          {galleries.length === 0 ? (
            <div className="bg-card border border-border p-8 text-center">
              <p className="text-grey-light text-sm">No galleries yet. Your photos will appear here after your event.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {galleries.map(g => (
                <div key={g._id} className="bg-card border border-border overflow-hidden">
                  <div className="aspect-video bg-gradient-to-br from-[#1c1408] to-[#2a1c08] flex items-center justify-center">
                    {g.images?.[0] ? <img src={g.images[0].url} alt={g.title} className="w-full h-full object-cover" /> : <Image size={24} className="text-gold/30" />}
                  </div>
                  <div className="p-4 flex justify-between items-center">
                    <div>
                      <h4 className="text-sm">{g.title}</h4>
                      <p className="text-grey text-xs">{g.images?.length || 0} photos</p>
                    </div>
                    <button className="flex items-center gap-1 text-gold text-xs border border-gold/30 px-3 py-1 hover:bg-gold/10 transition-colors">
                      <Download size={10} /> Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
