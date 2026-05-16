const router = require('express').Router()
const { getAllPosts, getPostBySlug, createPost, updatePost, deletePost } = require('../controllers/blogController')
const { protect, restrictTo } = require('../middleware/authMiddleware')
const upload = require('../utils/upload')

router.get('/', getAllPosts)
router.get('/:slug', getPostBySlug)
router.post('/', protect, restrictTo('admin'), upload.single('coverImage'), createPost)
router.patch('/:id', protect, restrictTo('admin'), updatePost)
router.delete('/:id', protect, restrictTo('admin'), deletePost)

module.exports = router
