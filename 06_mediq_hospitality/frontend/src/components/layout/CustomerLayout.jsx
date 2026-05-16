import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { MdDashboard, MdChat, MdLocalHospital, MdCalculate, MdBookmark, MdPerson, MdMenu, MdClose, MdAdminPanelSettings, MdLogout, MdShield } from 'react-icons/md';
import { RiBrainLine } from 'react-icons/ri';
import { useAuthStore } from '../../store';

const NAV = [
  { to:'/dashboard',  icon:MdDashboard,     label:'Dashboard' },
  { to:'/chat',       icon:MdChat,           label:'AI Assistant' },
  { to:'/hospitals',  icon:MdLocalHospital,  label:'Hospitals' },
  { to:'/cost',       icon:MdCalculate,      label:'Cost Estimator' },
  { to:'/saved',      icon:MdBookmark,       label:'Saved' },
  { to:'/profile',    icon:MdPerson,         label:'Profile' },
];

export default function CustomerLayout() {
  const [open, setOpen] = useState(true);
  const { user, isAdmin, logout } = useAuthStore();
  const navigate = useNavigate();
  const w = open ? 220 : 62;

  return (
    <div style={{ display:'flex', height:'100vh', background:'#060F1E', overflow:'hidden' }}>

      {/* Sidebar */}
      <aside style={{ width:w, minWidth:w, background:'#0A1628', borderRight:'1px solid #1A3A5C', display:'flex', flexDirection:'column', transition:'width .22s', overflow:'hidden' }}>
        {/* Logo */}
        <div style={{ padding:'16px 12px 12px', borderBottom:'1px solid #1A3A5C', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, flexShrink:0, background:'linear-gradient(135deg,#0B3D6B,#0072B1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <RiBrainLine size={20} color="#00C6FF" />
          </div>
          {open && <div><div style={{ fontWeight:800, fontSize:'1.08rem', color:'#00C6FF' }}>MedIQ</div><div style={{ fontSize:'.58rem', color:'#8EAFC2', marginTop:-1 }}>Decision Intelligence</div></div>}
        </div>

        {/* Nav */}
        <nav style={{ flex:1, padding:'10px 8px', display:'flex', flexDirection:'column', gap:2 }}>
          {NAV.map(({ to, icon:Icon, label }) => (
            <NavLink key={to} to={to} className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`} style={{ justifyContent: open ? 'flex-start' : 'center' }}>
              <Icon size={18} style={{ flexShrink:0 }} />{open && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        {/* Bottom */}
        <div style={{ padding:'10px 8px', borderTop:'1px solid #1A3A5C', display:'flex', flexDirection:'column', gap:6 }}>
          {/* Responsible AI badge */}
          {open && (
            <div style={{ display:'flex', alignItems:'center', gap:6, background:'rgba(0,168,150,.1)', border:'1px solid rgba(0,168,150,.3)', borderRadius:8, padding:'5px 10px' }}>
              <MdShield size={13} color="#00A896" /><span style={{ fontSize:'.62rem', color:'#00A896', fontWeight:600 }}>Responsible AI</span>
            </div>
          )}

          {isAdmin() && (
            <button onClick={() => navigate('/admin')} style={{ width:'100%', background:'rgba(0,114,177,.15)', border:'1px solid rgba(0,114,177,.3)', borderRadius:8, padding:'7px 10px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent: open ? 'flex-start' : 'center', gap:8, color:'#00C6FF', fontSize:'.78rem', fontFamily:'inherit' }}>
              <MdAdminPanelSettings size={16} />{open && 'Admin Panel'}
            </button>
          )}

          {/* User row */}
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'4px 4px' }}>
            <div style={{ width:30, height:30, borderRadius:'50%', flexShrink:0, background:'linear-gradient(135deg,#0072B1,#00C6FF)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.75rem', fontWeight:700 }}>{user?.name?.[0] || 'U'}</div>
            {open && <div style={{ flex:1, overflow:'hidden' }}><div style={{ fontSize:'.78rem', fontWeight:600, color:'#C9E7F5', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</div><div style={{ fontSize:'.62rem', color:'#8EAFC2' }}>{user?.profile?.city || 'Customer'}</div></div>}
          </div>

          <div style={{ display:'flex', gap:6 }}>
            <button onClick={() => setOpen(!open)} style={{ flex:1, background:'transparent', border:'1px solid #1A3A5C', borderRadius:7, padding:6, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#8EAFC2' }}>
              {open ? <MdClose size={15} /> : <MdMenu size={15} />}
            </button>
            <button onClick={logout} style={{ flex:1, background:'transparent', border:'1px solid #1A3A5C', borderRadius:7, padding:6, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#8EAFC2' }}>
              <MdLogout size={15} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <main style={{ flex:1, overflow:'auto', display:'flex', flexDirection:'column' }} className="scrollable">
        <Outlet />
      </main>
    </div>
  );
}
