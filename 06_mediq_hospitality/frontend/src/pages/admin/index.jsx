// ─────────────────────────────────────────────────────────────────
// ADMIN PAGES — MedIQ Pro
// ─────────────────────────────────────────────────────────────────
import React, { useEffect, useState } from 'react';
import {
  MdDashboard, MdLocalHospital, MdPeople, MdMedicalServices, MdBarChart,
  MdAdd, MdEdit, MdDelete, MdSearch, MdRefresh, MdPerson, MdVerified,
  MdStar, MdLocationOn, MdCheck, MdClose,
} from 'react-icons/md';
import { RiShieldCheckLine } from 'react-icons/ri';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar, LineChart, Line,
} from 'recharts';
import { useAdminStore, useAuthStore } from '../../store';
import API from '../../utils/api';
import toast from 'react-hot-toast';

// Helpers
const Shimmer = ({ h=80, n=3 }) => <div style={{ display:'flex', flexDirection:'column', gap:12 }}>{Array.from({length:n}).map((_,i)=><div key={i} className="shimmer" style={{ height:h }} />)}</div>;
const COLORS = ['#0072B1','#00A896','#FF8C42','#2ECC71','#9B59B6','#E74C3C'];
const fmt = (n) => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : n >= 1000 ? `₹${(n/1000).toFixed(0)}K` : `₹${n||0}`;
const CTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return <div style={{ background:'#0D2137', border:'1px solid #1A3A5C', borderRadius:8, padding:'7px 11px', fontSize:'.75rem' }}><strong style={{ color:'#fff' }}>{label}</strong>{payload.map((p,i)=><div key={i} style={{ color:p.color }}>{p.name}: {p.value}</div>)}</div>;
};

// ─────────────────────────────────────────────────────────────────
// ADMIN DASHBOARD
// ─────────────────────────────────────────────────────────────────
export function AdminDashboard() {
  const { dashboard, fetchDashboard, loading } = useAdminStore();
  useEffect(() => { fetchDashboard(); }, []);

  if (loading && !dashboard) return <div style={{ padding:32 }}><Shimmer n={4} h={90} /></div>;

  const stats = dashboard?.stats || {};
  const topProcs = (dashboard?.topProcedures || []).map(p => ({ name: p._id?.replace(/_/g,' ') || p._id, count: p.count, avgCost: Math.round(p.avgCost || 0) }));
  const growth   = dashboard?.userGrowth || [];
  const cityDist = (dashboard?.cityBreakdown || []).slice(0, 8);
  const tierDist = dashboard?.tierBreakdown || [];

  return (
    <div className="page-enter" style={{ padding:'24px 28px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
        <div style={{ width:42, height:42, borderRadius:11, background:'linear-gradient(135deg,#4A0080,#7B2FBE)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <MdDashboard size={21} color="#E0B0FF" />
        </div>
        <div>
          <h1 style={{ margin:0, fontSize:'1.3rem', fontWeight:700, color:'#E0B0FF' }}>Admin Dashboard</h1>
          <p style={{ margin:0, fontSize:'.75rem', color:'#8E6AAE' }}>Platform control centre · Real-time statistics</p>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {[
          { icon:MdPeople,         label:'Total Customers',  value:stats.totalUsers       || 0, color:'#B39DDB' },
          { icon:MdLocalHospital,  label:'Active Hospitals', value:stats.totalHospitals   || 0, color:'#00C6FF' },
          { icon:MdMedicalServices,label:'Procedures',       value:stats.totalProcedures  || 0, color:'#00A896' },
          { icon:MdBarChart,       label:'Cost Estimates',   value:stats.totalEstimates   || 0, color:'#FFD700' },
        ].map(s => (
          <div key={s.label} style={{ background:'rgba(74,0,128,.1)', border:`1px solid rgba(179,157,219,.2)`, borderRadius:12, padding:18, display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:44, height:44, borderRadius:11, background:`${s.color}18`, border:`1px solid ${s.color}30`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <s.icon size={21} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize:'.7rem', color:'#8E6AAE', fontWeight:500 }}>{s.label}</div>
              <div style={{ fontSize:'1.6rem', fontWeight:800, color:s.color, lineHeight:1 }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:16, marginBottom:16 }}>
        {/* User growth */}
        <div style={{ background:'rgba(74,0,128,.08)', border:'1px solid rgba(179,157,219,.2)', borderRadius:12, padding:16 }}>
          <div style={{ fontSize:'.73rem', fontWeight:700, color:'#8E6AAE', marginBottom:12 }}>USER REGISTRATIONS (LAST 7 DAYS)</div>
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={growth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D1B5C" />
              <XAxis dataKey="_id" tick={{ fontSize:10, fill:'#8E6AAE' }} />
              <YAxis tick={{ fontSize:10, fill:'#8E6AAE' }} allowDecimals={false} />
              <Tooltip content={<CTip />} />
              <Line type="monotone" dataKey="count" stroke="#B39DDB" strokeWidth={2} dot={{ fill:'#B39DDB' }} name="New Users" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top procedures */}
        <div style={{ background:'rgba(74,0,128,.08)', border:'1px solid rgba(179,157,219,.2)', borderRadius:12, padding:16 }}>
          <div style={{ fontSize:'.73rem', fontWeight:700, color:'#8E6AAE', marginBottom:12 }}>TOP ESTIMATED PROCEDURES</div>
          <ResponsiveContainer width="100%" height={180}>
            <BarChart data={topProcs} layout="vertical">
              <XAxis type="number" tick={{ fontSize:9, fill:'#8E6AAE' }} />
              <YAxis type="category" dataKey="name" tick={{ fontSize:9, fill:'#8E6AAE' }} width={80} />
              <Tooltip content={<CTip />} />
              <Bar dataKey="count" fill="#B39DDB" radius={[0,4,4,0]} name="Estimates" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent users + estimates */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
        <div style={{ background:'rgba(74,0,128,.08)', border:'1px solid rgba(179,157,219,.2)', borderRadius:12, padding:16 }}>
          <div style={{ fontSize:'.73rem', fontWeight:700, color:'#8E6AAE', marginBottom:12 }}>RECENT REGISTRATIONS</div>
          {(dashboard?.recentUsers || []).map(u => (
            <div key={u._id} style={{ display:'flex', alignItems:'center', gap:10, padding:'8px 0', borderBottom:'1px solid rgba(45,27,92,.4)' }}>
              <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#4A0080,#7B2FBE)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.72rem', fontWeight:700, color:'#E0B0FF', flexShrink:0 }}>{u.name?.[0]}</div>
              <div style={{ flex:1 }}>
                <div style={{ fontSize:'.8rem', color:'#E0B0FF', fontWeight:600 }}>{u.name}</div>
                <div style={{ fontSize:'.68rem', color:'#8E6AAE' }}>{u.email} · {u.profile?.city || '—'}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ background:'rgba(74,0,128,.08)', border:'1px solid rgba(179,157,219,.2)', borderRadius:12, padding:16 }}>
          <div style={{ fontSize:'.73rem', fontWeight:700, color:'#8E6AAE', marginBottom:12 }}>CITY DISTRIBUTION</div>
          <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
            {cityDist.map((c,i) => (
              <div key={c._id}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:2 }}>
                  <span style={{ fontSize:'.75rem', color:'#E0B0FF' }}>{c._id}</span>
                  <span style={{ fontSize:'.75rem', fontWeight:700, color:COLORS[i%COLORS.length] }}>{c.count}</span>
                </div>
                <div style={{ height:4, background:'rgba(45,27,92,.5)', borderRadius:2, overflow:'hidden' }}>
                  <div style={{ height:'100%', borderRadius:2, width:`${Math.min((c.count / (cityDist[0]?.count||1)) * 100, 100)}%`, background:COLORS[i%COLORS.length] }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ADMIN HOSPITALS
// ─────────────────────────────────────────────────────────────────
export function AdminHospitals() {
  const { createHospital, updateHospital, deleteHospital } = useAdminStore();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editH, setEditH] = useState(null);
  const [form, setForm] = useState({ name:'', city:'', state:'', address:'', type:'private', tier:'mid', phone:[''], accreditations:[], procedures:[], pmjayEmpanelled:false, totalBeds:'', icuBeds:'', rating:4.0, isActive:true });

  const load = async () => {
    setLoading(true);
    const { data } = await API.get('/hospitals', { params: { search, limit:50 } }).catch(() => ({ data:{ hospitals:[] } }));
    setHospitals(data.hospitals || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, [search]);

  const handleSave = async () => {
    const result = editH ? await updateHospital(editH._id, form) : await createHospital(form);
    if (result?.success) { setShowForm(false); setEditH(null); load(); }
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Remove "${name}"?`)) return;
    const r = await deleteHospital(id);
    if (r?.success) load();
  };

  const openEdit = (h) => { setEditH(h); setForm({ ...h, phone: h.phone||[''] }); setShowForm(true); };
  const openNew  = () => { setEditH(null); setForm({ name:'',city:'',state:'',address:'',type:'private',tier:'mid',phone:[''],accreditations:[],procedures:[],pmjayEmpanelled:false,totalBeds:'',icuBeds:'',rating:4.0,isActive:true }); setShowForm(true); };

  const sf  = (k) => (e) => setForm(p => ({ ...p, [k]:e.target.value }));
  const sty = { background:'#0D2137', border:'1px solid #1A3A5C', borderRadius:8, color:'#C9E7F5', padding:'8px 11px', fontSize:'.78rem', width:'100%', boxSizing:'border-box', outline:'none', fontFamily:'inherit' };

  const toggleAccred = (a) => setForm(p => ({ ...p, accreditations: p.accreditations.includes(a) ? p.accreditations.filter(x=>x!==a) : [...p.accreditations, a] }));

  return (
    <div className="page-enter" style={{ padding:'24px 28px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:40, height:40, borderRadius:11, background:'linear-gradient(135deg,#4A0080,#7B2FBE)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <MdLocalHospital size={20} color="#E0B0FF" />
          </div>
          <h1 style={{ margin:0, fontSize:'1.2rem', fontWeight:700, color:'#E0B0FF' }}>Hospitals Management</h1>
        </div>
        <button className="btn-primary" onClick={openNew} style={{ display:'flex', alignItems:'center', gap:7, background:'linear-gradient(135deg,#4A0080,#7B2FBE)' }}>
          <MdAdd size={17} />Add Hospital
        </button>
      </div>

      {/* Search */}
      <div style={{ position:'relative', marginBottom:16 }}>
        <MdSearch size={15} color="#8EAFC2" style={{ position:'absolute', left:12, top:12 }} />
        <input style={{ background:'#0D2137', border:'1px solid #1A3A5C', borderRadius:8, color:'#C9E7F5', padding:'10px 12px 10px 32px', fontSize:'.82rem', width:'100%', boxSizing:'border-box', outline:'none', fontFamily:'inherit' }}
          value={search} onChange={e => setSearch(e.target.value)} placeholder="Search hospitals…" />
      </div>

      {/* Table */}
      {loading ? <Shimmer n={5} h={52} /> : (
        <div style={{ overflowX:'auto' }}>
          <table className="data-table">
            <thead>
              <tr><th>Hospital</th><th>City</th><th>Tier</th><th>Accreditations</th><th>Rating</th><th>Beds</th><th>PM-JAY</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {hospitals.map(h => (
                <tr key={h._id}>
                  <td><div style={{ fontWeight:600, color:'#fff', fontSize:'.82rem' }}>{h.name}</div></td>
                  <td style={{ fontSize:'.78rem' }}>{h.city}</td>
                  <td><span className={`badge badge-${h.tier}`} style={{ textTransform:'capitalize' }}>{h.tier?.replace('_',' ')}</span></td>
                  <td><div style={{ display:'flex', gap:3, flexWrap:'wrap' }}>{h.accreditations?.map(a => <span key={a} style={{ fontSize:'.64rem', background:'rgba(0,168,150,.15)', color:'#00A896', borderRadius:4, padding:'1px 6px' }}>{a}</span>)}</div></td>
                  <td><span style={{ color:'#FFD700', fontSize:'.8rem' }}>⭐ {h.rating}</span></td>
                  <td style={{ fontSize:'.78rem', color:'#8EAFC2' }}>{h.totalBeds || '—'}</td>
                  <td>{h.pmjayEmpanelled ? <MdCheck size={16} color="#2ECC71" /> : <MdClose size={16} color="#E74C3C" />}</td>
                  <td><span className={h.isActive ? 'pill-active' : 'pill-inactive'}>{h.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={() => openEdit(h)} style={{ background:'transparent', border:'none', cursor:'pointer', color:'#00C6FF', padding:3 }}><MdEdit size={16} /></button>
                      <button onClick={() => handleDelete(h._id, h.name)} style={{ background:'transparent', border:'none', cursor:'pointer', color:'#E74C3C', padding:3 }}><MdDelete size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {hospitals.length === 0 && <div style={{ textAlign:'center', padding:'40px', color:'#8EAFC2' }}>No hospitals found</div>}
        </div>
      )}

      {/* Form modal */}
      {showForm && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.7)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:1000, padding:20 }}>
          <div style={{ background:'#0D2137', border:'1px solid #1A3A5C', borderRadius:14, padding:28, width:'100%', maxWidth:600, maxHeight:'90vh', overflow:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20 }}>
              <h2 style={{ margin:0, fontSize:'1rem', fontWeight:700, color:'#fff' }}>{editH ? 'Edit Hospital' : 'Add Hospital'}</h2>
              <button onClick={() => setShowForm(false)} style={{ background:'transparent', border:'none', cursor:'pointer', color:'#8EAFC2' }}><MdClose size={20} /></button>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:12 }}>
              {[{k:'name',l:'Hospital Name *'},{k:'city',l:'City *'},{k:'state',l:'State *'},{k:'pincode',l:'Pincode'}].map(({k,l}) => (
                <div key={k}><label className="form-label">{l}</label><input style={sty} value={form[k]||''} onChange={sf(k)} placeholder={l} /></div>
              ))}
              <div style={{ gridColumn:'1/-1' }}><label className="form-label">Address</label><input style={sty} value={form.address||''} onChange={sf('address')} placeholder="Full address" /></div>
              <div><label className="form-label">Type</label>
                <select style={sty} value={form.type} onChange={sf('type')}>
                  {['public','private','trust','clinic'].map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div><label className="form-label">Tier</label>
                <select style={sty} value={form.tier} onChange={sf('tier')}>
                  {['government','budget','mid','premium','super_premium'].map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div><label className="form-label">Total Beds</label><input style={sty} type="number" value={form.totalBeds||''} onChange={sf('totalBeds')} /></div>
              <div><label className="form-label">ICU Beds</label><input style={sty} type="number" value={form.icuBeds||''} onChange={sf('icuBeds')} /></div>
              <div><label className="form-label">Rating (0-5)</label><input style={sty} type="number" step=".1" min="0" max="5" value={form.rating||4} onChange={sf('rating')} /></div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <input type="checkbox" id="pmjay" checked={!!form.pmjayEmpanelled} onChange={e => setForm(p => ({ ...p, pmjayEmpanelled:e.target.checked }))} />
                <label htmlFor="pmjay" style={{ fontSize:'.78rem', color:'#C9E7F5', cursor:'pointer' }}>PM-JAY Empanelled</label>
              </div>
              <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                <input type="checkbox" id="active" checked={!!form.isActive} onChange={e => setForm(p => ({ ...p, isActive:e.target.checked }))} />
                <label htmlFor="active" style={{ fontSize:'.78rem', color:'#C9E7F5', cursor:'pointer' }}>Active</label>
              </div>
            </div>
            <div style={{ marginTop:14 }}>
              <label className="form-label">Accreditations</label>
              <div style={{ display:'flex', gap:7, flexWrap:'wrap' }}>
                {['NABH','JCI','NABL','PMJAY','CGHS','ISO'].map(a => {
                  const active = form.accreditations?.includes(a);
                  return <button key={a} onClick={() => toggleAccred(a)} style={{ padding:'3px 10px', borderRadius:6, border:`1px solid ${active?'#2ECC71':'#1A3A5C'}`, background:active?'rgba(46,204,113,.15)':'transparent', color:active?'#2ECC71':'#8EAFC2', cursor:'pointer', fontSize:'.72rem', fontFamily:'inherit' }}>{a}</button>;
                })}
              </div>
            </div>
            <div style={{ display:'flex', gap:10, marginTop:22 }}>
              <button className="btn-primary" onClick={handleSave} style={{ flex:1, justifyContent:'center', background:'linear-gradient(135deg,#4A0080,#7B2FBE)' }}>
                <MdCheck size={15} style={{ marginRight:6 }} />{editH ? 'Save Changes' : 'Create Hospital'}
              </button>
              <button className="btn-outline" onClick={() => setShowForm(false)} style={{ padding:'10px 20px' }}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ADMIN USERS
// ─────────────────────────────────────────────────────────────────
export function AdminUsers() {
  const { users, loading, fetchUsers, updateUser } = useAdminStore();
  const [search, setSearch]     = useState('');
  const [roleFilter, setRole]   = useState('');
  const [activeFilter, setActive] = useState('');
  const { user:me } = useAuthStore();

  useEffect(() => { fetchUsers({ search, role:roleFilter, isActive:activeFilter }); }, [search, roleFilter, activeFilter]);

  const toggle = async (u) => {
    if (u._id === me?._id) return toast.error('Cannot change your own status');
    await updateUser(u._id, { isActive: !u.isActive });
    fetchUsers({ search, role:roleFilter });
  };

  const sel = { background:'#0D2137', border:'1px solid #1A3A5C', borderRadius:8, color:'#C9E7F5', padding:'8px 11px', fontSize:'.78rem', cursor:'pointer', outline:'none', fontFamily:'inherit' };

  return (
    <div className="page-enter" style={{ padding:'24px 28px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:22 }}>
        <div style={{ width:40, height:40, borderRadius:11, background:'linear-gradient(135deg,#4A0080,#7B2FBE)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <MdPeople size={20} color="#E0B0FF" />
        </div>
        <h1 style={{ margin:0, fontSize:'1.2rem', fontWeight:700, color:'#E0B0FF' }}>User Management</h1>
      </div>

      {/* Filters */}
      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr auto', gap:10, marginBottom:16 }}>
        <div style={{ position:'relative' }}>
          <MdSearch size={14} color="#8EAFC2" style={{ position:'absolute', left:11, top:11 }} />
          <input style={{ ...sel, paddingLeft:30, width:'100%', boxSizing:'border-box' }} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…" />
        </div>
        <select style={sel} value={roleFilter} onChange={e => setRole(e.target.value)}>
          <option value="">All Roles</option><option value="customer">Customer</option><option value="admin">Admin</option>
        </select>
        <select style={sel} value={activeFilter} onChange={e => setActive(e.target.value)}>
          <option value="">All Status</option><option value="true">Active</option><option value="false">Inactive</option>
        </select>
        <button className="btn-outline" onClick={() => { setSearch(''); setRole(''); setActive(''); }} style={{ display:'flex', alignItems:'center', gap:5 }}>
          <MdRefresh size={14} />Reset
        </button>
      </div>

      {loading ? <Shimmer n={5} h={52} /> : (
        <div style={{ overflowX:'auto' }}>
          <table className="data-table">
            <thead>
              <tr><th>User</th><th>Email</th><th>Role</th><th>City</th><th>Last Login</th><th>Logins</th><th>Status</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u._id}>
                  <td>
                    <div style={{ display:'flex', alignItems:'center', gap:9 }}>
                      <div style={{ width:28, height:28, borderRadius:'50%', background:'linear-gradient(135deg,#4A0080,#7B2FBE)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.72rem', fontWeight:700, color:'#E0B0FF', flexShrink:0 }}>{u.name?.[0]}</div>
                      <span style={{ fontWeight:600, color:'#fff', fontSize:'.82rem' }}>{u.name}</span>
                    </div>
                  </td>
                  <td style={{ fontSize:'.78rem' }}>{u.email}</td>
                  <td><span className={u.role === 'admin' ? 'pill-active' : 'badge badge-mid'} style={{ textTransform:'capitalize' }}>{u.role}</span></td>
                  <td style={{ fontSize:'.78rem', color:'#8EAFC2' }}>{u.profile?.city || '—'}</td>
                  <td style={{ fontSize:'.73rem', color:'#8EAFC2' }}>{u.lastLogin ? new Date(u.lastLogin).toLocaleDateString('en-IN') : 'Never'}</td>
                  <td style={{ fontSize:'.8rem', color:'#8EAFC2' }}>{u.loginCount || 0}</td>
                  <td><span className={u.isActive ? 'pill-active' : 'pill-inactive'}>{u.isActive ? 'Active' : 'Inactive'}</span></td>
                  <td>
                    {u._id !== me?._id && (
                      <button onClick={() => toggle(u)} className={u.isActive ? 'btn-danger' : 'btn-outline'} style={{ padding:'3px 10px', fontSize:'.7rem' }}>
                        {u.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {users.length === 0 && <div style={{ textAlign:'center', padding:'40px', color:'#8EAFC2' }}>No users found</div>}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ADMIN PROCEDURES
// ─────────────────────────────────────────────────────────────────
export function AdminProcedures() {
  const [procedures, setProcedures] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const { data } = await API.get('/procedures').catch(() => ({ data:{ procedures:[] } }));
    setProcedures(data.procedures || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="page-enter" style={{ padding:'24px 28px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:22 }}>
        <div style={{ width:40, height:40, borderRadius:11, background:'linear-gradient(135deg,#4A0080,#7B2FBE)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <MdMedicalServices size={20} color="#E0B0FF" />
        </div>
        <div>
          <h1 style={{ margin:0, fontSize:'1.2rem', fontWeight:700, color:'#E0B0FF' }}>Procedures & HBP Data</h1>
          <p style={{ margin:0, fontSize:'.73rem', color:'#8E6AAE' }}>PM-JAY Health Benefit Package 2.2 · ICD-10 · SNOMED CT</p>
        </div>
      </div>

      {loading ? <Shimmer n={5} h={50} /> : (
        <div style={{ overflowX:'auto' }}>
          <table className="data-table">
            <thead>
              <tr><th>Procedure</th><th>ICD-10</th><th>PM-JAY Code</th><th>Category</th><th>Govt Rate</th><th>Private Rate</th><th>Status</th></tr>
            </thead>
            <tbody>
              {procedures.map(p => (
                <tr key={p._id}>
                  <td>
                    <div style={{ fontWeight:600, color:'#fff', fontSize:'.82rem' }}>{p.name}</div>
                    {p.nameHindi && <div style={{ fontSize:'.68rem', color:'#8EAFC2' }}>{p.nameHindi}</div>}
                  </td>
                  <td><span style={{ fontFamily:'monospace', fontSize:'.73rem', color:'#4FC3F7', background:'rgba(79,195,247,.1)', borderRadius:4, padding:'1px 6px' }}>{p.icd10}</span></td>
                  <td><span style={{ fontFamily:'monospace', fontSize:'.73rem', color:'#2ECC71', background:'rgba(46,204,113,.1)', borderRadius:4, padding:'1px 6px' }}>{p.pmjayCode || '—'}</span></td>
                  <td><span style={{ fontSize:'.73rem', background:'rgba(0,168,150,.12)', color:'#00A896', borderRadius:4, padding:'2px 8px' }}>{p.category}</span></td>
                  <td style={{ fontSize:'.78rem', color:'#00A896', fontWeight:600 }}>{p.pmjayBaseRate ? `₹${(p.pmjayBaseRate/1000).toFixed(0)}K` : '—'}</td>
                  <td style={{ fontSize:'.78rem', color:'#FFD700', fontWeight:600 }}>{p.pmjayPrivateRate ? `₹${(p.pmjayPrivateRate/1000).toFixed(0)}K` : '—'}</td>
                  <td><span className={p.isActive ? 'pill-active' : 'pill-inactive'}>{p.isActive ? 'Active' : 'Off'}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// ADMIN ANALYTICS
// ─────────────────────────────────────────────────────────────────
export function AdminAnalytics() {
  const { analytics, fetchAnalytics } = useAdminStore();
  useEffect(() => { fetchAnalytics(); }, []);

  if (!analytics) return <div style={{ padding:32 }}><Shimmer n={3} h={120} /></div>;

  const cityData = (analytics.cityDistribution || []).slice(0,10).map(c => ({ city:c._id, hospitals:c.count, avgRating:+c.avgRating?.toFixed(1)||4.0, pmjay:c.pmjayCount||0 }));
  const tierData = (analytics.hospitalStats || []).map(t => ({ tier:t._id?.replace('_',' '), count:t.count }));
  const procData = (analytics.procedureStats || []).map(p => ({ name: p.name?.substring(0,18)||p.key, govt: Math.round((p.pmjayBaseRate||0)/1000), private: Math.round((p.pmjayPrivateRate||0)/1000) }));
  const q        = analytics.quality || {};

  const scoreData = [
    { subject:'Clinical',     A:90 }, { subject:'Reputation', A:86 },
    { subject:'Accessibility',A:76 }, { subject:'Affordability',A:72 },
    { subject:'Resp. AI',     A:96 },
  ];

  return (
    <div className="page-enter" style={{ padding:'24px 28px' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:22 }}>
        <div style={{ width:40, height:40, borderRadius:11, background:'linear-gradient(135deg,#4A0080,#7B2FBE)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <MdBarChart size={20} color="#E0B0FF" />
        </div>
        <div>
          <h1 style={{ margin:0, fontSize:'1.2rem', fontWeight:700, color:'#E0B0FF' }}>Analytics & Intelligence</h1>
          <p style={{ margin:0, fontSize:'.73rem', color:'#8E6AAE' }}>PM-JAY · NABH · CGHS pricing data analysis</p>
        </div>
      </div>

      {/* Quality badges */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:12, marginBottom:20 }}>
        {[{ label:'NABH Certified', value:q.nabh||0, color:'#00A896' }, { label:'JCI Certified', value:q.jci||0, color:'#FFD700' }, { label:'PM-JAY Empanelled', value:q.pmjay||0, color:'#2ECC71' }, { label:'Non-Accredited', value:q.nonNabh||0, color:'#8EAFC2' }].map(b => (
          <div key={b.label} style={{ background:'rgba(74,0,128,.08)', border:`1px solid ${b.color}30`, borderRadius:11, padding:'14px 18px', textAlign:'center' }}>
            <div style={{ fontSize:'1.8rem', fontWeight:800, color:b.color }}>{b.value}</div>
            <div style={{ fontSize:'.7rem', color:'#8E6AAE', marginTop:2 }}>{b.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr', gap:16, marginBottom:16 }}>
        {/* City distribution */}
        <div style={{ background:'rgba(74,0,128,.08)', border:'1px solid rgba(179,157,219,.2)', borderRadius:12, padding:16 }}>
          <div style={{ fontSize:'.73rem', fontWeight:700, color:'#8E6AAE', marginBottom:12 }}>HOSPITALS BY CITY</div>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={cityData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2D1B5C" vertical={false} />
              <XAxis dataKey="city" tick={{ fontSize:9, fill:'#8E6AAE' }} />
              <YAxis tick={{ fontSize:9, fill:'#8E6AAE' }} />
              <Tooltip content={<CTip />} />
              <Bar dataKey="hospitals" fill="#B39DDB" radius={[4,4,0,0]} name="Hospitals">
                {cityData.map((_,i) => <Cell key={i} fill={COLORS[i%COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Radar */}
        <div style={{ background:'rgba(74,0,128,.08)', border:'1px solid rgba(179,157,219,.2)', borderRadius:12, padding:16 }}>
          <div style={{ fontSize:'.73rem', fontWeight:700, color:'#8E6AAE', marginBottom:12 }}>PLATFORM CAPABILITY</div>
          <ResponsiveContainer width="100%" height={220}>
            <RadarChart data={scoreData}>
              <PolarGrid stroke="#2D1B5C" />
              <PolarAngleAxis dataKey="subject" tick={{ fontSize:9, fill:'#8E6AAE' }} />
              <Radar name="Score" dataKey="A" stroke="#B39DDB" fill="#B39DDB" fillOpacity={0.2} strokeWidth={2} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PM-JAY rate comparison */}
      <div style={{ background:'rgba(74,0,128,.08)', border:'1px solid rgba(179,157,219,.2)', borderRadius:12, padding:16 }}>
        <div style={{ fontSize:'.73rem', fontWeight:700, color:'#8E6AAE', marginBottom:12 }}>PM-JAY GOVT vs PRIVATE RATES (₹K per procedure)</div>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={procData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#2D1B5C" vertical={false} />
            <XAxis dataKey="name" tick={{ fontSize:8, fill:'#8E6AAE' }} />
            <YAxis tick={{ fontSize:9, fill:'#8E6AAE' }} />
            <Tooltip content={<CTip />} />
            <Bar dataKey="govt"    fill="#2ECC71" name="Govt Rate (₹K)"    radius={[4,4,0,0]} />
            <Bar dataKey="private" fill="#FFD700" name="Private Rate (₹K)" radius={[4,4,0,0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

export default AdminDashboard;
