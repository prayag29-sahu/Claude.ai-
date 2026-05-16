const Gallery = require('../models/Gallery')
const { uploadImage, deleteImage } = require('../utils/cloudinary')

exports.getPublicGalleries = async (req, res) => {
  try {
    const { category } = req.query
    const filter = { isPrivate: false }
    if (category && category !== 'All') filter.category = category
    const galleries = await Gallery.find(filter).sort('-createdAt')
    res.json({ success: true, galleries })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.getMyGalleries = async (req, res) => {
  try {
    const galleries = await Gallery.find({ clientId: req.user._id })
    res.json({ success: true, galleries })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.createGallery = async (req, res) => {
  try {
    const { title, category, description, clientId, bookingId, isPrivate, isFeatured, location, year, tags } = req.body
    const images = []

    if (req.files?.images) {
      const files = Array.isArray(req.files.images) ? req.files.images : [req.files.images]
      for (const file of files) {
        const result = await uploadImage(file.path, `lightroom/gallery/${category}`)
        images.push(result)
      }
    }

    const gallery = await Gallery.create({ title, category, description, images, clientId, bookingId, isPrivate, isFeatured, location, year, tags: tags ? JSON.parse(tags) : [] })
    res.status(201).json({ success: true, gallery })
  } catch (err) { res.status(400).json({ message: err.message }) }
}

exports.deleteGallery = async (req, res) => {
  try {
    const gallery = await Gallery.findById(req.params.id)
    if (!gallery) return res.status(404).json({ message: 'Gallery not found' })
    for (const img of gallery.images) { if (img.publicId) await deleteImage(img.publicId) }
    await gallery.deleteOne()
    res.json({ success: true, message: 'Gallery deleted' })
  } catch (err) { res.status(400).json({ message: err.message }) }
}
