import { Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Layout from './components/layout/Layout'
import ProtectedRoute from './components/ProtectedRoute'
import CustomCursor from './components/ui/CustomCursor'
import PageLoader from './components/ui/PageLoader'

// Pages
import Home from './pages/Home'
import Portfolio from './pages/Portfolio'
import Services from './pages/Services'
import ServiceDetail from './pages/ServiceDetail'
import VideoGallery from './pages/VideoGallery'
import Booking from './pages/Booking'
import Pricing from './pages/Pricing'
import Blog from './pages/Blog'
import BlogPost from './pages/BlogPost'
import Contact from './pages/Contact'
import ClientLogin from './pages/ClientLogin'
import ClientDashboard from './pages/ClientDashboard'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import Contract from './pages/Contract'
import NotFound from './pages/NotFound'

export default function App() {
  return (
    <AuthProvider>
      <CustomCursor />
      <PageLoader />
      <Routes>
        {/* Public */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/portfolio" element={<Portfolio />} />
          <Route path="/services" element={<Services />} />
          <Route path="/services/:slug" element={<ServiceDetail />} />
          <Route path="/videos" element={<VideoGallery />} />
          <Route path="/booking" element={<Booking />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contact" element={<Contact />} />
        </Route>

        {/* Auth */}
        <Route path="/client/login" element={<ClientLogin />} />
        <Route path="/admin/login" element={<AdminLogin />} />

        {/* Protected Client */}
        <Route element={<ProtectedRoute role="client" />}>
          <Route path="/client/dashboard" element={<ClientDashboard />} />
          <Route path="/client/contract/:bookingId" element={<Contract />} />
        </Route>

        {/* Protected Admin */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
    </AuthProvider>
  )
}
