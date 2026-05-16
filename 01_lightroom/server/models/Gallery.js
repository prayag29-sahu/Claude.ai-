const mongoose = require('mongoose')

const gallerySchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: {
    type: String,
    required: true,
    enum: ['Wedding', 'Birthday', 'Pre-Wedding', 'Engagement', 'Events', 'Fashion', 'Baby Shoot', 'Bridal']
  },
  description: String,
  images: [{ url: String, publicId: String, caption: String }],
  videos: [{ url: String, publicId: String, thumbnail: String, title: String }],
  clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bookingId: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  isPrivate: { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  location: String,
  year: { type: Number, default: () => new Date().getFullYear() },
  tags: [String],
}, { timestamps: true })

module.exports = mongoose.model('Gallery', gallerySchema)
