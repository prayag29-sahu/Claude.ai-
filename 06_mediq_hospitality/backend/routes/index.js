// ── Auth Routes ─────────────────────────────────────────────────
const express = require('express');
const authRouter = express.Router();
const auth = require('../controllers/authController');
const { protect } = require('../middleware/auth');

authRouter.post('/register',         auth.register);
authRouter.post('/login',            auth.login);
authRouter.post('/logout',           protect, auth.logout);
authRouter.get ('/me',               protect, auth.getMe);
authRouter.put ('/profile',          protect, auth.updateProfile);
authRouter.put ('/change-password',  protect, auth.changePassword);
authRouter.post('/refresh',          auth.refreshToken);
authRouter.post('/saved/:hospitalId',protect, auth.toggleSaveHospital);

// ── Hospital Routes ──────────────────────────────────────────────
const hospitalRouter = express.Router();
const hosp = require('../controllers/hospitalController');
const { adminOnly, optionalAuth } = require('../middleware/auth');

hospitalRouter.get ('/',             optionalAuth,  hosp.getHospitals);
hospitalRouter.get ('/cities',                      hosp.getCities);
hospitalRouter.get ('/:id',          optionalAuth,  hosp.getHospitalById);
hospitalRouter.post('/',             protect, adminOnly, hosp.createHospital);
hospitalRouter.put ('/:id',          protect, adminOnly, hosp.updateHospital);
hospitalRouter.delete('/:id',        protect, adminOnly, hosp.deleteHospital);
hospitalRouter.post('/:id/review',   protect,           hosp.addReview);

// ── Cost Routes ──────────────────────────────────────────────────
const costRouter = express.Router();
const cost = require('../controllers/costController');

costRouter.post('/estimate',  optionalAuth,  cost.estimate);
costRouter.post('/compare',   optionalAuth,  cost.compare);
costRouter.get ('/history',   protect,       cost.getHistory);

// ── Chat Routes ──────────────────────────────────────────────────
const chatRouter = express.Router();
const chat = require('../controllers/chatController');

chatRouter.post('/message',        optionalAuth, chat.sendMessage);
chatRouter.get ('/session/:id',    optionalAuth, chat.getSession);
chatRouter.get ('/suggestions',               chat.getSuggestions);

// ── Procedure Routes ─────────────────────────────────────────────
const procRouter = express.Router();
const Procedure = require('../models/Procedure');

procRouter.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const q = { isActive: true };
    if (category) q.category = new RegExp(category, 'i');
    const procs = await Procedure.find(q).lean();
    res.json({ success: true, total: procs.length, procedures: procs });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

procRouter.get('/:key', async (req, res) => {
  try {
    const p = await Procedure.findOne({ $or: [{ key: req.params.key }, { _id: req.params.key }], isActive: true });
    if (!p) return res.status(404).json({ success: false, error: 'Procedure not found' });
    res.json({ success: true, procedure: p });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

// ── Admin Routes ─────────────────────────────────────────────────
const adminRouter = express.Router();
const admin = require('../controllers/adminController');

adminRouter.use(protect, adminOnly);
adminRouter.get('/dashboard', admin.getDashboard);
adminRouter.get('/users',     admin.getUsers);
adminRouter.put('/users/:id', admin.updateUser);
adminRouter.get('/analytics', admin.getAnalytics);
adminRouter.get('/audit',     admin.getAuditLog);

// ── Procedures CRUD for admin ─────────────────────────────────────
adminRouter.post('/procedures', async (req, res) => {
  try {
    const p = await Procedure.create(req.body);
    res.status(201).json({ success: true, procedure: p });
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

adminRouter.put('/procedures/:id', async (req, res) => {
  try {
    const p = await Procedure.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json({ success: true, procedure: p });
  } catch (e) { res.status(400).json({ success: false, error: e.message }); }
});

// ── Analytics public summary ─────────────────────────────────────
const analyticsRouter = express.Router();
const Hospital  = require('../models/Hospital');

analyticsRouter.get('/summary', async (req, res) => {
  try {
    const [totalHospitals, totalProcedures, nabh, jci, pmjay, avgRatingRes] = await Promise.all([
      Hospital.countDocuments({ isActive: true }),
      Procedure.countDocuments({ isActive: true }),
      Hospital.countDocuments({ accreditations: 'NABH', isActive: true }),
      Hospital.countDocuments({ accreditations: 'JCI',  isActive: true }),
      Hospital.countDocuments({ pmjayEmpanelled: true,  isActive: true }),
      Hospital.aggregate([{ $group: { _id: null, avg: { $avg: '$rating' } } }]),
    ]);
    res.json({
      success: true,
      summary: {
        totalHospitals, totalProcedures,
        nabh, jci, pmjay,
        avgRating: avgRatingRes[0]?.avg?.toFixed(1) || '4.3',
        dataSource: 'PM-JAY HBP 2.2 · NABH portal · CGHS rate zones',
      },
    });
  } catch (e) { res.status(500).json({ success: false, error: e.message }); }
});

analyticsRouter.get('/cost-index', async (req, res) => {
  const { CITY_PRICING } = require('../controllers/hospitalController');
  const index = Object.entries(CITY_PRICING).map(([city, d]) => ({
    city, multiplier: d, tier: typeof d === 'object' ? d.tier : 2,
    relativeIndex: Math.round((typeof d === 'object' ? d.multiplier : d) * 100),
  })).sort((a, b) => b.relativeIndex - a.relativeIndex);
  res.json({ success: true, costIndex: index });
});

module.exports = { authRouter, hospitalRouter, costRouter, chatRouter, procRouter, adminRouter, analyticsRouter };
