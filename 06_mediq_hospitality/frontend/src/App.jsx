import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store';

// Layouts
import CustomerLayout from './components/layout/CustomerLayout';
import AdminLayout    from './components/layout/AdminLayout';

// Auth pages
import LoginPage    from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';

// Customer pages
import Dashboard       from './pages/customer/Dashboard';
import ChatPage        from './pages/customer/ChatPage';
import HospitalsPage   from './pages/customer/HospitalsPage';
import HospitalDetail  from './pages/customer/HospitalDetail';
import CostEstimator   from './pages/customer/CostEstimator';
import ProfilePage     from './pages/customer/ProfilePage';
import SavedPage       from './pages/customer/SavedPage';

// Admin pages
import AdminDashboard  from './pages/admin/AdminDashboard';
import AdminHospitals  from './pages/admin/AdminHospitals';
import AdminUsers      from './pages/admin/AdminUsers';
import AdminProcedures from './pages/admin/AdminProcedures';
import AdminAnalytics  from './pages/admin/AdminAnalytics';

// ── Route guards ──────────────────────────────────────────────────
function RequireAuth({ children }) {
  const { user } = useAuthStore();
  const loc = useLocation();
  if (!user) return <Navigate to="/login" state={{ from: loc }} replace />;
  return children;
}

function RequireAdmin({ children }) {
  const { user, isAdmin } = useAuthStore();
  if (!user) return <Navigate to="/login" replace />;
  if (!isAdmin()) return <Navigate to="/dashboard" replace />;
  return children;
}

function RedirectIfAuth({ children }) {
  const { user, isAdmin } = useAuthStore();
  if (user) return <Navigate to={isAdmin() ? '/admin' : '/dashboard'} replace />;
  return children;
}

export default function App() {
  const { user, refreshMe } = useAuthStore();
  useEffect(() => { if (user) refreshMe(); }, []);

  return (
    <BrowserRouter>
      <Toaster position="top-right" toastOptions={{ style: { background:'#0D2137', color:'#fff', border:'1px solid #1A3A5C', fontSize:'.85rem' }, success:{ iconTheme:{ primary:'#00C6FF', secondary:'#0D2137' } } }} />
      <Routes>
        {/* Auth */}
        <Route path="/login"    element={<RedirectIfAuth><LoginPage /></RedirectIfAuth>} />
        <Route path="/register" element={<RedirectIfAuth><RegisterPage /></RedirectIfAuth>} />

        {/* Customer */}
        <Route path="/" element={<RequireAuth><CustomerLayout /></RequireAuth>}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard"      element={<Dashboard />} />
          <Route path="chat"           element={<ChatPage />} />
          <Route path="hospitals"      element={<HospitalsPage />} />
          <Route path="hospitals/:id"  element={<HospitalDetail />} />
          <Route path="cost"           element={<CostEstimator />} />
          <Route path="saved"          element={<SavedPage />} />
          <Route path="profile"        element={<ProfilePage />} />
        </Route>

        {/* Admin */}
        <Route path="/admin" element={<RequireAdmin><AdminLayout /></RequireAdmin>}>
          <Route index element={<AdminDashboard />} />
          <Route path="hospitals"  element={<AdminHospitals />} />
          <Route path="users"      element={<AdminUsers />} />
          <Route path="procedures" element={<AdminProcedures />} />
          <Route path="analytics"  element={<AdminAnalytics />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}
