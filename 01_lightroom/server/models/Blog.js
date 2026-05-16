const mongoose = require('mongoose')

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  content: { type: String, required: true },
  excerpt: String,
  coverImage: String,
  coverImageId: String,
  category: String,
  tags: [String],
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isPublished: { type: Boolean, default: false },
  readTime: Number,
  views: { type: Number, default: 0 },
}, { timestamps: true })

blogSchema.pre('save', function(next) {
  if (this.content) {
    const words = this.content.split(' ').length
    this.readTime = Math.ceil(words / 200)
  }
  next()
})

module.exports = mongoose.model('Blog', blogSchema)
