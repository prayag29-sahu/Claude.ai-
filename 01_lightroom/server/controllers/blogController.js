const Blog = require('../models/Blog')
const { uploadImage } = require('../utils/cloudinary')

const slugify = (text) => text.toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'')

exports.getAllPosts = async (req, res) => {
  try {
    const filter = req.user?.role === 'admin' ? {} : { isPublished: true }
    const posts = await Blog.find(filter).populate('author', 'name').sort('-createdAt')
    res.json({ success: true, posts })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.getPostBySlug = async (req, res) => {
  try {
    const post = await Blog.findOneAndUpdate({ slug: req.params.slug }, { $inc: { views: 1 } }, { new: true }).populate('author', 'name')
    if (!post) return res.status(404).json({ message: 'Post not found' })
    res.json({ success: true, post })
  } catch (err) { res.status(400).json({ message: err.message }) }
}

exports.createPost = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, isPublished } = req.body
    const slug = slugify(title)
    let coverImage, coverImageId
    if (req.file) {
      const result = await uploadImage(req.file.path, 'lightroom/blog')
      coverImage = result.url; coverImageId = result.publicId
    }
    const post = await Blog.create({ title, slug, content, excerpt, category, tags: tags ? JSON.parse(tags) : [], isPublished, coverImage, coverImageId, author: req.user._id })
    res.status(201).json({ success: true, post })
  } catch (err) { res.status(400).json({ message: err.message }) }
}

exports.updatePost = async (req, res) => {
  try {
    const post = await Blog.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json({ success: true, post })
  } catch (err) { res.status(400).json({ message: err.message }) }
}

exports.deletePost = async (req, res) => {
  try {
    await Blog.findByIdAndDelete(req.params.id)
    res.json({ success: true, message: 'Post deleted' })
  } catch (err) { res.status(400).json({ message: err.message }) }
}
