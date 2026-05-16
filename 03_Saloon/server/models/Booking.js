const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  serviceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Service',
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  timeSlot: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'cancelled', 'completed'],
    default: 'pending',
  },
  paymentMethod: {
    type: String,
    enum: ['cash', 'online'],
    default: 'cash',
  },
  name: String,
  phone: String,
  email: String,
  notes: String,
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Prevent double booking
bookingSchema.index({ date: 1, timeSlot: 1 }, { unique: false });

module.exports = mongoose.model('Booking', bookingSchema);
