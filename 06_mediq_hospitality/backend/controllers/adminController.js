const User     = require('../models/User');
const Hospital = require('../models/Hospital');
const Procedure= require('../models/Procedure');
const { Estimate, ChatSession, AuditLog } = require('../models/index');

// ── GET /api/admin/dashboard ──────────────────────────────────────
exports.getDashboard = async (req, res) => {
  try {
    const [totalUsers, totalHospitals, totalProcedures, totalEstimates,
           recentUsers, recentEstimates, cityBreakdown, tierBreakdown] = await Promise.all([
      User.countDocuments({ role: 'customer' }),
      Hospital.countDocuments({ isActive: true }),
      Procedure.countDocuments({ isActive: true }),
      Estimate.countDocuments({}),
      User.find({ role: 'customer' }).sort('-createdAt').limit(5).select('name email createdAt lastLogin profile.city'),
      Estimate.find().sort('-createdAt').limit(10).populate('user','name email'),
      Hospital.aggregate([{ $group: { _id: '$city', count: { $sum: 1 } } }, { $sort: { count: -1 } }]),
      Hospital.aggregate([{ $group: { _id: '$tier', count: { $sum: 1 } } }]),
    ]);

    // Estimates per procedure (top 5)
    const topProcedures = await Estimate.aggregate([
      { $group: { _id: '$procedure.key', count: { $sum: 1 }, avgCost: { $avg: '$result.total.midpoint' } } },
      { $sort: { count: -1 } }, { $limit: 5 },
    ]);

    // New users by day (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const userGrowth = await User.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo }, role: 'customer' } },
      { $group: { _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({
      success: true,
      stats: { totalUsers, totalHospitals, totalProcedures, totalEstimates },
      recentUsers,
      recentEstimates,
      cityBreakdown,
      tierBreakdown,
      topProcedures,
      userGrowth,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── GET /api/admin/users ──────────────────────────────────────────
exports.getUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, role, isActive } = req.query;
    const query = {};
    if (role)     query.role     = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (search)   query.$or = [
      { name:  new RegExp(search, 'i') },
      { email: new RegExp(search, 'i') },
    ];

    const total = await User.countDocuments(query);
    const users = await User.find(query).sort('-createdAt')
      .skip((page - 1) * limit).limit(parseInt(limit))
      .select('-refreshToken -passwordResetToken');

    res.json({ success: true, total, page: parseInt(page), pages: Math.ceil(total/limit), users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── PUT /api/admin/users/:id ──────────────────────────────────────
exports.updateUser = async (req, res) => {
  try {
    const { isActive, role } = req.body;
    const user = await User.findByIdAndUpdate(req.params.id, { isActive, role }, { new: true });
    if (!user) return res.status(404).json({ success: false, error: 'User not found' });
    await AuditLog?.create({ admin: req.user._id, action: 'UPDATE_USER', resource: 'User', resourceId: req.params.id, details: { isActive, role } }).catch(() => {});
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── GET /api/admin/analytics ──────────────────────────────────────
exports.getAnalytics = async (req, res) => {
  try {
    const [cityPricing, hospitalStats, procedureStats] = await Promise.all([
      Hospital.aggregate([{ $group: { _id: '$city', count: { $sum: 1 }, avgRating: { $avg: '$rating' }, pmjayCount: { $sum: { $cond: ['$pmjayEmpanelled', 1, 0] } } } }, { $sort: { count: -1 } }]),
      Hospital.aggregate([
        { $group: { _id: '$tier', count: { $sum: 1 }, avgRating: { $avg: '$rating' }, avgBeds: { $avg: '$totalBeds' } } },
      ]),
      Procedure.find({ isActive: true }).select('key name category pmjayBaseRate pmjayPrivateRate').lean(),
    ]);

    // NABH vs Non-NABH
    const nabh    = await Hospital.countDocuments({ accreditations: 'NABH', isActive: true });
    const nonNabh = await Hospital.countDocuments({ isActive: true }) - nabh;
    const pmjay   = await Hospital.countDocuments({ pmjayEmpanelled: true, isActive: true });

    res.json({
      success: true,
      cityDistribution: cityPricing,
      hospitalStats,
      procedureStats,
      quality: { nabh, nonNabh, pmjay, jci: await Hospital.countDocuments({ accreditations: 'JCI', isActive: true }) },
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

// ── GET /api/admin/audit ──────────────────────────────────────────
exports.getAuditLog = async (req, res) => {
  try {
    const logs = await AuditLog.find().sort('-createdAt').limit(100).populate('admin','name email');
    res.json({ success: true, logs });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
