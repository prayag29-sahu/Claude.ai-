const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
    },
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Service',
      required: [true, 'Service is required'],
    },
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
    },
    eventTime: {
      type: String,
      default: '10:00',
    },
    location: {
      address: { type: String, required: [true, 'Address is required'] },
      city: { type: String, required: [true, 'City is required'] },
      state: { type: String, default: '' },
      pincode: { type: String, default: '' },
    },
    guestCount: {
      type: Number,
      min: [1, 'Guest count must be at least 1'],
      default: 50,
    },
    requirements: {
      type: String,
      maxlength: [1000, 'Requirements cannot exceed 1000 characters'],
      default: '',
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    totalAmount: {
      type: Number,
      required: true,
    },
    advanceAmount: {
      type: Number,
      default: 0,
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'partial', 'paid'],
      default: 'unpaid',
    },
    paymentId: {
      type: String,
      default: '',
    },
    adminNotes: {
      type: String,
      default: '',
    },
    contactName: {
      type: String,
      required: [true, 'Contact name is required'],
    },
    contactPhone: {
      type: String,
      required: [true, 'Contact phone is required'],
    },
    contactEmail: {
      type: String,
      required: [true, 'Contact email is required'],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Booking', bookingSchema);
