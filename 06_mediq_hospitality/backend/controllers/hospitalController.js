const Hospital = require('../models/Hospital');
const Procedure = require('../models/Procedure');
const Fuse = require('fuse.js');
const { AuditLog } = require('../models/index');

// ── City pricing map (CGHS rate zones) ──────────────────────────
const CITY_PRICING = {
  'Mumbai':1.00,'Delhi':0.96,'Bangalore':0.93,'Chennai':0.88,
  'Hyderabad':0.84,'Pune':0.88,'Kolkata':0.82,'Nagpur':0.78,
  'Ahmedabad':0.80,'Jaipur':0.74,'Lucknow':0.70,'Bhopal':0.68,
  'Indore':0.70,'Chandigarh':0.76,'Patna':0.62,'Ranchi':0.60,
  'Raipur':0.63,'Aurangabad':0.68,'Vadodara':0.72,'Visakhapatnam':0.72,
};

// ── Score calculator ──────────────────────────────────────────────
function computeScore(h, procedureKey) {
  const procedureBonus = procedureKey && h.procedures?.includes(procedureKey) ? 15 : 0;
  const accreditBonus  = h.accreditations?.includes('JCI') ? 10 : h.accreditations?.includes('NABH') ? 7 : 0;
  const volumeScore    = { very_high:10, high:8, medium:5, low:2 }[h.procedureVolume] || 3;
  const pmjayBonus     = h.pmjayEmpanelled ? 5 : 0;
  const clinicalScore  = Math.min(procedureBonus + accreditBonus + volumeScore + pmjayBonus + Math.min((h.totalBeds||100)/50, 5), 35);

  const ratingScore    = ((( h.rating || 4) - 3) / 2) * 20;
  const reviewScore    = Math.min((h.reviewCount||0) / 500, 5);
  const sentimentScore = (h.sentimentScore || 0.75) * 5;
  const reputationScore= Math.min(ratingScore + reviewScore + sentimentScore, 30);

  const distScore      = h.distanceKm != null ? Math.max(0, 10 - h.distanceKm / 5) : 7;
  const bedScore       = Math.min((h.totalBeds||100) / 100, 5);
  const icuScore       = Math.min((h.icuBeds||20) / 20, 5);
  const accessScore    = Math.min(distScore + bedScore + icuScore, 20);

  const tierAfford = { budget:15, government:15, mid:10, premium:5, super_premium:2 }[h.tier] || 7;
  const affordScore = Math.min(tierAfford, 15);

  return Math.round(Math.min(clinicalScore + reputationScore + accessScore + affordScore, 100));
}

// ── GET /api/hospitals ────────────────────────────────────────────
exports.getHospitals = async (req, res) => {
  try {
    const { procedure, city, tier, accreditation, pmjay, budget, search, limit = 20, page = 1, sortBy = 'score' } = req.query;

    // Full-text search via Fuse.js on in-memory data for demo
    let hospitals;
    if (search) {
      const all = await Hospital.find({ isActive: true }).lean();
      const fuse = new Fuse(all, { keys: ['name','city','specializations','state'], threshold: 0.3 });
      hospitals = fuse.search(search).map(r => r.item);
    } else {
      const query = { isActive: true };
      if (city)      query.city          = new RegExp(city, 'i');
      if (tier)      query.tier          = tier;
      if (pmjay === 'true') query.pmjayEmpanelled = true;
      if (accreditation) query.accreditations = { $in: [accreditation.toUpperCase()] };
      if (procedure) query.procedures    = procedure;
      hospitals = await Hospital.find(query).lean();
    }

    // Add computed scores
    hospitals = hospitals.map(h => ({ ...h, computedScore: computeScore(h, procedure) }));

    // Budget filter (against procedure cost range)
    if (budget && procedure) {
      const b = parseInt(budget);
      hospitals = hospitals.filter(h => {
        const range = h.costRanges?.[procedure] || h.costRanges?.get?.(procedure);
        if (!range) return true;
        return (range.low || range.min || 0) <= b;
      });
    }

    // Sort
    if (sortBy === 'score') hospitals.sort((a, b) => b.computedScore - a.computedScore);
    else if (sortBy === 'rating') hospitals.sort((a, b) => b.rating - a.rating);
    else if (sortBy === 'cost_asc') hospitals.sort((a, b) => {
      const getRangeLow = (h) => {
        const r = h.costRanges?.[procedure] || h.costRanges?.get?.(procedure);
        return r ? (r.low || r.min || 999999) : 999999;
      };
      return getRangeLow(a) - getRangeLow(b);
    });

    // Paginate
    const total = hospitals.length;
    const paginated = hospitals.slice((page - 1) * limit, page * limit);
    const ranked = paginated.map((h, i) => ({ ...h, rank: (page - 1) * parseInt(limit) + i + 1 }));

    res.json({
      success: true,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
      hospitals: ranked,
      cityPricing: CITY_PRICING,
    });
  } catch (err) {
    console.error('[getHospitals]', err.message);
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── GET /api/hospitals/:id ────────────────────────────────────────
exports.getHospitalById = async (req, res) => {
  try {
    const hospital = await Hospital.findOne({
      $or: [{ _id: req.params.id }, { slug: req.params.id }],
      isActive: true,
    });
    if (!hospital) return res.status(404).json({ success: false, error: 'Hospital not found' });
    const obj = hospital.toObject();
    obj.computedScore = computeScore(obj, null);
    res.json({ success: true, hospital: obj });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── POST /api/hospitals — admin create ────────────────────────────
exports.createHospital = async (req, res) => {
  try {
    const hospital = await Hospital.create(req.body);
    await AuditLog?.create({ admin: req.user._id, action: 'CREATE_HOSPITAL', resource: 'Hospital', resourceId: hospital._id.toString(), details: { name: hospital.name } }).catch(() => {});
    res.status(201).json({ success: true, hospital });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ── PUT /api/hospitals/:id — admin update ─────────────────────────
exports.updateHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!hospital) return res.status(404).json({ success: false, error: 'Hospital not found' });
    await AuditLog?.create({ admin: req.user._id, action: 'UPDATE_HOSPITAL', resource: 'Hospital', resourceId: hospital._id.toString() }).catch(() => {});
    res.json({ success: true, hospital });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

// ── DELETE /api/hospitals/:id — admin soft delete ─────────────────
exports.deleteHospital = async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!hospital) return res.status(404).json({ success: false, error: 'Not found' });
    await AuditLog?.create({ admin: req.user._id, action: 'DELETE_HOSPITAL', resource: 'Hospital', resourceId: req.params.id }).catch(() => {});
    res.json({ success: true, message: 'Hospital removed' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── POST /api/hospitals/:id/review ────────────────────────────────
exports.addReview = async (req, res) => {
  try {
    const { rating, text } = req.body;
    if (!rating || !text) return res.status(400).json({ success: false, error: 'Rating and text required' });
    const hospital = await Hospital.findById(req.params.id);
    if (!hospital) return res.status(404).json({ success: false, error: 'Not found' });
    hospital.reviews.push({ user: req.user._id, author: req.user.name, rating, text, verified: true });
    // Recalculate avg rating
    const total = hospital.reviews.reduce((s, r) => s + r.rating, 0);
    hospital.rating = parseFloat((total / hospital.reviews.length).toFixed(1));
    hospital.reviewCount = hospital.reviews.length;
    await hospital.save();
    res.json({ success: true, message: 'Review added', rating: hospital.rating });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── GET /api/hospitals/cities ─────────────────────────────────────
exports.getCities = async (req, res) => {
  try {
    const cities = await Hospital.distinct('city');
    res.json({ success: true, cities: cities.sort(), cityPricing: CITY_PRICING });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

module.exports.CITY_PRICING = CITY_PRICING;
module.exports.computeScore = computeScore;
