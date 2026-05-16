const mongoose = require('mongoose')

const contractSchema = new mongoose.Schema({
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  termsText: { type: String, required: true },
  signatureImage: { type: String, required: true },
  clientName: String,
  clientEmail: String,
  eventDetails: String,
  status: { type: String, enum: ['pending', 'signed', 'expired'], default: 'signed' },
  pdfUrl: String,
  signedAt: { type: Date, default: Date.now },
}, { timestamps: true })

module.exports = mongoose.model('Contract', contractSchema)
