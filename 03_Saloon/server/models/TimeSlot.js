const mongoose = require('mongoose');

const timeSlotSchema = new mongoose.Schema(
  {
    time: {
      type: String,
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    maxBookings: {
      type: Number,
      default: 3, // 3 barbers can work simultaneously
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TimeSlot', timeSlotSchema);
