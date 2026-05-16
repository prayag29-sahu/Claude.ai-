import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'

// Pages
import HomePage from './pages/HomePage'
import ServicesPage from './pages/ServicesPage'
import ServiceDetailPage from './pages/ServiceDetailPage'
import BookingPage from './pages/BookingPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import UserDashboard from './pages/UserDashboard'
import BookingDetailPage from './pages/BookingDetailPage'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminServices from './pages/admin/AdminServices'
import AdminBookings from './pages/admin/AdminBookings'
import AdminUsers from './pages/admin/AdminUsers'

// Components
import Navbar from './components/common/Navbar'
import Footer from './components/common/Footer'
import LoadingScreen from './components/common/LoadingScreen'

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <LoadingScreen />
  return isAuthenticated ? children : <Navigate to="/login" replace />
}

const AdminRoute = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  if (loading) return <LoadingScreen />
  if (!isAuthenticated) return <Navigate to="/login" replace />
  if (!isAdmin) return <Navigate to="/" replace />
  return children
}

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth()
  if (loading) return <LoadingScreen />
  return !isAuthenticated ? children : <Navigate to="/" replace />
}

const AppLayout = ({ children, showFooter = true }) => (
  <div className="min-h-screen flex flex-col">
    <Navbar />
    <main className="flex-1">{children}</main>
    {showFooter && <Footer />}
  </div>
)

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<AppLayout><HomePage /></AppLayout>} />
      <Route path="/services" element={<AppLayout><ServicesPage /></AppLayout>} />
      <Route path="/services/:id" element={<AppLayout><ServiceDetailPage /></AppLayout>} />

      {/* Auth */}
      <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><RegisterPage /></PublicRoute>} />

      {/* Protected User */}
      <Route path="/book/:serviceId" element={<PrivateRoute><AppLayout><BookingPage /></AppLayout></PrivateRoute>} />
      <Route path="/dashboard" element={<PrivateRoute><AppLayout><UserDashboard /></AppLayout></PrivateRoute>} />
      <Route path="/bookings/:id" element={<PrivateRoute><AppLayout><BookingDetailPage /></AppLayout></PrivateRoute>} />

      {/* Admin */}
      <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
      <Route path="/admin/services" element={<AdminRoute><AdminServices /></AdminRoute>} />
      <Route path="/admin/bookings" element={<AdminRoute><AdminBookings /></AdminRoute>} />
      <Route path="/admin/users" element={<AdminRoute><AdminUsers /></AdminRoute>} />

      {/* 404 */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppRoutes />
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: 'rgba(30, 10, 60, 0.95)',
              color: '#f5f3ff',
              border: '1px solid rgba(245, 158, 11, 0.3)',
              backdropFilter: 'blur(10px)',
              fontFamily: '"DM Sans", sans-serif',
            },
            success: { iconTheme: { primary: '#f59e0b', secondary: '#0f0520' } },
            error: { iconTheme: { primary: '#ef4444', secondary: '#0f0520' } },
          }}
        />
      </AuthProvider>
    </BrowserRouter>
  )
}
