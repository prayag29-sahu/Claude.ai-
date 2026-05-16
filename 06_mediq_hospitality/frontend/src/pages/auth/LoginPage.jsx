// ── Login Page ────────────────────────────────────────────────────
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { MdEmail, MdLock, MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { RiBrainLine } from 'react-icons/ri';
import { useAuthStore } from '../../store';

export function LoginPage() {
  const [form, setForm] = useState({ email:'', password:'' });
  const [showPw, setShowPw] = useState(false);
  const { login, loading } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(form.email, form.password);
    if (result.success) {
      navigate(result.user?.role === 'admin' || result.user?.role === 'superadmin' ? '/admin' : from, { replace: true });
    }
  };

  const fillDemo = (role) => {
    if (role === 'admin')    setForm({ email:'admin@mediq.ai', password:'Admin@MedIQ2026' });
    if (role === 'customer') setForm({ email:'rahul@demo.com', password:'Demo@1234' });
  };

  return (
    <div style={{ minHeight:'100vh', background:'#060F1E', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ position:'fixed', top:'15%', left:'25%', width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(0,114,177,.1) 0%,transparent 70%)', pointerEvents:'none' }} />

      <div style={{ width:'100%', maxWidth:420, position:'relative', zIndex:1 }}>
        {/* Logo */}
        <div style={{ textAlign:'center', marginBottom:32 }}>
          <div style={{ width:60, height:60, borderRadius:18, background:'linear-gradient(135deg,#0B3D6B,#0072B1)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px', border:'1px solid #1A3A5C' }}>
            <RiBrainLine size={30} color="#00C6FF" />
          </div>
          <h1 style={{ margin:0, fontSize:'1.9rem', fontWeight:800, color:'#00C6FF' }}>MedIQ Pro</h1>
          <p style={{ margin:'4px 0 0', color:'#8EAFC2', fontSize:'.82rem' }}>Healthcare Decision Intelligence</p>
        </div>

        <div className="glass-card" style={{ padding:32 }}>
          <h2 style={{ margin:'0 0 22px', fontSize:'1.05rem', fontWeight:600, textAlign:'center', color:'#fff' }}>Sign In to Your Account</h2>

          {/* Demo quick-fill */}
          <div style={{ background:'rgba(0,114,177,.08)', border:'1px solid rgba(0,114,177,.25)', borderRadius:10, padding:'10px 14px', marginBottom:20 }}>
            <p style={{ margin:'0 0 8px', fontSize:'.7rem', color:'#8EAFC2', fontWeight:600 }}>QUICK DEMO LOGIN</p>
            <div style={{ display:'flex', gap:8 }}>
              <button onClick={() => fillDemo('customer')} style={{ flex:1, background:'rgba(0,198,255,.12)', border:'1px solid rgba(0,198,255,.3)', borderRadius:7, padding:'6px 8px', cursor:'pointer', color:'#00C6FF', fontSize:'.72rem', fontWeight:600, fontFamily:'inherit' }}>
                Customer Demo
              </button>
              <button onClick={() => fillDemo('admin')} style={{ flex:1, background:'rgba(179,157,219,.12)', border:'1px solid rgba(179,157,219,.3)', borderRadius:7, padding:'6px 8px', cursor:'pointer', color:'#B39DDB', fontSize:'.72rem', fontWeight:600, fontFamily:'inherit' }}>
                Admin Demo
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom:14 }}>
              <label className="form-label">Email</label>
              <div style={{ position:'relative' }}>
                <MdEmail size={16} color="#8EAFC2" style={{ position:'absolute', left:12, top:12 }} />
                <input className="form-input" style={{ paddingLeft:36 }} type="email" value={form.email}
                  onChange={e => setForm(p => ({ ...p, email:e.target.value }))} placeholder="you@example.com" required />
              </div>
            </div>
            <div style={{ marginBottom:22 }}>
              <label className="form-label">Password</label>
              <div style={{ position:'relative' }}>
                <MdLock size={16} color="#8EAFC2" style={{ position:'absolute', left:12, top:12 }} />
                <input className="form-input" style={{ paddingLeft:36, paddingRight:38 }}
                  type={showPw ? 'text' : 'password'} value={form.password}
                  onChange={e => setForm(p => ({ ...p, password:e.target.value }))} placeholder="Password" required />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position:'absolute', right:10, top:10, background:'none', border:'none', cursor:'pointer', color:'#8EAFC2' }}>
                  {showPw ? <MdVisibilityOff size={17} /> : <MdVisibility size={17} />}
                </button>
              </div>
            </div>
            <button className="btn-primary" type="submit" disabled={loading} style={{ width:'100%', justifyContent:'center', padding:12, fontSize:'.9rem' }}>
              {loading ? 'Signing in…' : 'Sign In'}
            </button>
          </form>

          <p style={{ textAlign:'center', fontSize:'.78rem', color:'#8EAFC2', marginTop:18 }}>
            Don&apos;t have an account?{' '}
            <Link to="/register" style={{ color:'#00C6FF', textDecoration:'none', fontWeight:600 }}>Create one</Link>
          </p>
        </div>

        <p style={{ textAlign:'center', fontSize:'.66rem', color:'#1A3A5C', marginTop:16 }}>
          TenzorX 2026 · Poonawalla Fincorp National AI Hackathon
        </p>
      </div>
    </div>
  );
}

// ── Register Page ─────────────────────────────────────────────────
export function RegisterPage() {
  const [form, setForm] = useState({ name:'', email:'', password:'', phone:'', city:'', age:'' });
  const [showPw, setShowPw] = useState(false);
  const { register, loading } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await register(form);
    if (result.success) navigate('/dashboard', { replace: true });
  };

  const sf = (k) => (e) => setForm(p => ({ ...p, [k]:e.target.value }));

  return (
    <div style={{ minHeight:'100vh', background:'#060F1E', display:'flex', alignItems:'center', justifyContent:'center', padding:20 }}>
      <div style={{ width:'100%', maxWidth:460, zIndex:1 }}>
        <div style={{ textAlign:'center', marginBottom:28 }}>
          <div style={{ width:52, height:52, borderRadius:15, background:'linear-gradient(135deg,#0B3D6B,#0072B1)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 10px' }}>
            <RiBrainLine size={26} color="#00C6FF" />
          </div>
          <h1 style={{ margin:0, fontSize:'1.6rem', fontWeight:800, color:'#00C6FF' }}>Create Account</h1>
          <p style={{ margin:'4px 0 0', color:'#8EAFC2', fontSize:'.8rem' }}>MedIQ Pro – Free for patients</p>
        </div>

        <div className="glass-card" style={{ padding:32 }}>
          <form onSubmit={handleSubmit} style={{ display:'flex', flexDirection:'column', gap:14 }}>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label className="form-label">Full Name *</label>
                <input className="form-input" value={form.name} onChange={sf('name')} placeholder="Rahul Sharma" required />
              </div>
              <div>
                <label className="form-label">Phone</label>
                <input className="form-input" value={form.phone} onChange={sf('phone')} placeholder="+91 98765 43210" />
              </div>
            </div>
            <div>
              <label className="form-label">Email *</label>
              <input className="form-input" type="email" value={form.email} onChange={sf('email')} placeholder="you@example.com" required />
            </div>
            <div>
              <label className="form-label">Password * (min 6 characters)</label>
              <div style={{ position:'relative' }}>
                <input className="form-input" style={{ paddingRight:38 }}
                  type={showPw ? 'text' : 'password'} value={form.password} onChange={sf('password')} placeholder="Create a strong password" required minLength={6} />
                <button type="button" onClick={() => setShowPw(!showPw)} style={{ position:'absolute', right:10, top:10, background:'none', border:'none', cursor:'pointer', color:'#8EAFC2' }}>
                  {showPw ? <MdVisibilityOff size={17} /> : <MdVisibility size={17} />}
                </button>
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              <div>
                <label className="form-label">City</label>
                <input className="form-input" value={form.city} onChange={sf('city')} placeholder="Nagpur" />
              </div>
              <div>
                <label className="form-label">Age</label>
                <input className="form-input" type="number" value={form.age} onChange={sf('age')} placeholder="35" min={1} max={120} />
              </div>
            </div>
            <button className="btn-primary" type="submit" disabled={loading} style={{ width:'100%', justifyContent:'center', padding:12, fontSize:'.9rem', marginTop:6 }}>
              {loading ? 'Creating account…' : 'Create My Account'}
            </button>
          </form>
          <p style={{ textAlign:'center', fontSize:'.78rem', color:'#8EAFC2', marginTop:18 }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color:'#00C6FF', textDecoration:'none', fontWeight:600 }}>Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
