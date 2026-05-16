const Procedure  = require('../models/Procedure');
const Hospital   = require('../models/Hospital');
const { ChatSession } = require('../models/index');
const { buildEstimate } = require('./costController');
const { CITY_PRICING, computeScore } = require('./hospitalController');
const { v4: uuidv4 } = require('uuid');

// ── NLP Clinical Mapper ────────────────────────────────────────────
async function parseIntent(query, ctx = {}) {
  const text  = query.toLowerCase().trim();
  const result = {
    rawQuery:           query,
    detectedProcedure:  null,
    detectedCondition:  null,
    icd10: null, snomed: null, pmjayCode: null,
    detectedCity:       null,
    detectedBudget:     null,
    detectedAge:        ctx.age     || null,
    comorbidities:      ctx.comorbidities || [],
    severity:           ctx.severity || 'moderate',
    confidence:         0,
    intent:             'unknown',
    clinicalPathway:    [],
  };

  // 1. City detection
  for (const city of Object.keys(CITY_PRICING)) {
    if (text.includes(city.toLowerCase())) { result.detectedCity = city; break; }
  }
  const aliases = { 'new delhi':'Delhi','ncr':'Delhi','bengaluru':'Bangalore','bombay':'Mumbai','madras':'Chennai','calcutta':'Kolkata' };
  for (const [a, c] of Object.entries(aliases)) if (text.includes(a)) result.detectedCity = c;

  // 2. Budget extraction
  const bm = text.match(/(?:under|below|within|budget|₹|rs\.?|inr)\s*(\d+(?:\.\d+)?)\s*(?:l(?:akh)?|k(?:000)?)?/i);
  if (bm) {
    let v = parseFloat(bm[1]);
    if (/lakh|l\b/i.test(bm[0])) v *= 100000;
    else if (/\bk\b/i.test(bm[0])) v *= 1000;
    result.detectedBudget = Math.round(v);
  }

  // 3. Age
  const am = text.match(/(?:age|aged|years old|yr)\s*[:=]?\s*(\d{2,3})/i);
  if (am) result.detectedAge = parseInt(am[1]);
  else { const m2 = text.match(/\b(\d{2,3})\s*(?:year|yr|age)/i); if (m2) result.detectedAge = parseInt(m2[1]); }

  // 4. Comorbidities
  const comorbMap = [
    [/\bdiabet/i,'diabetes'], [/\bhypertens|bp|blood pressure/i,'hypertension'],
    [/\bobes/i,'obesity'],    [/prior cardiac|heart history|cardiac history/i,'prior_cardiac'],
    [/prior stroke|previous stroke/i,'prior_stroke'],
  ];
  for (const [rx, label] of comorbMap) if (rx.test(text)) result.comorbidities.push(label);

  // 5. Severity
  if (/severe|critical|emergency|serious/i.test(text))  result.severity = 'severe';
  else if (/mild|early|minor/i.test(text))               result.severity = 'mild';

  // 6. Procedure matching — use DB keywords
  const procedures = await Procedure.find({ isActive: true }).lean();
  let bestMatch = null, bestScore = 0;
  for (const p of procedures) {
    let score = 0;
    const kws = [...(p.keywords||[]), ...(p.symptoms||[]), ...(p.aliases||[])];
    for (const kw of kws) if (text.includes(kw.toLowerCase())) score += kw.length;
    if (score > bestScore) { bestScore = score; bestMatch = p; }
  }

  if (bestMatch) {
    result.detectedProcedure = bestMatch.key;
    result.detectedCondition = bestMatch.name;
    result.icd10             = bestMatch.icd10;
    result.snomed            = bestMatch.snomed;
    result.pmjayCode         = bestMatch.pmjayCode;
    result.intent            = 'procedure_discovery';
    result.confidence        = Math.min(0.50 + (bestScore / 80), 0.92);
    result.clinicalPathway   = buildPathway(bestMatch.key);
  }

  return result;
}

function buildPathway(key) {
  const paths = {
    angioplasty:      [{ step:1, action:'Cardiology Consultation', detail:'ECG, Echo, Stress Test evaluation' }, { step:2, action:'Coronary Angiography', detail:'Confirm blockage location and severity' }, { step:3, action:'PCI / Stent Placement', detail:'Catheter-based procedure (1-3 hrs)' }, { step:4, action:'Hospital Recovery', detail:'2-5 days monitoring, post-procedure care' }, { step:5, action:'Cardiac Rehab', detail:'Medication + lifestyle protocol' }],
    bypass_surgery:   [{ step:1, action:'Cardiac Surgery Evaluation', detail:'Full pre-operative assessment' }, { step:2, action:'Pre-operative Workup', detail:'Angiography, blood work, ECG, echo' }, { step:3, action:'CABG Surgery', detail:'Open-heart procedure under GA (4-6 hrs)' }, { step:4, action:'ICU Care', detail:'2-4 days intensive monitoring' }, { step:5, action:'Ward & Discharge', detail:'Total 10-14 days, cardiac rehab begins' }],
    knee_replacement: [{ step:1, action:'Orthopedic Consultation', detail:'X-ray, MRI, joint assessment' }, { step:2, action:'Pre-operative Preparation', detail:'Blood tests, physiotherapy eval' }, { step:3, action:'TKR Surgery', detail:'2-3 hours under spinal/GA' }, { step:4, action:'Post-op Recovery', detail:'4-7 days, physiotherapy starts day 1' }, { step:5, action:'Outpatient Rehab', detail:'6-week physiotherapy program' }],
    dialysis:         [{ step:1, action:'Nephrology Consultation', detail:'Creatinine, GFR assessment' }, { step:2, action:'Vascular Access', detail:'AV fistula or catheter placement' }, { step:3, action:'Regular Sessions', detail:'3 sessions/week, 4 hours each' }, { step:4, action:'Monitoring', detail:'Monthly labs, diet management' }, { step:5, action:'Transplant Evaluation', detail:'Assess eligibility for kidney transplant' }],
  };
  return paths[key] || [{ step:1, action:'Specialist Consultation', detail:'Initial evaluation and diagnosis' }, { step:2, action:'Investigations', detail:'Required diagnostic tests' }, { step:3, action:'Treatment', detail:'Procedure / therapy' }, { step:4, action:'Recovery', detail:'Hospital stay and monitoring' }, { step:5, action:'Follow-up', detail:'Post-treatment care plan' }];
}

// ── POST /api/chat/message ────────────────────────────────────────
exports.sendMessage = async (req, res) => {
  try {
    const { message, sessionId, context = {} } = req.body;
    if (!message?.trim()) return res.status(400).json({ success: false, error: 'Message required' });

    const sid = sessionId || uuidv4();

    // Get or create DB session
    let session = await ChatSession.findOne({ sessionId: sid });
    if (!session) {
      session = await ChatSession.create({
        sessionId: sid, user: req.user?._id,
        messages: [], context: {},
      });
    }

    // Merge context
    const mergedCtx = { ...session.context.toObject?.() || session.context, ...context };
    const parsed = await parseIntent(message, mergedCtx);

    // Update session context
    if (parsed.detectedCity)        session.context.city           = parsed.detectedCity;
    if (parsed.detectedBudget)      session.context.budget         = parsed.detectedBudget;
    if (parsed.detectedAge)         session.context.age            = parsed.detectedAge;
    if (parsed.comorbidities.length) session.context.comorbidities  = parsed.comorbidities;
    if (parsed.detectedProcedure)   session.context.lastProcedure  = parsed.detectedProcedure;

    // Rank hospitals
    const hQuery = { isActive: true };
    if (parsed.detectedProcedure) hQuery.procedures = parsed.detectedProcedure;
    if (parsed.detectedCity)      hQuery.city = new RegExp(parsed.detectedCity, 'i');
    let hospitals = await Hospital.find(hQuery).limit(6).lean();
    hospitals = hospitals.map(h => ({ ...h, computedScore: computeScore(h, parsed.detectedProcedure) })).sort((a,b) => b.computedScore - a.computedScore).map((h,i) => ({ ...h, rank: i+1 }));

    // Cost estimate
    let costEstimate = null;
    if (parsed.detectedProcedure) {
      costEstimate = await buildEstimate({
        procedureKey:  parsed.detectedProcedure,
        city:          parsed.detectedCity || mergedCtx.city || 'Mumbai',
        age:           parsed.detectedAge  || mergedCtx.age,
        comorbidities: parsed.comorbidities.length ? parsed.comorbidities : (mergedCtx.comorbidities || []),
        severity:      parsed.severity || 'moderate',
        hospitalTier:  'mid',
      });
    }

    // Build AI response
    const aiResponse = buildResponse(parsed, hospitals, costEstimate);

    // Persist messages
    session.messages.push({ role:'user', content:message, timestamp:new Date() });
    session.messages.push({ role:'assistant', content:aiResponse.message, parsed, hospitals: hospitals.slice(0,3), cost: costEstimate, timestamp:new Date() });
    await session.save();

    res.json({
      success: true, sessionId: sid,
      response: aiResponse, parsed, hospitals, costEstimate,
      metadata: { model:'MedIQ-NLP-v2', icd10: parsed.icd10, pmjayCode: parsed.pmjayCode, dataSource:'PM-JAY HBP + NABH + CGHS' },
    });
  } catch (err) {
    console.error('[chat]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

function buildResponse(parsed, hospitals, cost) {
  if (!parsed.detectedProcedure) {
    return {
      type: 'clarification',
      message: "I can help you find the right hospital and estimate treatment costs. Please describe your condition, the procedure you need, or search by symptoms.\n\nFor example: *\"angioplasty in Nagpur under ₹3 lakh, age 58, diabetic\"*",
      suggestions: ['Angioplasty / Heart Stent','Bypass Surgery (CABG)','Knee Replacement','Kidney Dialysis','Chemotherapy (Cancer)','Cataract Surgery','Normal Delivery / C-Section'],
    };
  }

  const cityStr   = parsed.detectedCity   ? ` in **${parsed.detectedCity}**` : '';
  const budgetStr = parsed.detectedBudget ? ` under **₹${(parsed.detectedBudget/100000).toFixed(1)}L**` : '';
  const comorbStr = parsed.comorbidities.length ? `\n\n⚠️ Comorbidities noted: **${parsed.comorbidities.join(', ')}** — cost adjusted accordingly.` : '';

  let msg = `Mapped to **${parsed.detectedCondition}** (ICD-10: \`${parsed.icd10}\` · PM-JAY: \`${parsed.pmjayCode || 'N/A'}\`)${cityStr}${budgetStr}.\n\n`;
  msg += `Found **${hospitals.length} hospitals** ranked by clinical capability, reputation, and affordability.\n\n`;

  if (cost) {
    msg += `Estimated cost: **₹${(cost.total.low/100000).toFixed(1)}L – ₹${(cost.total.high/100000).toFixed(1)}L** · Confidence: **${(parsed.confidence*100).toFixed(0)}%**`;
  }
  msg += comorbStr;

  return {
    type: 'result',
    message: msg,
    procedure: { key: parsed.detectedProcedure, name: parsed.detectedCondition, icd10: parsed.icd10, pmjayCode: parsed.pmjayCode },
    clinicalPathway: parsed.clinicalPathway,
    disclaimer: 'This is decision support, not medical advice. Consult a qualified physician before making treatment decisions.',
  };
}

// ── GET /api/chat/session/:id ─────────────────────────────────────
exports.getSession = async (req, res) => {
  try {
    const session = await ChatSession.findOne({ sessionId: req.params.id });
    if (!session) return res.status(404).json({ success: false, error: 'Session not found' });
    res.json({ success: true, session });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── GET /api/chat/suggestions ─────────────────────────────────────
exports.getSuggestions = async (req, res) => {
  res.json({
    success: true,
    suggestions: [
      'Angioplasty in Nagpur under ₹3 lakh, age 58, diabetic',
      'Best cancer hospital Mumbai chemotherapy',
      'Knee replacement Pune ₹2.5 lakh',
      'Kidney dialysis cost Hyderabad',
      'Bypass surgery Delhi age 65 hypertension',
      'Cataract surgery Jaipur affordable',
      'Normal delivery hospital Bangalore',
    ],
  });
};
