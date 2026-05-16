import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function ProtectedRoute({ role }) {
  const { user, loading } = useAuth()

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-10 h-10 border border-gold border-t-transparent rounded-full animate-spin" />
    </div>
  )

  if (!user) return <Navigate to={role === 'admin' ? '/admin/login' : '/client/login'} replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return <Outlet />
}
