const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    enum: ['Haircut', 'Beard', 'Color', 'Facial', 'Before-After', 'General'],
    default: 'General',
  },
  caption: String,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Gallery', gallerySchema);
