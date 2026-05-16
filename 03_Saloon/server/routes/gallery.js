const express = require('express');
const router = express.Router();
const { getGallery, addImage, deleteImage } = require('../controllers/galleryController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/', getGallery);
router.post('/', protect, adminOnly, addImage);
router.delete('/:id', protect, adminOnly, deleteImage);

module.exports = router;
