const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Service title is required'],
      trim: true,
      maxlength: [100, 'Title cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['Tent', 'DJ', 'Catering', 'Decoration', 'Full Event', 'Photography', 'Other'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    priceUnit: {
      type: String,
      enum: ['per event', 'per plate', 'per day', 'per hour'],
      default: 'per event',
    },
    image: {
      type: String,
      default: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800',
    },
    imagePublicId: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    features: {
      type: [String],
      default: [],
    },
    capacity: {
      type: Number,
      default: 100,
    },
    isAvailable: {
      type: Boolean,
      default: true,
    },
    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },
    reviewCount: {
      type: Number,
      default: 0,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

// Index for search
serviceSchema.index({ title: 'text', description: 'text', category: 'text' });

module.exports = mongoose.model('Service', serviceSchema);
