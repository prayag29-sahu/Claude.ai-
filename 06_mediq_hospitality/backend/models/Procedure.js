const mongoose = require('mongoose');

const procedureSchema = new mongoose.Schema({
  key:         { type: String, required: true, unique: true },  // e.g. 'angioplasty'
  name:        { type: String, required: true },
  nameHindi:   String,

  // Clinical coding (real standards)
  icd10:       { type: String, required: true },   // e.g. 'Z95.5'
  icd10Desc:   String,
  snomed:      String,
  pmjayCode:   String,   // PM-JAY package code e.g. 'C2001'
  pmjayPackageName: String,

  // Classification
  category:    { type: String, required: true },   // Cardiology, Orthopedics…
  subCategory: String,
  urgency:     { type: String, enum: ['elective','urgent','emergency'], default: 'elective' },
  isInpatient: { type: Boolean, default: true },
  isDayCare:   { type: Boolean, default: false },

  // PM-JAY government baseline rate (₹) — actual data from HBP 2.2
  pmjayBaseRate:    Number,    // Government package rate
  pmjayPrivateRate: Number,    // For private hospitals

  // Cost components (private market baseline — ₹)
  costComponents: {
    procedure:    { min: Number, max: Number },
    doctorFees:   { min: Number, max: Number },
    hospitalStay: { min: Number, max: Number },
    diagnostics:  { min: Number, max: Number },
    medicines:    { min: Number, max: Number },
    contingency:  { min: Number, max: Number },
  },

  // Average stay in days
  avgStayDays: { min: Number, max: Number },

  // Risk adjustments
  comorbidityRisk:    { type: Map, of: Number },
  severityMultiplier: { low: Number, moderate: Number, severe: Number },

  // Keywords for NLP matching
  keywords:   [String],
  symptoms:   [String],
  aliases:    [String],

  description: String,
  isActive: { type: Boolean, default: true },
}, { timestamps: true });

// key index already defined in schema field
procedureSchema.index({ category: 1 });
procedureSchema.index({ '$**': 'text' });

module.exports = mongoose.model('Procedure', procedureSchema);
