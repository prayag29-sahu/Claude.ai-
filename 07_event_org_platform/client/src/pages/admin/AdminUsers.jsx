import { useState, useEffect } from 'react'
import { usersAPI } from '../../services/api'
import AdminLayout from '../../components/admin/AdminLayout'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function AdminUsers() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [total, setTotal] = useState(0)

  const fetchUsers = async (q = '') => {
    setLoading(true)
    try {
      const { data } = await usersAPI.getAll(q ? { search: q } : {})
      setUsers(data.users || [])
      setTotal(data.total || 0)
    } catch { toast.error('Failed to load users') }
    finally { setLoading(false) }
  }

  useEffect(() => { fetchUsers() }, [])

  useEffect(() => {
    const t = setTimeout(() => fetchUsers(search), 400)
    return () => clearTimeout(t)
  }, [search])

  const handleToggle = async (userId, currentStatus) => {
    try {
      await usersAPI.toggleStatus(userId)
      toast.success(`User ${currentStatus ? 'deactivated' : 'activated'}`)
      fetchUsers(search)
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update user')
    }
  }

  return (
    <AdminLayout title="Users Management">
      <div className="space-y-5">
        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
          <div className="relative max-w-md w-full">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input type="text" placeholder="Search by name or email..." value={search}
              onChange={e => setSearch(e.target.value)} className="input-luxury pl-10 py-2.5 text-sm" />
          </div>
          <p className="font-body text-white/40 text-sm whitespace-nowrap">{total} total users</p>
        </div>

        {/* Table */}
        <div className="glass-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-white/10">
                  {['User', 'Email', 'Phone', 'Role', 'Joined', 'Status', 'Actions'].map(h => (
                    <th key={h} className="text-left py-4 px-4 font-body text-white/40 text-xs uppercase tracking-wider">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {loading ? (
                  [...Array(8)].map((_, i) => (
                    <tr key={i}><td colSpan={7} className="py-3 px-4"><div className="h-8 shimmer-bg rounded" /></td></tr>
                  ))
                ) : users.length === 0 ? (
                  <tr><td colSpan={7} className="py-12 text-center font-body text-white/30">No users found</td></tr>
                ) : (
                  users.map(user => (
                    <tr key={user._id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-full bg-gold-gradient flex items-center justify-center flex-shrink-0">
                            <span className="text-regal-950 font-bold text-sm">{user.name?.[0]?.toUpperCase()}</span>
                          </div>
                          <p className="font-body text-white text-sm font-medium">{user.name}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-body text-white/60 text-sm">{user.email}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-body text-white/50 text-sm">{user.phone || '—'}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`badge text-xs ${user.role === 'admin' ? 'badge-gold' : 'badge-blue'}`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <p className="font-body text-white/40 text-sm">
                          {user.createdAt ? format(new Date(user.createdAt), 'dd MMM yyyy') : '—'}
                        </p>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`badge text-xs ${user.isActive ? 'badge-green' : 'badge-red'}`}>
                          {user.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {user.role !== 'admin' && (
                          <button
                            onClick={() => handleToggle(user._id, user.isActive)}
                            className={`text-xs px-3 py-1.5 rounded-lg border font-body transition-all ${
                              user.isActive
                                ? 'border-red-500/30 text-red-400 hover:bg-red-500/10'
                                : 'border-green-500/30 text-green-400 hover:bg-green-500/10'
                            }`}>
                            {user.isActive ? 'Deactivate' : 'Activate'}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  )
}
