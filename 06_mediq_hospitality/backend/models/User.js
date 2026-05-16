const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true, minlength: 6, select: false },
  phone:    { type: String, trim: true },
  role:     { type: String, enum: ['customer', 'admin', 'superadmin'], default: 'customer' },
  isActive: { type: Boolean, default: true },
  isEmailVerified: { type: Boolean, default: false },
  avatar:   { type: String },

  // Customer-specific profile
  profile: {
    age:       Number,
    gender:    { type: String, enum: ['male', 'female', 'other'] },
    city:      String,
    pincode:   String,
    bloodGroup:String,
    comorbidities: [String],   // ['diabetes','hypertension']
    insuranceProvider: String,
    insurancePolicyNo: String,
  },

  // Saved items
  savedHospitals:  [{ type: mongoose.Schema.Types.ObjectId, ref: 'Hospital' }],
  searchHistory:   [{ query: String, procedure: String, city: String, date: { type: Date, default: Date.now } }],

  // Auth tokens
  refreshToken:    { type: String, select: false },
  passwordResetToken: { type: String, select: false },
  passwordResetExpires: { type: Date, select: false },

  lastLogin: Date,
  loginCount: { type: Number, default: 0 },
}, { timestamps: true });

// Hash password before save
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare passwords
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

// Remove sensitive fields from JSON output
userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  delete obj.refreshToken;
  delete obj.passwordResetToken;
  delete obj.passwordResetExpires;
  return obj;
};

module.exports = mongoose.model('User', userSchema);
