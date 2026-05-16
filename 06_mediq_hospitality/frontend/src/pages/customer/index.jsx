// ─────────────────────────────────────────────────────────────────
// CUSTOMER PAGES — MedIQ Pro
// ─────────────────────────────────────────────────────────────────
import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  MdDashboard, MdChat, MdLocalHospital, MdCalculate, MdBookmark,
  MdPerson, MdStar, MdLocationOn, MdBed, MdVerified, MdAttachMoney,
  MdArrowForward, MdSend, MdDeleteOutline, MdSearch, MdFilterList,
  MdRefresh, MdAutoAwesome, MdWarningAmber, MdArrowBack, MdPhone,
  MdPeople, MdMedicalServices, MdInfoOutline, MdTrendingUp,
} from 'react-icons/md';
import { RiBrainLine, RiShieldCheckLine, RiRouteLine } from 'react-icons/ri';
import { FiMapPin, FiDollarSign, FiGlobe, FiAward } from 'react-icons/fi';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts';
import ReactMarkdown from 'react-markdown';
import { useAuthStore, useChatStore, useHospitalStore, useCostStore } from '../../store';
import API from '../../utils/api';
import toast from 'react-hot-toast';

// ── Helpers ───────────────────────────────────────────────────────
const C = ['#0072B1','#00A896','#FF8C42','#2ECC71','#9B59B6','#E74C3C'];
const fmt = (n) => n >= 100000 ? `₹${(n/100000).toFixed(1)}L` : n >= 1000 ? `₹${(n/1000).toFixed(0)}K` : `₹${n}`;
const scoreColor = (s) => s >= 85 ? '#2ECC71' : s >= 70 ? '#00C6FF' : '#FF8C42';
const ScoreRing = ({ score, size = 52 }) => {
  const c = scoreColor(score);
  return (
    <div style={{ width:size, height:size, borderRadius:'50%', border:`3px solid ${c}`, background:`${c}14`, display:'flex', alignItems:'center', justifyContent:'center', flexDirection:'column', flexShrink:0 }}>
      <span style={{ fontSize:size > 50 ? '1rem' : '.8rem', fontWeight:800, color:c, lineHeight:1 }}>{score}</span>
      <span style={{ fontSize:'.48rem', color:`${c}99` }}>SCORE</span>
    </div>
  );
};

const AccreditBadge = ({ label }) => {
  const cls = { NABH:'badge-nabh', JCI:'badge-jci', NABL:'badge-nabl', PMJAY:'badge-pmjay' }[label] || 'badge-nabh';
  return <span className={`badge ${cls}`}><MdVerified size={9} />{label}</span>;
};

const TierBadge = ({ tier }) => {
  const map = { premium:'badge-premium Premium', super_premium:'badge-super_premium Super Premium', mid:'badge-mid Mid-tier', budget:'badge-budget Budget', government:'badge-govt Government' };
  const [cls, lbl] = (map[tier] || 'badge-mid Mid-tier').split(' ');
  return <span className={`badge ${cls}`}>{lbl}</span>;
};

const Shimmer = ({ h = 80, n = 3 }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
    {Array.from({ length:n }).map((_,i) => <div key={i} className="shimmer" style={{ height:h }} />)}
  </div>
);

// ─────────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────────
export function Dashboard() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  useEffect(() => { API.get('/analytics/summary').then(r => setStats(r.data.summary)).catch(() => {}); }, []);

  const FLOW = [
    { icon:MdChat,         label:'Patient Intent',    color:'#0072B1' },
    { icon:MdMedicalServices,label:'Clinical Mapping', color:'#00A896' },
    { icon:MdLocalHospital,label:'Provider Ranking',  color:'#FF8C42' },
    { icon:MdCalculate,    label:'Cost Estimation',   color:'#2ECC71' },
    { icon:MdTrendingUp,   label:'Decision Support',  color:'#9B59B6' },
  ];

  return (
    <div className="page-enter" style={{ padding:'26px 30px', maxWidth:1080, margin:'0 auto', width:'100%' }}>
      {/* Header */}
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:24 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:44, height:44, borderRadius:12, background:'linear-gradient(135deg,#0B3D6B,#0072B1)', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid #1A3A5C' }}>
            <MdDashboard size={22} color="#00C6FF" />
          </div>
          <div>
            <h1 style={{ margin:0, fontSize:'1.35rem', fontWeight:700, color:'#fff' }}>Welcome back, {user?.name?.split(' ')[0]}!</h1>
            <p style={{ margin:0, fontSize:'.78rem', color:'#8EAFC2', marginTop:1 }}>AI-powered healthcare decision intelligence · Data: PM-JAY HBP · NABH · CGHS</p>
          </div>
        </div>
        <button className="btn-primary" onClick={() => navigate('/chat')} style={{ display:'flex', alignItems:'center', gap:8 }}>
          <MdChat size={16} />Start AI Chat
        </button>
      </div>

      {/* Stats */}
      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:14, marginBottom:24 }}>
        {[
          { icon:MdLocalHospital, label:'Hospitals', value:stats?.totalHospitals || '—', color:'#00C6FF' },
          { icon:MdMedicalServices, label:'Procedures',value:stats?.totalProcedures || '—', color:'#00A896' },
          { icon:MdVerified,     label:'NABH Certified', value:stats?.nabh || '—', color:'#2ECC71' },
          { icon:RiShieldCheckLine, label:'PM-JAY Empanelled', value:stats?.pmjay || '—', color:'#FF8C42' },
        ].map(s => (
          <div key={s.label} className="metric-card" style={{ display:'flex', alignItems:'center', gap:14 }}>
            <div style={{ width:44, height:44, borderRadius:11, background:`${s.color}18`, border:`1px solid ${s.color}30`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <s.icon size={21} color={s.color} />
            </div>
            <div>
              <div style={{ fontSize:'.7rem', color:'#8EAFC2', fontWeight:500 }}>{s.label}</div>
              <div style={{ fontSize:'1.55rem', fontWeight:800, color:s.color, lineHeight:1 }}>{s.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Pipeline flow */}
      <div className="glass-card" style={{ padding:20, marginBottom:20 }}>
        <div style={{ fontSize:'.73rem', fontWeight:700, color:'#8EAFC2', marginBottom:14, letterSpacing:'.05em' }}>DECISION INTELLIGENCE PIPELINE</div>
        <div style={{ display:'flex', alignItems:'center', gap:0, overflowX:'auto', paddingBottom:4 }}>
          {FLOW.map((step, i) => (
            <React.Fragment key={i}>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:7, minWidth:110, padding:'6px 8px' }}>
                <div style={{ width:46, height:46, borderRadius:13, background:`${step.color}18`, border:`2px solid ${step.color}40`, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <step.icon size={21} color={step.color} />
                </div>
                <div style={{ textAlign:'center', fontSize:'.68rem', fontWeight:600, color:'#C9E7F5' }}>{step.label}</div>
              </div>
              {i < FLOW.length - 1 && <MdArrowForward size={16} color="#1A3A5C" style={{ flexShrink:0 }} />}
            </React.Fragment>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
        {[
          { icon:MdChat,         label:'AI Chat Assistant',    sub:'NLP symptom → hospital → cost pipeline', to:'/chat',     color:'#00C6FF' },
          { icon:MdLocalHospital,label:'Browse Hospitals',     sub:'NABH/PM-JAY ranked with scoring details', to:'/hospitals',color:'#00A896' },
          { icon:MdCalculate,    label:'Cost Estimator',       sub:'PM-JAY HBP 2.2 aligned cost breakdown',   to:'/cost',     color:'#FF8C42' },
          { icon:MdBookmark,     label:'Saved Hospitals',      sub:'Your shortlisted providers',               to:'/saved',    color:'#9B59B6' },
        ].map(item => (
          <div key={item.to} onClick={() => navigate(item.to)} style={{
            display:'flex', alignItems:'center', gap:12, padding:'14px 16px',
            background:'rgba(26,58,92,.35)', border:'1px solid #1A3A5C', borderRadius:11, cursor:'pointer', transition:'all .15s',
          }}
            onMouseEnter={e => { e.currentTarget.style.background=`${item.color}10`; e.currentTarget.style.borderColor=`${item.color}44`; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(26,58,92,.35)'; e.currentTarget.style.borderColor='#1A3A5C'; }}
          >
            <div style={{ width:40, height:40, borderRadius:10, background:`${item.color}18`, border:`1px solid ${item.color}30`, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
              <item.icon size={18} color={item.color} />
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:'.85rem', fontWeight:600, color:'#fff' }}>{item.label}</div>
              <div style={{ fontSize:'.7rem', color:'#8EAFC2' }}>{item.sub}</div>
            </div>
            <MdArrowForward size={15} color="#1A3A5C" />
          </div>
        ))}
      </div>

      {/* Data source banner */}
      <div style={{ marginTop:20, padding:'12px 16px', background:'rgba(0,114,177,.07)', border:'1px solid rgba(0,114,177,.2)', borderRadius:10, display:'flex', alignItems:'center', gap:10 }}>
        <RiShieldCheckLine size={16} color="#00A896" />
        <span style={{ fontSize:'.75rem', color:'#8EAFC2' }}>
          <strong style={{ color:'#00A896' }}>Data Sources:</strong> PM-JAY Health Benefit Package 2.2 (NHA, Govt. of India) · NABH Accreditation Portal · CGHS Rate Zones · Private market benchmarks
        </span>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// CHAT PAGE
// ─────────────────────────────────────────────────────────────────
function TypingBubble() {
  return (
    <div className="bubble-ai" style={{ display:'flex', alignItems:'center', gap:5, padding:'10px 14px' }}>
      {[0,1,2].map(i => <div key={i} className="typing-dot" />)}
    </div>
  );
}

function AiMessage({ msg }) {
  const [tab, setTab] = useState('response');
  const parsed    = msg.parsed    || {};
  const hospitals = msg.hospitals || [];
  const cost      = msg.cost;
  const response  = msg.response  || {};

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:7, maxWidth:'88%', animation:'pageIn .3s ease-out' }}>
      <div style={{ display:'flex', alignItems:'center', gap:6 }}>
        <div style={{ width:22, height:22, borderRadius:'50%', background:'linear-gradient(135deg,#0072B1,#00C6FF)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <RiBrainLine size={11} color="#fff" />
        </div>
        <span style={{ fontSize:'.68rem', color:'#8EAFC2', fontWeight:600 }}>MedIQ AI</span>
        {parsed.confidence > 0 && (
          <span style={{ fontSize:'.64rem', color: parsed.confidence > .7 ? '#2ECC71' : '#FF8C42', fontWeight:700, background:'rgba(0,0,0,.25)', borderRadius:4, padding:'1px 6px' }}>
            {Math.round(parsed.confidence * 100)}% confidence
          </span>
        )}
      </div>

      <div className="bubble-ai">
        <ReactMarkdown components={{ strong:({children}) => <strong style={{ color:'#00C6FF' }}>{children}</strong>, p:({children}) => <p style={{ margin:'3px 0' }}>{children}</p> }}>
          {msg.content}
        </ReactMarkdown>
      </div>

      {/* Clinical chips */}
      {parsed.icd10 && (
        <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
          <span style={{ display:'flex', alignItems:'center', gap:3, background:'rgba(0,114,177,.15)', border:'1px solid rgba(0,114,177,.4)', borderRadius:5, padding:'2px 7px', fontSize:'.66rem', color:'#4FC3F7', fontFamily:'monospace' }}>
            ICD-10: {parsed.icd10}
          </span>
          {parsed.pmjayCode && <span style={{ display:'flex', alignItems:'center', gap:3, background:'rgba(46,204,113,.12)', border:'1px solid rgba(46,204,113,.35)', borderRadius:5, padding:'2px 7px', fontSize:'.66rem', color:'#2ECC71', fontFamily:'monospace' }}>PM-JAY: {parsed.pmjayCode}</span>}
          {parsed.detectedCity && <span style={{ display:'flex', alignItems:'center', gap:3, background:'rgba(0,168,150,.1)', border:'1px solid rgba(0,168,150,.3)', borderRadius:5, padding:'2px 7px', fontSize:'.66rem', color:'#00A896' }}><FiMapPin size={9} />{parsed.detectedCity}</span>}
          {parsed.detectedBudget && <span style={{ display:'flex', alignItems:'center', gap:3, background:'rgba(255,215,0,.1)', border:'1px solid rgba(255,215,0,.3)', borderRadius:5, padding:'2px 7px', fontSize:'.66rem', color:'#FFD700' }}><FiDollarSign size={9} />₹{(parsed.detectedBudget/100000).toFixed(1)}L budget</span>}
        </div>
      )}

      {/* Tabs */}
      {(hospitals.length > 0 || cost || response.clinicalPathway?.length > 0) && (
        <div>
          <div style={{ display:'flex', gap:4, marginBottom:7 }}>
            {hospitals.length > 0 && <TabBtn active={tab==='hospitals'} onClick={() => setTab('hospitals')} icon={MdLocalHospital} label={`${hospitals.length} Hospitals`} />}
            {cost && <TabBtn active={tab==='cost'} onClick={() => setTab('cost')} icon={MdAttachMoney} label="Cost" />}
            {response.clinicalPathway?.length > 0 && <TabBtn active={tab==='pathway'} onClick={() => setTab('pathway')} icon={RiRouteLine} label="Pathway" />}
          </div>
          {tab === 'hospitals' && <HospMini hospitals={hospitals.slice(0,3)} />}
          {tab === 'cost'      && cost && <CostMini cost={cost} />}
          {tab === 'pathway'   && <PathwayMini steps={response.clinicalPathway} />}
        </div>
      )}

      {/* Suggestions for clarification */}
      {response.type === 'clarification' && response.suggestions && (
        <SuggestionChips chips={response.suggestions} />
      )}

      {/* Disclaimer */}
      {response.disclaimer && (
        <div style={{ display:'flex', gap:5, padding:'5px 9px', background:'rgba(255,140,66,.06)', border:'1px solid rgba(255,140,66,.2)', borderRadius:7 }}>
          <MdInfoOutline size={12} color="#FF8C42" style={{ flexShrink:0, marginTop:1 }} />
          <p style={{ margin:0, fontSize:'.63rem', color:'#8EAFC2', lineHeight:1.45 }}>{response.disclaimer}</p>
        </div>
      )}
    </div>
  );
}

const TabBtn = ({ active, onClick, icon:Icon, label }) => (
  <button onClick={onClick} style={{ display:'flex', alignItems:'center', gap:3, padding:'3px 9px', borderRadius:6, border:'none', cursor:'pointer', fontSize:'.68rem', fontWeight:600, fontFamily:'inherit', background: active ? 'rgba(0,198,255,.18)' : 'rgba(26,58,92,.5)', color: active ? '#00C6FF' : '#8EAFC2', transition:'all .12s' }}>
    <Icon size={11} />{label}
  </button>
);

const HospMini = ({ hospitals }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
    {hospitals.map((h,i) => (
      <div key={h._id || i} style={{ background:'rgba(11,61,107,.4)', border:'1px solid #1A3A5C', borderRadius:9, padding:'9px 11px', borderLeft:`3px solid ${['#FFD700','#00C6FF','#2ECC71'][i]||'#8EAFC2'}` }}>
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start' }}>
          <div>
            <div style={{ fontWeight:600, fontSize:'.78rem', color:'#fff' }}>#{i+1} {h.name}</div>
            <div style={{ fontSize:'.66rem', color:'#8EAFC2', marginTop:1 }}>⭐ {h.rating} · {h.city}{h.distanceKm ? ` · ${h.distanceKm}km` : ''}</div>
          </div>
          <div style={{ display:'flex', gap:3, flexWrap:'wrap', justifyContent:'flex-end' }}>
            {h.accreditations?.slice(0,2).map(a => <AccreditBadge key={a} label={a} />)}
          </div>
        </div>
      </div>
    ))}
  </div>
);

const CostMini = ({ cost }) => (
  <div style={{ background:'rgba(11,61,107,.35)', border:'1px solid #1A3A5C', borderRadius:9, padding:11 }}>
    <div style={{ fontWeight:700, fontSize:'.76rem', color:'#FFD700', marginBottom:7 }}>
      Total: {fmt(cost.total.low)} – {fmt(cost.total.high)}
    </div>
    {Object.entries(cost.components || {}).map(([k,v],i) => (
      <div key={k} style={{ display:'flex', alignItems:'center', gap:6, marginBottom:4 }}>
        <div style={{ fontSize:'.64rem', color:'#8EAFC2', width:80, flexShrink:0 }}>{v.label}</div>
        <div className="range-track" style={{ flex:1 }}>
          <div className="range-fill" style={{ width:`${v.percentage||15}%`, background:`linear-gradient(90deg,${C[i%C.length]}66,${C[i%C.length]})` }} />
        </div>
        <div style={{ fontSize:'.64rem', color:C[i%C.length], fontWeight:600, width:70, textAlign:'right', flexShrink:0 }}>
          {fmt(v.low)}–{fmt(v.high)}
        </div>
      </div>
    ))}
    <div style={{ marginTop:7, fontSize:'.64rem', color: cost.confidence > .7 ? '#2ECC71' : '#FF8C42' }}>
      Confidence: {Math.round((cost.confidence||0)*100)}% · Source: PM-JAY HBP
    </div>
  </div>
);

const PathwayMini = ({ steps }) => (
  <div style={{ display:'flex', flexDirection:'column', gap:5 }}>
    {steps.map(s => (
      <div key={s.step} style={{ display:'flex', gap:9, alignItems:'flex-start' }}>
        <div style={{ width:20, height:20, borderRadius:'50%', flexShrink:0, background:'linear-gradient(135deg,#0B3D6B,#0072B1)', border:'1px solid #00C6FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.62rem', fontWeight:700, color:'#00C6FF' }}>{s.step}</div>
        <div>
          <div style={{ fontSize:'.73rem', fontWeight:600, color:'#fff' }}>{s.action}</div>
          <div style={{ fontSize:'.65rem', color:'#8EAFC2' }}>{s.detail}</div>
        </div>
      </div>
    ))}
  </div>
);

const SuggestionChips = ({ chips }) => {
  const { sendMessage } = useChatStore();
  return (
    <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginTop:3 }}>
      {chips.map(c => (
        <button key={c} onClick={() => sendMessage(c)} style={{ background:'rgba(0,114,177,.14)', border:'1px solid rgba(0,114,177,.3)', borderRadius:18, padding:'3px 11px', cursor:'pointer', fontSize:'.7rem', color:'#00C6FF', fontWeight:500, fontFamily:'inherit' }}>
          {c}
        </button>
      ))}
    </div>
  );
};

export function ChatPage() {
  const { messages, isTyping, sendMessage, clearChat, suggestions } = useChatStore();
  const [input, setInput] = useState('');
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior:'smooth' }); }, [messages, isTyping]);

  const doSend = () => { const t = input.trim(); if (!t) return; setInput(''); sendMessage(t); };
  const onKey  = (e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); doSend(); } };

  return (
    <div style={{ height:'100%', display:'flex', flexDirection:'column' }}>
      <div style={{ padding:'18px 26px 0', flexShrink:0 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:4 }}>
          <div style={{ width:40, height:40, borderRadius:11, background:'linear-gradient(135deg,#0B3D6B,#0072B1)', display:'flex', alignItems:'center', justifyContent:'center', border:'1px solid #1A3A5C' }}>
            <MdChat size={20} color="#00C6FF" />
          </div>
          <div>
            <h1 style={{ margin:0, fontSize:'1.2rem', fontWeight:700, color:'#fff' }}>AI Assistant</h1>
            <p style={{ margin:0, fontSize:'.75rem', color:'#8EAFC2' }}>NLP-powered clinical mapping · PM-JAY HBP · NABH data</p>
          </div>
        </div>
      </div>

      <div className="scrollable" style={{ flex:1, padding:'14px 24px', display:'flex', flexDirection:'column', gap:14 }}>
        {messages.length === 0 && (
          <div style={{ flex:1, display:'flex', flexDirection:'column', justifyContent:'center', alignItems:'center', gap:22 }}>
            <div style={{ textAlign:'center' }}>
              <div style={{ width:60, height:60, borderRadius:18, background:'linear-gradient(135deg,#0B3D6B,#0072B1)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 12px' }}>
                <RiBrainLine size={30} color="#00C6FF" />
              </div>
              <div style={{ fontSize:'1.2rem', fontWeight:700, color:'#fff', marginBottom:5 }}>MedIQ AI Assistant</div>
              <div style={{ fontSize:'.82rem', color:'#8EAFC2', maxWidth:380, lineHeight:1.6 }}>
                Describe your condition, symptoms, or the procedure you need — in plain language, including city and budget.
              </div>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, width:'100%', maxWidth:520 }}>
              {suggestions.map(s => (
                <button key={s} onClick={() => sendMessage(s)} style={{ background:'rgba(11,61,107,.5)', border:'1px solid #1A3A5C', borderRadius:9, padding:'9px 12px', cursor:'pointer', textAlign:'left', color:'#C9E7F5', fontSize:'.73rem', lineHeight:1.4, fontFamily:'inherit' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor='#00C6FF'; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor='#1A3A5C'; }}>
                  <MdAutoAwesome size={11} color="#00C6FF" style={{ marginRight:5, verticalAlign:'middle' }} />{s}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map(m => (
          <div key={m.id} style={{ display:'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
            {m.role === 'user'
              ? <div className="bubble-user">{m.content}</div>
              : <AiMessage msg={m} />}
          </div>
        ))}

        {isTyping && <div style={{ display:'flex', justifyContent:'flex-start' }}><TypingBubble /></div>}
        <div ref={bottomRef} />
      </div>

      <div style={{ borderTop:'1px solid #1A3A5C', padding:'12px 20px', background:'#0A1628' }}>
        {messages.length > 0 && (
          <button onClick={clearChat} style={{ float:'right', background:'transparent', border:'none', cursor:'pointer', display:'flex', alignItems:'center', gap:4, color:'#8EAFC2', fontSize:'.7rem', fontFamily:'inherit', marginBottom:6 }}>
            <MdDeleteOutline size={14} />Clear
          </button>
        )}
        <div style={{ display:'flex', gap:9, alignItems:'flex-end', clear:'both' }}>
          <textarea value={input} onChange={e => setInput(e.target.value)} onKeyDown={onKey}
            placeholder="e.g. Angioplasty in Nagpur under ₹3 lakh, age 58, diabetic…"
            rows={2} style={{ flex:1, background:'#0D2137', border:'1px solid #1A3A5C', borderRadius:9, padding:'9px 13px', color:'#fff', fontSize:'.875rem', resize:'none', outline:'none', fontFamily:'inherit', lineHeight:1.5 }}
            onFocus={e => e.target.style.borderColor='#00C6FF'}
            onBlur={e => e.target.style.borderColor='#1A3A5C'} />
          <button className="btn-primary" onClick={doSend} disabled={!input.trim() || isTyping} style={{ padding:'10px 15px', borderRadius:9, flexShrink:0 }}>
            <MdSend size={17} />
          </button>
        </div>
        <p style={{ margin:'5px 0 0', fontSize:'.62rem', color:'#1A3A5C', textAlign:'center' }}>
          Decision support only — not medical advice. Always consult a qualified physician.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// HOSPITALS PAGE
// ─────────────────────────────────────────────────────────────────
const PROCS = [
  { value:'',label:'All Procedures' },
  { value:'angioplasty',label:'Angioplasty (PCI)' },
  { value:'bypass_surgery',label:'Bypass Surgery' },
  { value:'knee_replacement',label:'Knee Replacement' },
  { value:'hip_replacement',label:'Hip Replacement' },
  { value:'dialysis',label:'Dialysis' },
  { value:'chemotherapy',label:'Chemotherapy' },
  { value:'neurosurgery',label:'Neurosurgery' },
  { value:'angiography',label:'Angiography' },
  { value:'kidney_transplant',label:'Kidney Transplant' },
  { value:'cataract_surgery',label:'Cataract Surgery' },
  { value:'appendectomy',label:'Appendectomy' },
  { value:'normal_delivery',label:'Normal Delivery' },
  { value:'c_section',label:'C-Section' },
];

function HospitalCard({ hospital:h, rank, procedure }) {
  const navigate = useNavigate();
  const { toggleSave } = useHospitalStore();
  const { user } = useAuthStore();
  const isSaved = user?.savedHospitals?.some(s => s._id === h._id || s === h._id);
  const rc = ['#FFD700','#00C6FF','#2ECC71','#FF8C42','#8EAFC2'][rank-1] || '#8EAFC2';
  const costRange = h.costRanges?.[procedure];

  return (
    <div style={{ background:'#0D2137', border:`1px solid #1A3A5C`, borderLeft:`4px solid ${rc}`, borderRadius:12, padding:18, cursor:'pointer', transition:'all .2s' }}
      onMouseEnter={e => { e.currentTarget.style.boxShadow=`0 0 18px ${rc}22`; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow='none'; }}
      onClick={() => navigate(`/hospitals/${h._id}`)}>
      <div style={{ display:'flex', gap:14, alignItems:'flex-start' }}>
        {/* Rank + score */}
        <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:5, flexShrink:0 }}>
          <div style={{ fontSize:'.62rem', fontWeight:700, color:rc, background:`${rc}18`, border:`1px solid ${rc}44`, borderRadius:5, padding:'1px 7px' }}>#{rank}</div>
          <ScoreRing score={h.computedScore || h.scores?.overall || 75} size={50} />
        </div>
        {/* Info */}
        <div style={{ flex:1, minWidth:0 }}>
          <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:5, flexWrap:'wrap' }}>
            <h3 style={{ margin:0, fontSize:'.95rem', fontWeight:700, color:'#fff' }}>{h.name}</h3>
            {h.pmjayEmpanelled && <span className="badge badge-pmjay"><MdVerified size={9} />PM-JAY</span>}
          </div>
          <div style={{ display:'flex', alignItems:'center', gap:12, flexWrap:'wrap', marginBottom:8, fontSize:'.76rem', color:'#8EAFC2' }}>
            <span style={{ display:'flex', alignItems:'center', gap:3 }}><MdLocationOn size={12} color="#00A896" />{h.city}, {h.state}</span>
            <span style={{ display:'flex', alignItems:'center', gap:3, color:'#FFD700' }}><MdStar size={12} />{h.rating} ({h.reviewCount})</span>
          </div>
          <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:10 }}>
            <TierBadge tier={h.tier} />
            {h.accreditations?.map(a => <AccreditBadge key={a} label={a} />)}
          </div>
          <div style={{ display:'flex', gap:12, fontSize:'.7rem', color:'#8EAFC2', flexWrap:'wrap' }}>
            {h.totalBeds && <span style={{ display:'flex', alignItems:'center', gap:3 }}><MdBed size={11} color="#00C6FF" />{h.totalBeds} beds</span>}
            {h.procedureVolume && <span style={{ display:'flex', alignItems:'center', gap:3 }}><FiAward size={11} color="#00C6FF" />{h.procedureVolume.replace('_',' ')} volume</span>}
            {h.establishedYear && <span>Est. {h.establishedYear}</span>}
          </div>
        </div>
        {/* Cost + save */}
        <div style={{ flexShrink:0, display:'flex', flexDirection:'column', alignItems:'flex-end', gap:8 }}>
          {costRange && (
            <div style={{ textAlign:'right', background:'rgba(11,61,107,.5)', border:'1px solid #1A3A5C', borderRadius:9, padding:'10px 14px' }}>
              <div style={{ fontSize:'.62rem', color:'#8EAFC2', fontWeight:600, marginBottom:2 }}>EST. RANGE</div>
              <div style={{ fontSize:'.88rem', fontWeight:800, color:'#2ECC71' }}>{fmt(costRange.low)}</div>
              <div style={{ fontSize:'.64rem', color:'#8EAFC2' }}>to</div>
              <div style={{ fontSize:'1rem', fontWeight:800, color:'#2ECC71' }}>{fmt(costRange.high)}</div>
            </div>
          )}
          <button onClick={e => { e.stopPropagation(); toggleSave(h._id); }} style={{ background:'transparent', border:'none', cursor:'pointer', padding:0, color: isSaved ? '#E74C3C' : '#8EAFC2' }}>
            <MdBookmark size={18} />
          </button>
        </div>
      </div>
      {/* Specializations */}
      <div style={{ marginTop:10, paddingTop:9, borderTop:'1px solid #1A3A5C', display:'flex', flexWrap:'wrap', gap:5 }}>
        {h.specializations?.slice(0,4).map(s => (
          <span key={s} style={{ fontSize:'.65rem', color:'#8EAFC2', background:'rgba(26,58,92,.5)', border:'1px solid #1A3A5C', borderRadius:4, padding:'2px 7px' }}>{s}</span>
        ))}
      </div>
    </div>
  );
}

export function HospitalsPage() {
  const { hospitals, loading, fetchHospitals, filters, setFilters } = useHospitalStore();
  const [show, setShow] = useState(true);
  const sf = (k,v) => setFilters({ [k]:v });

  useEffect(() => { fetchHospitals(); }, [filters]);

  const sel = { background:'#0D2137', border:'1px solid #1A3A5C', borderRadius:8, color:'#C9E7F5', padding:'8px 11px', fontSize:'.78rem', cursor:'pointer', outline:'none', fontFamily:'inherit', width:'100%' };

  return (
    <div className="page-enter" style={{ padding:'24px 28px' }}>
      <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:22 }}>
        <div style={{ display:'flex', alignItems:'center', gap:12 }}>
          <div style={{ width:42, height:42, borderRadius:11, background:'linear-gradient(135deg,#0B3D6B,#0072B1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
            <MdLocalHospital size={21} color="#00C6FF" />
          </div>
          <div>
            <h1 style={{ margin:0, fontSize:'1.3rem', fontWeight:700, color:'#fff' }}>Hospital Discovery</h1>
            <p style={{ margin:0, fontSize:'.75rem', color:'#8EAFC2' }}>AI-ranked · NABH · PM-JAY · CGHS data</p>
          </div>
        </div>
        <button className="btn-outline" onClick={() => setShow(!show)} style={{ display:'flex', alignItems:'center', gap:6 }}>
          <MdFilterList size={15} />{show ? 'Hide' : 'Show'} Filters
        </button>
      </div>

      {/* Filters */}
      {show && (
        <div style={{ display:'grid', gridTemplateColumns:'2fr 1fr 1fr 1fr 1fr auto', gap:10, background:'#0D2137', border:'1px solid #1A3A5C', borderRadius:11, padding:14, marginBottom:18, alignItems:'end' }}>
          <div>
            <label className="form-label">Search</label>
            <div style={{ position:'relative' }}>
              <MdSearch size={14} color="#8EAFC2" style={{ position:'absolute', left:10, top:11 }} />
              <input className="form-input" style={{ paddingLeft:30 }} value={filters.search} onChange={e => sf('search', e.target.value)} placeholder="Hospital, city, specialty…" />
            </div>
          </div>
          <div><label className="form-label">Procedure</label><select style={sel} value={filters.procedure} onChange={e => sf('procedure', e.target.value)}>{PROCS.map(p => <option key={p.value} value={p.value}>{p.label}</option>)}</select></div>
          <div><label className="form-label">City</label>
            <select style={sel} value={filters.city} onChange={e => sf('city', e.target.value)}>
              <option value="">All Cities</option>
              {['Mumbai','Delhi','Bangalore','Hyderabad','Pune','Chennai','Nagpur','Jaipur'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div><label className="form-label">Tier</label>
            <select style={sel} value={filters.tier} onChange={e => sf('tier', e.target.value)}>
              <option value="">All Tiers</option>
              <option value="super_premium">Super Premium</option><option value="premium">Premium</option>
              <option value="mid">Mid-tier</option><option value="government">Government</option>
            </select>
          </div>
          <div><label className="form-label">Accreditation</label>
            <select style={sel} value={filters.accreditation} onChange={e => sf('accreditation', e.target.value)}>
              <option value="">All</option>
              <option value="NABH">NABH</option><option value="JCI">JCI</option>
              <option value="NABL">NABL</option><option value="PMJAY">PM-JAY</option>
            </select>
          </div>
          <button className="btn-outline" onClick={() => setFilters({ procedure:'',city:'',tier:'',accreditation:'',search:'',sortBy:'score' })} style={{ display:'flex', alignItems:'center', gap:5 }}>
            <MdRefresh size={14} />Reset
          </button>
        </div>
      )}

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:14 }}>
        <div style={{ fontSize:'.78rem', color:'#8EAFC2' }}>
          {loading ? 'Loading…' : <><strong style={{ color:'#00C6FF' }}>{hospitals.length}</strong> hospitals found{filters.procedure && ` for ${filters.procedure.replace(/_/g,' ')}`}</>}
        </div>
        <select style={{ ...sel, width:'auto', fontSize:'.72rem' }} value={filters.sortBy} onChange={e => sf('sortBy', e.target.value)}>
          <option value="score">Sort: AI Score</option>
          <option value="rating">Sort: Rating</option>
          <option value="cost_asc">Sort: Cost ↑</option>
        </select>
      </div>

      {loading ? <Shimmer n={4} h={130} /> : (
        <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
          {hospitals.map((h,i) => <HospitalCard key={h._id} hospital={h} rank={h.rank||i+1} procedure={filters.procedure} />)}
          {hospitals.length === 0 && (
            <div style={{ textAlign:'center', padding:'50px 20px' }}>
              <MdLocalHospital size={44} color="#1A3A5C" style={{ marginBottom:12 }} />
              <div style={{ color:'#8EAFC2' }}>No hospitals found — try adjusting filters</div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// HOSPITAL DETAIL
// ─────────────────────────────────────────────────────────────────
export function HospitalDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchHospital, selectedHospital:h, loading } = useHospitalStore();
  const { fetchEstimate, estimate, loading:costLoading } = useCostStore();
  const [tab, setTab]       = useState('overview');
  const [selProc, setSelProc] = useState('');
  const [review, setReview] = useState({ rating:5, text:'' });

  useEffect(() => { fetchHospital(id); }, [id]);

  const loadCost = async (proc) => {
    setSelProc(proc);
    await fetchEstimate({ procedureKey:proc, city:h?.city, hospitalTier:h?.tier });
    setTab('cost');
  };

  const submitReview = async () => {
    try {
      await API.post(`/hospitals/${id}/review`, review);
      toast.success('Review submitted!');
      fetchHospital(id);
    } catch (e) { toast.error(e.message); }
  };

  if (loading) return <div style={{ padding:32 }}><Shimmer n={3} h={100} /></div>;
  if (!h)      return <div style={{ padding:32, color:'#8EAFC2' }}>Hospital not found.</div>;

  const TABS = ['overview','doctors','cost','reviews'];

  return (
    <div className="page-enter" style={{ padding:'22px 28px', maxWidth:900, margin:'0 auto', width:'100%' }}>
      <button onClick={() => navigate(-1)} style={{ display:'flex', alignItems:'center', gap:6, background:'transparent', border:'none', color:'#8EAFC2', cursor:'pointer', fontSize:'.78rem', marginBottom:18, padding:0, fontFamily:'inherit' }}>
        <MdArrowBack size={15} />Back
      </button>

      {/* Hero */}
      <div className="glass-card" style={{ padding:20, marginBottom:18 }}>
        <div style={{ display:'flex', gap:18, alignItems:'flex-start', flexWrap:'wrap' }}>
          <ScoreRing score={h.computedScore || h.scores?.overall || 75} size={66} />
          <div style={{ flex:1, minWidth:200 }}>
            <div style={{ display:'flex', alignItems:'center', gap:8, flexWrap:'wrap', marginBottom:5 }}>
              <h1 style={{ margin:0, fontSize:'1.3rem', fontWeight:800, color:'#fff' }}>{h.name}</h1>
              {h.pmjayEmpanelled && <span className="badge badge-pmjay"><MdVerified size={9} />PM-JAY</span>}
            </div>
            <div style={{ display:'flex', gap:5, flexWrap:'wrap', marginBottom:10 }}>
              <TierBadge tier={h.tier} />
              {h.accreditations?.map(a => <AccreditBadge key={a} label={a} />)}
            </div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:14, fontSize:'.75rem', color:'#8EAFC2' }}>
              <span style={{ display:'flex', gap:3, alignItems:'center' }}><MdLocationOn size={12} color="#00A896" />{h.address}</span>
              {h.phone?.[0] && <span style={{ display:'flex', gap:3, alignItems:'center' }}><MdPhone size={12} color="#00C6FF" />{h.phone[0]}</span>}
              {h.website && <span style={{ display:'flex', gap:3, alignItems:'center' }}><FiGlobe size={11} color="#8EAFC2" />{h.website}</span>}
            </div>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:8, flexShrink:0 }}>
            {[{ icon:MdStar, label:'Rating', val:`${h.rating}★`, color:'#FFD700' }, { icon:MdBed, label:'Beds', val:h.totalBeds, color:'#00C6FF' }, { icon:MdPeople, label:'Doctors', val:h.doctors?.length, color:'#00A896' }, { icon:MdBed, label:'ICU', val:h.icuBeds, color:'#FF8C42' }].map(m => (
              <div key={m.label} style={{ background:'rgba(26,58,92,.4)', borderRadius:8, padding:'8px 11px', textAlign:'center' }}>
                <m.icon size={15} color={m.color} style={{ marginBottom:2 }} />
                <div style={{ fontSize:'.88rem', fontWeight:700, color:m.color }}>{m.val || '—'}</div>
                <div style={{ fontSize:'.6rem', color:'#8EAFC2' }}>{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display:'flex', gap:2, marginBottom:18, borderBottom:'1px solid #1A3A5C' }}>
        {TABS.map(t => (
          <button key={t} onClick={() => setTab(t)} style={{ background:'transparent', border:'none', cursor:'pointer', padding:'8px 16px', fontSize:'.8rem', fontWeight:600, color: tab===t ? '#00C6FF' : '#8EAFC2', borderBottom: tab===t ? '2px solid #00C6FF' : '2px solid transparent', textTransform:'capitalize', fontFamily:'inherit' }}>
            {t === 'cost' ? 'Cost Estimator' : t}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === 'overview' && (
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div className="glass-card" style={{ padding:16 }}>
            <div style={{ fontSize:'.72rem', fontWeight:700, color:'#8EAFC2', marginBottom:10 }}>SPECIALIZATIONS</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
              {h.specializations?.map(s => <span key={s} style={{ background:'rgba(0,114,177,.12)', border:'1px solid rgba(0,114,177,.3)', borderRadius:7, padding:'4px 11px', fontSize:'.75rem', color:'#C9E7F5' }}>{s}</span>)}
            </div>
          </div>
          <div className="glass-card" style={{ padding:16 }}>
            <div style={{ fontSize:'.72rem', fontWeight:700, color:'#8EAFC2', marginBottom:10 }}>AI SCORING BREAKDOWN</div>
            {h.scores && Object.entries(h.scores).filter(([k]) => k!=='overall').map(([k,v]) => (
              <div key={k} style={{ marginBottom:9 }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                  <span style={{ fontSize:'.74rem', color:'#C9E7F5', textTransform:'capitalize' }}>{k}</span>
                  <span style={{ fontSize:'.74rem', fontWeight:700, color:'#00C6FF' }}>{v}/100</span>
                </div>
                <div className="range-track"><div className="range-fill" style={{ width:`${v}%`, background:'linear-gradient(90deg,#0072B1,#00C6FF)' }} /></div>
              </div>
            ))}
          </div>
          <div className="glass-card" style={{ padding:16 }}>
            <div style={{ fontSize:'.72rem', fontWeight:700, color:'#8EAFC2', marginBottom:10 }}>PROCEDURES — click to estimate cost</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
              {h.procedures?.map(p => (
                <button key={p} onClick={() => loadCost(p)} style={{ background: selProc===p ? 'rgba(0,198,255,.18)' : 'rgba(26,58,92,.5)', border:`1px solid ${selProc===p ? '#00C6FF' : '#1A3A5C'}`, borderRadius:8, padding:'5px 12px', cursor:'pointer', fontSize:'.73rem', color: selProc===p ? '#00C6FF' : '#8EAFC2', fontFamily:'inherit' }}>
                  <MdAttachMoney size={11} style={{ verticalAlign:'middle', marginRight:3 }} />{p.replace(/_/g,' ')}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Doctors */}
      {tab === 'doctors' && (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(250px,1fr))', gap:12 }}>
          {h.doctors?.map((d,i) => (
            <div key={i} className="glass-card" style={{ padding:16 }}>
              <div style={{ display:'flex', gap:11, alignItems:'center', marginBottom:10 }}>
                <div style={{ width:42, height:42, borderRadius:'50%', background:'linear-gradient(135deg,#0B3D6B,#0072B1)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1rem', fontWeight:700, color:'#00C6FF', flexShrink:0 }}>
                  {d.name?.split(' ').pop()?.[0]}
                </div>
                <div><div style={{ fontWeight:700, fontSize:'.88rem', color:'#fff' }}>{d.name}</div><div style={{ fontSize:'.7rem', color:'#8EAFC2' }}>{d.specialty}</div></div>
              </div>
              <div style={{ display:'flex', gap:12, fontSize:'.73rem', color:'#8EAFC2' }}>
                <span><MdStar size={12} color="#FFD700" style={{ verticalAlign:'middle' }} /> {d.rating}</span>
                <span>{d.experience} yrs</span>
                {d.consultationFee && <span style={{ color:'#2ECC71' }}>₹{d.consultationFee}/visit</span>}
              </div>
            </div>
          ))}
          {!h.doctors?.length && <div style={{ color:'#8EAFC2', fontSize:'.85rem', gridColumn:'1/-1' }}>No doctor data available.</div>}
        </div>
      )}

      {/* Cost */}
      {tab === 'cost' && (
        !estimate ? (
          <div style={{ textAlign:'center', padding:'40px 20px' }}>
            <MdAttachMoney size={40} color="#1A3A5C" style={{ marginBottom:12 }} />
            <div style={{ color:'#8EAFC2', marginBottom:12 }}>Select a procedure from Overview to see cost estimate</div>
            <div style={{ display:'flex', flexWrap:'wrap', gap:7, justifyContent:'center' }}>
              {h.procedures?.slice(0,5).map(p => <button key={p} onClick={() => loadCost(p)} style={{ background:'rgba(0,114,177,.14)', border:'1px solid rgba(0,114,177,.3)', borderRadius:8, padding:'5px 12px', cursor:'pointer', fontSize:'.75rem', color:'#00C6FF', fontFamily:'inherit' }}>{p.replace(/_/g,' ')}</button>)}
            </div>
          </div>
        ) : costLoading ? <Shimmer n={2} h={120} /> : <CostBreakdownFull cost={estimate} />
      )}

      {/* Reviews */}
      {tab === 'reviews' && (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {h.reviews?.map((r,i) => (
            <div key={i} className="glass-card" style={{ padding:14 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                <span style={{ fontWeight:600, fontSize:'.84rem', color:'#fff' }}>{r.author}</span>
                <div style={{ display:'flex', gap:1 }}>
                  {Array.from({ length:5 }).map((_,j) => <MdStar key={j} size={14} color={j < r.rating ? '#FFD700' : '#1A3A5C'} />)}
                </div>
              </div>
              <p style={{ margin:0, fontSize:'.8rem', color:'#C9E7F5', lineHeight:1.6 }}>{r.text}</p>
              {r.verified && <div style={{ marginTop:5, fontSize:'.65rem', color:'#00A896', display:'flex', alignItems:'center', gap:3 }}><MdVerified size={10} />Verified patient</div>}
            </div>
          ))}

          {/* Add review */}
          <div className="glass-card" style={{ padding:16 }}>
            <div style={{ fontSize:'.75rem', fontWeight:700, color:'#8EAFC2', marginBottom:12 }}>ADD YOUR REVIEW</div>
            <div style={{ marginBottom:10 }}>
              <label className="form-label">Rating</label>
              <div style={{ display:'flex', gap:8 }}>
                {[1,2,3,4,5].map(n => (
                  <button key={n} onClick={() => setReview(p => ({ ...p, rating:n }))} style={{ background:'transparent', border:'none', cursor:'pointer', padding:0 }}>
                    <MdStar size={24} color={n <= review.rating ? '#FFD700' : '#1A3A5C'} />
                  </button>
                ))}
              </div>
            </div>
            <textarea className="form-input" rows={3} value={review.text} onChange={e => setReview(p => ({ ...p, text:e.target.value }))} placeholder="Share your experience…" style={{ marginBottom:10 }} />
            <button className="btn-primary" onClick={submitReview} disabled={!review.text.trim()} style={{ display:'flex', alignItems:'center', gap:6 }}>
              <MdSend size={14} />Submit Review
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// COST BREAKDOWN COMPONENT
// ─────────────────────────────────────────────────────────────────
function CostBreakdownFull({ cost }) {
  const entries = Object.entries(cost.components || {});
  const pieData = entries.map(([k,v],i) => ({ name:v.label, value:v.midpoint, low:v.low, high:v.high, percentage:v.percentage, fill:C[i] }));
  const CustomTip = ({ active, payload }) => {
    if (!active || !payload?.length) return null;
    const d = payload[0].payload;
    return <div style={{ background:'#0D2137', border:'1px solid #1A3A5C', borderRadius:8, padding:'7px 11px', fontSize:'.75rem' }}><strong style={{ color:'#fff' }}>{d.name}</strong><div style={{ color:'#2ECC71' }}>{fmt(d.low)} – {fmt(d.high)}</div><div style={{ color:'#8EAFC2' }}>{d.percentage}%</div></div>;
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
      {/* Total hero */}
      <div style={{ background:'linear-gradient(135deg,rgba(11,61,107,.8),rgba(0,114,177,.4))', border:'1px solid #0072B1', borderRadius:11, padding:'16px 20px', display:'flex', justifyContent:'space-between', alignItems:'center', flexWrap:'wrap', gap:12 }}>
        <div>
          <div style={{ fontSize:'.7rem', color:'#8EAFC2', fontWeight:600 }}>TOTAL ESTIMATED RANGE · {cost.city || ''}</div>
          <div style={{ fontSize:'1.9rem', fontWeight:800, color:'#FFD700', lineHeight:1 }}>{fmt(cost.total.low)} – {fmt(cost.total.high)}</div>
          <div style={{ fontSize:'.75rem', color:'#8EAFC2', marginTop:3 }}>Midpoint: <strong style={{ color:'#fff' }}>{fmt(cost.total.midpoint)}</strong> · {cost.dataSource}</div>
        </div>
        <div>
          <div style={{ fontSize:'.68rem', color:'#8EAFC2', marginBottom:3 }}>CONFIDENCE</div>
          <div style={{ display:'flex', alignItems:'center', gap:8 }}>
            <div className="conf-track" style={{ width:120 }}>
              <div className="conf-fill" style={{ width:`${Math.round((cost.confidence||0)*100)}%`, background: cost.confidence > .7 ? 'linear-gradient(90deg,#2ECC71aa,#2ECC71)' : 'linear-gradient(90deg,#FF8C42aa,#FF8C42)' }} />
            </div>
            <span style={{ fontSize:'.78rem', fontWeight:700, color: cost.confidence > .7 ? '#2ECC71' : '#FF8C42' }}>{Math.round((cost.confidence||0)*100)}%</span>
          </div>
          {cost.pmjayCode && <div style={{ marginTop:5, fontSize:'.64rem', color:'#2ECC71' }}>PM-JAY Code: {cost.pmjayCode}</div>}
          {cost.pmjayPrivateRate && <div style={{ fontSize:'.64rem', color:'#8EAFC2' }}>PM-JAY rate: {fmt(cost.pmjayPrivateRate)}/case</div>}
        </div>
      </div>

      {/* Charts */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 1.6fr', gap:14 }}>
        <div className="glass-card" style={{ padding:14 }}>
          <div style={{ fontSize:'.72rem', fontWeight:700, color:'#8EAFC2', marginBottom:10 }}>COST SPLIT</div>
          <ResponsiveContainer width="100%" height={185}>
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" innerRadius={50} outerRadius={78} paddingAngle={2} dataKey="value">
                {pieData.map((e,i) => <Cell key={i} fill={e.fill} stroke="transparent" />)}
              </Pie>
              <Tooltip content={<CustomTip />} />
            </PieChart>
          </ResponsiveContainer>
          <div style={{ display:'flex', flexDirection:'column', gap:3 }}>
            {pieData.map((d,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:5 }}>
                <div style={{ width:7, height:7, borderRadius:2, background:d.fill, flexShrink:0 }} />
                <span style={{ fontSize:'.64rem', color:'#8EAFC2', flex:1 }}>{d.name}</span>
                <span style={{ fontSize:'.64rem', fontWeight:700, color:d.fill }}>{d.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
        <div className="glass-card" style={{ padding:14 }}>
          <div style={{ fontSize:'.72rem', fontWeight:700, color:'#8EAFC2', marginBottom:10 }}>COMPONENT RANGES</div>
          {entries.map(([k,v],i) => (
            <div key={k} style={{ marginBottom:9 }}>
              <div style={{ display:'flex', justifyContent:'space-between', marginBottom:3 }}>
                <span style={{ fontSize:'.72rem', color:'#C9E7F5' }}>{v.label}</span>
                <span style={{ fontSize:'.72rem', fontWeight:700, color:C[i] }}>{fmt(v.low)} – {fmt(v.high)}</span>
              </div>
              <div className="range-track"><div className="range-fill" style={{ width:`${v.percentage||15}%`, background:`linear-gradient(90deg,${C[i]}55,${C[i]})` }} /></div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk flags */}
      {cost.riskFlags?.length > 0 && (
        <div style={{ background:'rgba(231,76,60,.06)', border:'1px solid rgba(231,76,60,.25)', borderRadius:11, padding:14 }}>
          <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:9 }}>
            <MdWarningAmber size={16} color="#FF8C42" /><span style={{ fontSize:'.75rem', fontWeight:700, color:'#FF8C42' }}>Risk Factors Detected</span>
          </div>
          {cost.riskFlags.map((rf,i) => (
            <div key={i} style={{ display:'flex', gap:8, fontSize:'.73rem', marginBottom:4 }}>
              <span style={{ color:'#FF8C42', fontWeight:600 }}>{rf.flag}:</span>
              <span style={{ color:'#8EAFC2' }}>{rf.impact}</span>
            </div>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <div style={{ display:'flex', gap:7, padding:'9px 12px', background:'rgba(255,140,66,.07)', border:'1px solid rgba(255,140,66,.25)', borderRadius:9 }}>
        <RiShieldCheckLine size={15} color="#FF8C42" style={{ flexShrink:0, marginTop:1 }} />
        <p style={{ margin:0, fontSize:'.68rem', color:'#8EAFC2', lineHeight:1.5 }}>{cost.disclaimer}</p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// COST ESTIMATOR PAGE
// ─────────────────────────────────────────────────────────────────
export function CostEstimator() {
  const { estimate, loading, fetchEstimate } = useCostStore();
  const [form, setForm] = useState({ procedureKey:'angioplasty', city:'Nagpur', age:'', severity:'moderate', hospitalTier:'mid', comorbidities:[] });
  const sf = (k) => (e) => setForm(p => ({ ...p, [k]:e.target.value }));
  const toggleC = (id) => setForm(p => ({ ...p, comorbidities: p.comorbidities.includes(id) ? p.comorbidities.filter(c => c!==id) : [...p.comorbidities, id] }));

  const sty = { background:'#0D2137', border:'1px solid #1A3A5C', borderRadius:8, color:'#C9E7F5', padding:'9px 12px', fontSize:'.8rem', width:'100%', boxSizing:'border-box', outline:'none', fontFamily:'inherit' };

  return (
    <div className="page-enter" style={{ padding:'24px 28px', maxWidth:980, margin:'0 auto', width:'100%' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
        <div style={{ width:42, height:42, borderRadius:11, background:'linear-gradient(135deg,#0B3D6B,#0072B1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <MdCalculate size={21} color="#00C6FF" />
        </div>
        <div>
          <h1 style={{ margin:0, fontSize:'1.3rem', fontWeight:700, color:'#fff' }}>Cost Estimator</h1>
          <p style={{ margin:0, fontSize:'.75rem', color:'#8EAFC2' }}>PM-JAY HBP 2.2 rates · CGHS geo-pricing · private market benchmarks</p>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'330px 1fr', gap:22, alignItems:'start' }}>
        {/* Form */}
        <div className="glass-card" style={{ padding:22 }}>
          <div style={{ fontSize:'.73rem', fontWeight:700, color:'#8EAFC2', marginBottom:16, letterSpacing:'.05em' }}>ESTIMATION PARAMETERS</div>
          <div style={{ display:'flex', flexDirection:'column', gap:13 }}>
            <div><label className="form-label">Procedure *</label>
              <select style={sty} value={form.procedureKey} onChange={sf('procedureKey')}>
                {PROCS.filter(p => p.value).map(p => <option key={p.value} value={p.value}>{p.label}</option>)}
              </select>
            </div>
            <div><label className="form-label">City</label>
              <select style={sty} value={form.city} onChange={sf('city')}>
                {['Mumbai','Delhi','Bangalore','Hyderabad','Pune','Chennai','Nagpur','Jaipur','Lucknow','Bhopal','Indore','Chandigarh'].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div><label className="form-label">Patient Age</label>
              <input style={sty} type="number" value={form.age} onChange={sf('age')} placeholder="e.g. 58" min={1} max={120} />
            </div>
            <div><label className="form-label">Severity</label>
              <div style={{ display:'flex', gap:7 }}>
                {['mild','moderate','severe'].map(s => (
                  <button key={s} onClick={() => setForm(p => ({ ...p, severity:s }))} style={{ flex:1, padding:'7px 0', borderRadius:8, border:'none', cursor:'pointer', fontSize:'.74rem', fontWeight:600, textTransform:'capitalize', fontFamily:'inherit', background: form.severity===s ? 'rgba(0,198,255,.2)' : 'rgba(26,58,92,.5)', color: form.severity===s ? '#00C6FF' : '#8EAFC2', borderBottom: form.severity===s ? '2px solid #00C6FF' : '2px solid transparent' }}>{s}</button>
                ))}
              </div>
            </div>
            <div><label className="form-label">Hospital Tier</label>
              <div style={{ display:'flex', gap:7 }}>
                {[{v:'government',l:'Govt'},{v:'mid',l:'Mid'},{v:'premium',l:'Premium'}].map(t => (
                  <button key={t.v} onClick={() => setForm(p => ({ ...p, hospitalTier:t.v }))} style={{ flex:1, padding:'7px 0', borderRadius:8, border:'none', cursor:'pointer', fontSize:'.74rem', fontWeight:600, fontFamily:'inherit', background: form.hospitalTier===t.v ? 'rgba(0,168,150,.2)' : 'rgba(26,58,92,.5)', color: form.hospitalTier===t.v ? '#00A896' : '#8EAFC2', borderBottom: form.hospitalTier===t.v ? '2px solid #00A896' : '2px solid transparent' }}>{t.l}</button>
                ))}
              </div>
            </div>
            <div><label className="form-label">Comorbidities</label>
              <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                {[{id:'diabetes',l:'Diabetes'},{id:'hypertension',l:'Hypertension'},{id:'obesity',l:'Obesity'},{id:'prior_cardiac',l:'Prior Cardiac'},{id:'prior_stroke',l:'Prior Stroke'}].map(c => {
                  const active = form.comorbidities.includes(c.id);
                  return <button key={c.id} onClick={() => toggleC(c.id)} style={{ padding:'3px 10px', borderRadius:6, border:`1px solid ${active ? '#FF8C42' : '#1A3A5C'}`, background: active ? 'rgba(255,140,66,.15)' : 'rgba(26,58,92,.4)', color: active ? '#FF8C42' : '#8EAFC2', cursor:'pointer', fontSize:'.71rem', fontWeight: active ? 600 : 400, fontFamily:'inherit', transition:'all .12s' }}>{c.l}</button>;
                })}
              </div>
            </div>
            <button className="btn-primary" onClick={() => fetchEstimate({ ...form, age: form.age ? parseInt(form.age) : undefined })} disabled={loading} style={{ justifyContent:'center', padding:11, width:'100%', marginTop:4 }}>
              <MdSend size={15} style={{ marginRight:6 }} />{loading ? 'Estimating…' : 'Estimate Cost'}
            </button>
            <div style={{ padding:'9px 11px', background:'rgba(0,114,177,.08)', border:'1px solid rgba(0,114,177,.2)', borderRadius:8 }}>
              <div style={{ fontSize:'.66rem', color:'#8EAFC2', fontWeight:600, marginBottom:3 }}>EXAMPLE</div>
              <div style={{ fontSize:'.68rem', color:'#C9E7F5', lineHeight:1.5 }}>Angioplasty · Nagpur · 58yrs · Diabetes → <strong style={{ color:'#2ECC71' }}>₹2.1L – ₹3.9L</strong></div>
            </div>
          </div>
        </div>

        {/* Result */}
        <div>
          {!estimate ? (
            <div className="glass-card" style={{ textAlign:'center', padding:'55px 40px' }}>
              <MdCalculate size={46} color="#1A3A5C" style={{ marginBottom:12 }} />
              <div style={{ color:'#8EAFC2', marginBottom:5 }}>Fill the form and click Estimate Cost</div>
              <div style={{ color:'#1A3A5C', fontSize:'.73rem' }}>Results include PM-JAY aligned breakdown, charts, and risk flags</div>
            </div>
          ) : loading ? <Shimmer n={2} h={120} /> : <CostBreakdownFull cost={estimate} />}
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// PROFILE PAGE
// ─────────────────────────────────────────────────────────────────
export function ProfilePage() {
  const { user, updateProfile, loading } = useAuthStore();
  const [form, setForm] = useState({ name: user?.name||'', phone: user?.phone||'', profile: { city: user?.profile?.city||'', age: user?.profile?.age||'', bloodGroup: user?.profile?.bloodGroup||'', comorbidities: user?.profile?.comorbidities||[] } });
  const sf = (k) => (e) => setForm(p => ({ ...p, [k]:e.target.value }));
  const sfp = (k) => (e) => setForm(p => ({ ...p, profile: { ...p.profile, [k]:e.target.value } }));
  const toggleC = (id) => setForm(p => ({ ...p, profile: { ...p.profile, comorbidities: p.profile.comorbidities.includes(id) ? p.profile.comorbidities.filter(c => c!==id) : [...p.profile.comorbidities, id] } }));

  const sty = { background:'#0D2137', border:'1px solid #1A3A5C', borderRadius:8, color:'#C9E7F5', padding:'9px 12px', fontSize:'.8rem', width:'100%', boxSizing:'border-box', outline:'none', fontFamily:'inherit' };

  return (
    <div className="page-enter" style={{ padding:'24px 28px', maxWidth:700, margin:'0 auto', width:'100%' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
        <div style={{ width:42, height:42, borderRadius:11, background:'linear-gradient(135deg,#0B3D6B,#0072B1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <MdPerson size={21} color="#00C6FF" />
        </div>
        <div><h1 style={{ margin:0, fontSize:'1.3rem', fontWeight:700, color:'#fff' }}>My Profile</h1></div>
      </div>

      {/* Avatar row */}
      <div className="glass-card" style={{ padding:20, marginBottom:18, display:'flex', alignItems:'center', gap:16 }}>
        <div style={{ width:56, height:56, borderRadius:'50%', background:'linear-gradient(135deg,#0072B1,#00C6FF)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', fontWeight:700, flexShrink:0 }}>{user?.name?.[0]}</div>
        <div>
          <div style={{ fontSize:'1.05rem', fontWeight:700, color:'#fff' }}>{user?.name}</div>
          <div style={{ fontSize:'.78rem', color:'#8EAFC2' }}>{user?.email}</div>
          <span style={{ fontSize:'.68rem', textTransform:'capitalize' }} className={user?.role === 'admin' ? 'pill-active' : 'badge badge-mid'}>{user?.role}</span>
        </div>
      </div>

      <div className="glass-card" style={{ padding:22 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14, marginBottom:14 }}>
          <div><label className="form-label">Full Name</label><input style={sty} value={form.name} onChange={sf('name')} /></div>
          <div><label className="form-label">Phone</label><input style={sty} value={form.phone} onChange={sf('phone')} placeholder="+91 98765 43210" /></div>
          <div><label className="form-label">City</label><input style={sty} value={form.profile.city} onChange={sfp('city')} placeholder="Nagpur" /></div>
          <div><label className="form-label">Age</label><input style={sty} type="number" value={form.profile.age} onChange={sfp('age')} placeholder="35" /></div>
          <div><label className="form-label">Blood Group</label>
            <select style={sty} value={form.profile.bloodGroup} onChange={sfp('bloodGroup')}>
              <option value="">Select</option>
              {['A+','A-','B+','B-','AB+','AB-','O+','O-'].map(g => <option key={g} value={g}>{g}</option>)}
            </select>
          </div>
        </div>
        <div style={{ marginBottom:16 }}>
          <label className="form-label">Known Comorbidities</label>
          <div style={{ display:'flex', flexWrap:'wrap', gap:7 }}>
            {[{id:'diabetes',l:'Diabetes'},{id:'hypertension',l:'Hypertension'},{id:'obesity',l:'Obesity'},{id:'prior_cardiac',l:'Prior Cardiac'}].map(c => {
              const active = form.profile.comorbidities.includes(c.id);
              return <button key={c.id} onClick={() => toggleC(c.id)} style={{ padding:'4px 12px', borderRadius:6, border:`1px solid ${active?'#FF8C42':'#1A3A5C'}`, background: active?'rgba(255,140,66,.15)':'rgba(26,58,92,.4)', color:active?'#FF8C42':'#8EAFC2', cursor:'pointer', fontSize:'.73rem', fontFamily:'inherit' }}>{c.l}</button>;
            })}
          </div>
        </div>
        <button className="btn-primary" onClick={() => updateProfile(form)} disabled={loading} style={{ display:'flex', alignItems:'center', gap:7 }}>
          <MdPerson size={15} />{loading ? 'Saving…' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────
// SAVED HOSPITALS
// ─────────────────────────────────────────────────────────────────
export function SavedPage() {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const saved = user?.savedHospitals || [];

  return (
    <div className="page-enter" style={{ padding:'24px 28px', maxWidth:900, margin:'0 auto', width:'100%' }}>
      <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:24 }}>
        <div style={{ width:42, height:42, borderRadius:11, background:'linear-gradient(135deg,#0B3D6B,#0072B1)', display:'flex', alignItems:'center', justifyContent:'center' }}>
          <MdBookmark size={21} color="#00C6FF" />
        </div>
        <div><h1 style={{ margin:0, fontSize:'1.3rem', fontWeight:700, color:'#fff' }}>Saved Hospitals</h1></div>
      </div>

      {saved.length === 0 ? (
        <div style={{ textAlign:'center', padding:'60px 20px' }}>
          <MdBookmark size={48} color="#1A3A5C" style={{ marginBottom:14 }} />
          <div style={{ color:'#8EAFC2', marginBottom:10 }}>No saved hospitals yet</div>
          <button className="btn-primary" onClick={() => navigate('/hospitals')} style={{ display:'inline-flex', alignItems:'center', gap:7 }}>
            <MdLocalHospital size={15} />Browse Hospitals
          </button>
        </div>
      ) : (
        <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
          {saved.map((h, i) => (
            <div key={h._id || i} style={{ background:'#0D2137', border:'1px solid #1A3A5C', borderRadius:11, padding:16, cursor:'pointer' }} onClick={() => navigate(`/hospitals/${h._id}`)}>
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <ScoreRing score={h.scores?.overall || 75} size={44} />
                <div style={{ flex:1 }}>
                  <div style={{ fontWeight:700, fontSize:'.92rem', color:'#fff', marginBottom:4 }}>{h.name || 'Hospital'}</div>
                  <div style={{ display:'flex', gap:6, flexWrap:'wrap' }}>
                    <TierBadge tier={h.tier} />
                    {h.accreditations?.slice(0,2).map(a => <AccreditBadge key={a} label={a} />)}
                  </div>
                </div>
                <MdArrowForward size={16} color="#1A3A5C" />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
