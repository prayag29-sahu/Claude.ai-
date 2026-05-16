const mongoose = require('mongoose');

// ── Cost Estimate (saved) ─────────────────────────────────────────
const estimateSchema = new mongoose.Schema({
  user:         { type: mongoose.Schema.Types.ObjectId, ref: 'User', index: true },
  sessionId:    String,    // for anonymous users
  procedure:    { key: String, name: String, icd10: String },
  inputs: {
    city:          String,
    age:           Number,
    severity:      String,
    hospitalTier:  String,
    comorbidities: [String],
    budget:        Number,
  },
  result: {
    total:         { low: Number, high: Number, midpoint: Number },
    components:    mongoose.Schema.Types.Mixed,
    confidence:    Number,
    riskFlags:     [{ flag: String, impact: String }],
    multipliers:   mongoose.Schema.Types.Mixed,
  },
  hospitals:    [{ hospitalId: { type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' }, name: String, estimatedCost: { low: Number, high: Number } }],
  isShared:     { type: Boolean, default: false },
  shareToken:   String,
}, { timestamps: true });

// ── Chat Session ──────────────────────────────────────────────────
const chatSessionSchema = new mongoose.Schema({
  user:      { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  sessionId: { type: String, required: true, unique: true, index: true },
  messages:  [{
    role:      { type: String, enum: ['user', 'assistant'] },
    content:   String,
    parsed:    mongoose.Schema.Types.Mixed,
    hospitals: mongoose.Schema.Types.Mixed,
    cost:      mongoose.Schema.Types.Mixed,
    timestamp: { type: Date, default: Date.now },
  }],
  context: {
    city: String, budget: Number, age: Number,
    comorbidities: [String], lastProcedure: String,
  },
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// ── Admin Audit Log ────────────────────────────────────────────────
const auditLogSchema = new mongoose.Schema({
  admin:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action:   { type: String, required: true },   // 'CREATE_HOSPITAL', 'UPDATE_PROCEDURE', etc.
  resource: String,
  resourceId: String,
  details:  mongoose.Schema.Types.Mixed,
  ip:       String,
}, { timestamps: true });

module.exports = {
  Estimate:     mongoose.model('Estimate', estimateSchema),
  ChatSession:  mongoose.model('ChatSession', chatSessionSchema),
  AuditLog:     mongoose.model('AuditLog', auditLogSchema),
};
