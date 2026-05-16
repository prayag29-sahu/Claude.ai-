import React, { useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { MdDashboard, MdLocalHospital, MdPeople, MdMedicalServices, MdBarChart, MdArrowBack, MdMenu, MdClose, MdLogout, MdAdminPanelSettings } from 'react-icons/md';
import { RiBrainLine } from 'react-icons/ri';
import { useAuthStore } from '../../store';

const ADMIN_NAV = [
  { to:'/admin',              icon:MdDashboard,        label:'Dashboard',   exact:true },
  { to:'/admin/hospitals',    icon:MdLocalHospital,    label:'Hospitals' },
  { to:'/admin/users',        icon:MdPeople,           label:'Users' },
  { to:'/admin/procedures',   icon:MdMedicalServices,  label:'Procedures' },
  { to:'/admin/analytics',    icon:MdBarChart,         label:'Analytics' },
];

export default function AdminLayout() {
  const [open, setOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const w = open ? 220 : 62;

  return (
    <div style={{ display:'flex', height:'100vh', background:'#060F1E', overflow:'hidden' }}>
      <aside style={{ width:w, minWidth:w, background:'#070E1B', borderRight:'1px solid #2D1B5C', display:'flex', flexDirection:'column', transition:'width .22s', overflow:'hidden' }}>
        {/* Admin logo */}
        <div style={{ padding:'16px 12px 12px', borderBottom:'1px solid #2D1B5C', display:'flex', alignItems:'center', gap:10 }}>
          <div style={{ width:36, height:36, borderRadius:10, flexShrink:0, background:'linear-gradient(135deg,#4A0080,#7B2FBE)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <MdAdminPanelSettings size={20} color="#E0B0FF" />
          </div>
          {open && <div><div style={{ fontWeight:800, fontSize:'1rem', color:'#E0B0FF' }}>MedIQ Admin</div><div style={{ fontSize:'.58rem', color:'#8E6AAE', marginTop:-1 }}>Control Panel</div></div>}
        </div>

        <nav style={{ flex:1, padding:'10px 8px', display:'flex', flexDirection:'column', gap:2 }}>
          {ADMIN_NAV.map(({ to, icon:Icon, label, exact }) => (
            <NavLink key={to} to={to} end={exact}
              className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
              style={({ isActive }) => ({ justifyContent: open ? 'flex-start' : 'center', '--accent':'#B39DDB', color: isActive ? '#E0B0FF' : '#8E6AAE', background: isActive ? 'rgba(179,157,219,.12)' : 'transparent', borderLeftColor: isActive ? '#B39DDB' : 'transparent' })}
            >
              <Icon size={18} style={{ flexShrink:0 }} />{open && <span>{label}</span>}
            </NavLink>
          ))}
        </nav>

        <div style={{ padding:'10px 8px', borderTop:'1px solid #2D1B5C', display:'flex', flexDirection:'column', gap:6 }}>
          <button onClick={() => navigate('/dashboard')} style={{ width:'100%', background:'transparent', border:'1px solid #2D1B5C', borderRadius:8, padding:'7px 10px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent: open ? 'flex-start' : 'center', gap:8, color:'#8E6AAE', fontSize:'.78rem', fontFamily:'inherit' }}>
            <MdArrowBack size={15} />{open && 'Customer View'}
          </button>
          <div style={{ display:'flex', alignItems:'center', gap:8, padding:'4px 4px' }}>
            <div style={{ width:30, height:30, borderRadius:'50%', flexShrink:0, background:'linear-gradient(135deg,#4A0080,#7B2FBE)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.75rem', fontWeight:700, color:'#E0B0FF' }}>{user?.name?.[0] || 'A'}</div>
            {open && <div style={{ flex:1, overflow:'hidden' }}><div style={{ fontSize:'.78rem', fontWeight:600, color:'#E0B0FF', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>{user?.name}</div><div style={{ fontSize:'.62rem', color:'#8E6AAE', textTransform:'capitalize' }}>{user?.role}</div></div>}
          </div>
          <div style={{ display:'flex', gap:6 }}>
            <button onClick={() => setOpen(!open)} style={{ flex:1, background:'transparent', border:'1px solid #2D1B5C', borderRadius:7, padding:6, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#8E6AAE' }}>
              {open ? <MdClose size={15} /> : <MdMenu size={15} />}
            </button>
            <button onClick={logout} style={{ flex:1, background:'transparent', border:'1px solid #2D1B5C', borderRadius:7, padding:6, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', color:'#8E6AAE' }}>
              <MdLogout size={15} />
            </button>
          </div>
        </div>
      </aside>

      <main style={{ flex:1, overflow:'auto', display:'flex', flexDirection:'column' }} className="scrollable">
        <Outlet />
      </main>
    </div>
  );
}
