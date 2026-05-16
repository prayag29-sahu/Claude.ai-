const mongoose = require('mongoose')

// ═══════════════════════════════════════════════
//  Gallery Schema
// ═══════════════════════════════════════════════
const gallerySchema = new mongoose.Schema({
  title:    { type: String, required: true },
  category: {
    type: String,
    enum: ['wedding','birthday','pre-wedding','bridal','events','fashion','baby','engagement'],
    required: true
  },
  images: [{
    url:      { type: String, required: true },
    publicId: { type: String },
    caption:  { type: String },
    location: { type: String },
    year:     { type: String },
  }],
  videos: [{
    url:        { type: String },
    thumbnail:  { type: String },
    publicId:   { type: String },
    title:      { type: String },
    duration:   { type: String },
  }],
  clientId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  bookingId:  { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
  isPrivate:  { type: Boolean, default: false },
  isFeatured: { type: Boolean, default: false },
  eventDate:  { type: Date },
  location:   { type: String },
}, { timestamps: true })

const Gallery = mongoose.model('Gallery', gallerySchema)

// ═══════════════════════════════════════════════
//  Blog Schema
// ═══════════════════════════════════════════════
const blogSchema = new mongoose.Schema({
  title:        { type: String, required: true },
  slug:         { type: String, unique: true },
  content:      { type: String, required: true },
  excerpt:      { type: String },
  coverImage:   { url: String, publicId: String },
  author:       { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  tags:         [{ type: String }],
  category:     { type: String },
  isPublished:  { type: Boolean, default: false },
  readTime:     { type: String },
  views:        { type: Number, default: 0 },
  metaTitle:    { type: String },
  metaDesc:     { type: String },
}, { timestamps: true })

blogSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
  }
  next()
})

const Blog = mongoose.model('Blog', blogSchema)

// ═══════════════════════════════════════════════
//  Testimonial Schema
// ═══════════════════════════════════════════════
const testimonialSchema = new mongoose.Schema({
  clientName:  { type: String, required: true },
  eventType:   { type: String },
  location:    { type: String },
  quote:       { type: String, required: true },
  rating:      { type: Number, default: 5, min: 1, max: 5 },
  avatar:      { type: String },
  isApproved:  { type: Boolean, default: false },
  isFeatured:  { type: Boolean, default: false },
}, { timestamps: true })

const Testimonial = mongoose.model('Testimonial', testimonialSchema)

// ═══════════════════════════════════════════════
//  Contact Schema
// ═══════════════════════════════════════════════
const contactSchema = new mongoose.Schema({
  name:    { type: String, required: true },
  email:   { type: String, required: true },
  phone:   { type: String },
  subject: { type: String },
  message: { type: String, required: true },
  isRead:  { type: Boolean, default: false },
}, { timestamps: true })

const Contact = mongoose.model('Contact', contactSchema)

module.exports = { Gallery, Blog, Testimonial, Contact }
