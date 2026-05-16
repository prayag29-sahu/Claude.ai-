const mongoose = require('mongoose')

const bookingSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  eventType: { type: String, required: true },
  eventDate: { type: Date, required: true },
  location: String,
  budget: String,
  message: String,
  referenceImages: [{ url: String, publicId: String }],
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'completed'], default: 'pending' },
  package: { type: String, enum: ['essential', 'premium', 'luxury'] },
  totalAmount: Number,
  paidAmount: { type: Number, default: 0 },
  notes: String,
}, { timestamps: true })

module.exports = mongoose.model('Booking', bookingSchema)
