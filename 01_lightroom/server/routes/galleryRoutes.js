const router = require('express').Router()
const { getPublicGalleries, getMyGalleries, createGallery, deleteGallery } = require('../controllers/galleryController')
const { protect, restrictTo } = require('../middleware/authMiddleware')
const upload = require('../utils/upload')

router.get('/public', getPublicGalleries)
router.get('/my', protect, getMyGalleries)
router.post('/', protect, restrictTo('admin'), upload.fields([{ name: 'images', maxCount: 50 }]), createGallery)
router.delete('/:id', protect, restrictTo('admin'), deleteGallery)

module.exports = router
