const Procedure = require('../models/Procedure');
const Hospital  = require('../models/Hospital');
const { Estimate } = require('../models/index');
const { CITY_PRICING } = require('./hospitalController');

// ── Core estimation engine ────────────────────────────────────────
async function buildEstimate({ procedureKey, city, age, comorbidities = [], severity = 'moderate', hospitalTier = 'mid' }) {
  const proc = await Procedure.findOne({ key: procedureKey, isActive: true });
  if (!proc) return null;

  const geoMult = CITY_PRICING[city] || 0.80;
  const sevMult = proc.severityMultiplier?.[severity] || 1.0;

  // Comorbidity risk (from real data)
  let comorbMult = 1.0;
  for (const c of comorbidities) {
    const riskKey = c.toLowerCase().replace(/ /g,'_');
    const risk = proc.comorbidityRisk?.get?.(riskKey) || proc.comorbidityRisk?.[riskKey] || 0;
    comorbMult += risk;
  }

  // Age adjustment (CGHS tiered)
  const ageMult = (age >= 70) ? 1.18 : (age >= 60) ? 1.12 : (age >= 50) ? 1.05 : 1.0;

  // Hospital tier (private-market benchmarks)
  const tierMult = { government:0.40, budget:0.60, mid:1.0, premium:1.55, super_premium:2.10 }[hospitalTier] || 1.0;

  const totalMult = geoMult * sevMult * comorbMult * ageMult;

  const components = {};
  let totalLow = 0, totalHigh = 0;

  for (const [k, comp] of Object.entries(proc.costComponents?.toObject?.() || proc.costComponents || {})) {
    const isProc = k === 'procedure';
    const low  = Math.round((comp.min || 0) * totalMult * (isProc ? tierMult : 1.0));
    const high = Math.round((comp.max || comp.min * 1.6 || 0) * totalMult * (isProc ? tierMult : 1.0));
    components[k] = { label: LABELS[k] || k, low, high, midpoint: Math.round((low + high) / 2) };
    totalLow  += low;
    totalHigh += high;
  }

  // Percentages
  const midTotal = (totalLow + totalHigh) / 2;
  for (const k of Object.keys(components)) {
    const mid = (components[k].low + components[k].high) / 2;
    components[k].percentage = Math.round((mid / midTotal) * 100);
  }

  // Confidence score
  let confidence = 0.60;
  if (city && CITY_PRICING[city])       confidence += 0.12;
  if (age)                               confidence += 0.06;
  if (comorbidities.length > 0)          confidence += 0.06;
  if (severity !== 'moderate')           confidence += 0.04;
  confidence = Math.min(confidence, 0.92);

  // Risk flags
  const riskFlags = [];
  if (comorbidities.some(c => /diabetes/i.test(c)))     riskFlags.push({ flag: 'Diabetes', impact: `+${Math.round((proc.comorbidityRisk?.get?.('diabetes') || 0.10)*100)}% complication risk` });
  if (comorbidities.some(c => /hypertension/i.test(c))) riskFlags.push({ flag: 'Hypertension', impact: `+${Math.round((proc.comorbidityRisk?.get?.('hypertension') || 0.08)*100)}% anaesthesia risk` });
  if (comorbidities.some(c => /obesity/i.test(c)))      riskFlags.push({ flag: 'Obesity', impact: '+6-16% surgical complexity' });
  if (age >= 65)  riskFlags.push({ flag: 'Senior (65+)', impact: '+12-18% overall cost' });
  if (severity === 'severe') riskFlags.push({ flag: 'Severe condition', impact: `×${sevMult} severity multiplier` });

  return {
    procedureKey,
    procedureName:    proc.name,
    icd10:            proc.icd10,
    snomed:           proc.snomed,
    pmjayCode:        proc.pmjayCode,
    pmjayBaseRate:    proc.pmjayBaseRate,
    pmjayPrivateRate: proc.pmjayPrivateRate,
    city,
    components,
    total: { low: totalLow, high: totalHigh, midpoint: Math.round((totalLow + totalHigh) / 2) },
    confidence,
    riskFlags,
    multipliers: {
      geographic:   `${(geoMult * 100).toFixed(0)}% (${city || 'generic'})`,
      severity:     `×${sevMult} (${severity})`,
      comorbidity:  `+${((comorbMult - 1) * 100).toFixed(0)}%`,
      age:          `×${ageMult} (age ${age || '—'})`,
      hospitalTier: `×${tierMult} (${hospitalTier})`,
    },
    disclaimer: `Estimates based on PM-JAY HBP rates (${proc.pmjayCode}) adjusted for private market. Actual costs vary by hospital and individual case. Not a financial quotation.`,
    dataSource: 'PM-JAY HBP 2.2 + CGHS rate zones + private market benchmarks',
    generatedAt: new Date().toISOString(),
  };
}

const LABELS = {
  procedure:    'Procedure / Implant / Surgery',
  doctorFees:   'Doctor & Surgeon Fees',
  hospitalStay: 'Hospital Stay (Room & Board)',
  diagnostics:  'Diagnostics & Investigations',
  medicines:    'Medicines & Consumables',
  contingency:  'Contingency & Complications',
};

// ── POST /api/costs/estimate ──────────────────────────────────────
exports.estimate = async (req, res) => {
  try {
    const { procedureKey, city, age, comorbidities, severity, hospitalTier } = req.body;
    if (!procedureKey) return res.status(400).json({ success: false, error: 'procedureKey required' });

    const estimate = await buildEstimate({ procedureKey, city, age: age ? parseInt(age) : undefined, comorbidities: comorbidities || [], severity: severity || 'moderate', hospitalTier: hospitalTier || 'mid' });
    if (!estimate) return res.status(404).json({ success: false, error: 'Procedure not found', procedureKey });

    // Save for logged-in users
    if (req.user) {
      const proc = await Procedure.findOne({ key: procedureKey });
      await Estimate.create({
        user:      req.user._id,
        procedure: { key: procedureKey, name: proc?.name, icd10: proc?.icd10 },
        inputs:    { city, age, severity: severity||'moderate', hospitalTier: hospitalTier||'mid', comorbidities: comorbidities||[], budget: req.body.budget },
        result:    { total: estimate.total, components: estimate.components, confidence: estimate.confidence, riskFlags: estimate.riskFlags, multipliers: estimate.multipliers },
      }).catch(() => {});

      // Save search history
      await require('../models/User').findByIdAndUpdate(req.user._id, {
        $push: { searchHistory: { query: procedureKey, procedure: procedureKey, city: city, date: new Date() } },
      }).catch(() => {});
    }

    res.json({ success: true, estimate });
  } catch (err) {
    console.error('[estimate]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── POST /api/costs/compare ───────────────────────────────────────
exports.compare = async (req, res) => {
  try {
    const { procedureKey, city, age, comorbidities, severity } = req.body;
    if (!procedureKey) return res.status(400).json({ success: false, error: 'procedureKey required' });

    const hospitals = await Hospital.find({
      isActive: true, procedures: procedureKey,
      ...(city ? { city: new RegExp(city, 'i') } : {}),
    }).limit(8).lean();

    const comparisons = await Promise.all(hospitals.map(async h => {
      const est = await buildEstimate({
        procedureKey, city: h.city, age: age ? parseInt(age) : undefined,
        comorbidities: comorbidities || [], severity: severity || 'moderate',
        hospitalTier: h.tier,
      });
      // Override with hospital-specific range if available
      const hRange = h.costRanges?.[procedureKey] || h.costRanges?.get?.(procedureKey);
      if (hRange && est) {
        est.total.low = hRange.low; est.total.high = hRange.high;
        est.total.midpoint = Math.round((hRange.low + hRange.high) / 2);
      }
      return { hospital: h, estimate: est };
    }));

    res.json({ success: true, procedureKey, city, comparisons: comparisons.filter(c => c.estimate) });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── GET /api/costs/history ────────────────────────────────────────
exports.getHistory = async (req, res) => {
  try {
    const estimates = await Estimate.find({ user: req.user._id }).sort('-createdAt').limit(20);
    res.json({ success: true, estimates });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.buildEstimate = buildEstimate;
