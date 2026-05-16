const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  specialty:  { type: String, required: true },
  qualification: String,
  experience: Number,
  rating:     { type: Number, min: 0, max: 5, default: 4.0 },
  consultationFee: Number,
  availableDays: [String],
  imageUrl:   String,
});

const reviewSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  author:  String,
  rating:  { type: Number, min: 1, max: 5, required: true },
  text:    { type: String, required: true },
  helpful: { type: Number, default: 0 },
  verified:{ type: Boolean, default: false },
}, { timestamps: true });

const hospitalSchema = new mongoose.Schema({
  // Basic identity
  name:    { type: String, required: true, trim: true, index: true },
  slug:    { type: String, unique: true, index: true },
  type:    { type: String, enum: ['public','private','trust','clinic'], default: 'private' },
  tier:    { type: String, enum: ['super_premium','premium','mid','budget','government'], default: 'mid' },

  // Location
  address: { type: String, required: true },
  city:    { type: String, required: true, index: true },
  district:String,
  state:   { type: String, required: true },
  pincode: String,
  location: {
    type:        { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },  // [lng, lat]
  },
  phone:   [String],
  email:   String,
  website: String,

  // Accreditations (real: NABH, JCI, NABL, PMJAY)
  accreditations: [{ type: String, enum: ['NABH','JCI','NABL','ISO','PMJAY','CGHS','ESIC'] }],
  pmjayEmpanelled: { type: Boolean, default: false },
  pmjayHospitalId: String,   // From PM-JAY portal
  nabhaId:         String,   // From NABH portal

  // Specializations & procedures (ICD aligned)
  specializations: [String],
  procedures:      [String], // procedure keys

  // Capacity
  totalBeds:  Number,
  icuBeds:    Number,
  ventilators:Number,
  opd:        Boolean,
  emergency:  Boolean,

  // Quality scores (computed)
  scores: {
    clinical:      { type: Number, default: 70 },
    reputation:    { type: Number, default: 70 },
    accessibility: { type: Number, default: 70 },
    affordability: { type: Number, default: 70 },
    overall:       { type: Number, default: 70 },
  },

  rating:        { type: Number, min: 0, max: 5, default: 4.0 },
  reviewCount:   { type: Number, default: 0 },
  sentimentScore:{ type: Number, default: 0.75 },
  procedureVolume:{ type: String, enum: ['very_high','high','medium','low'], default: 'medium' },

  // Cost ranges (procedure-keyed) — sourced from PM-JAY + private benchmarks
  costRanges: { type: Map, of: new mongoose.Schema({ low: Number, high: Number }, { _id: false }) },

  // Source metadata
  dataSource:    { type: String, enum: ['pmjay','nabh','manual','scraped'], default: 'manual' },
  lastVerified:  Date,
  isActive:      { type: Boolean, default: true },
  isFeatured:    { type: Boolean, default: false },

  // Relations
  doctors: [doctorSchema],
  reviews: [reviewSchema],

  establishedYear: Number,
  imageUrl: String,
  images:  [String],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
});

// Geo index for location-based search
hospitalSchema.index({ location: '2dsphere' });
hospitalSchema.index({ city: 1, tier: 1 });
hospitalSchema.index({ name: 'text', city: 'text', specializations: 'text' });

// Slug middleware
hospitalSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') + '-' + Date.now();
  }
  next();
});

module.exports = mongoose.model('Hospital', hospitalSchema);
