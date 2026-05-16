const express = require('express');
const { body } = require('express-validator');
const {
  getServices, getService, createService, updateService, deleteService, getCategories,
} = require('../controllers/serviceController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

let upload;
try {
  const cloudinaryConfig = require('../config/cloudinary');
  upload = cloudinaryConfig.upload;
} catch {
  const multer = require('multer');
  const path = require('path');
  const fs = require('fs');
  const uploadDir = path.join(__dirname, '../uploads');
  if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });
  const storage = multer.diskStorage({
    destination: uploadDir,
    filename: (req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
  });
  upload = multer({ storage });
}

const serviceValidation = [
  body('title').trim().isLength({ min: 3 }).withMessage('Title must be at least 3 characters'),
  body('category').isIn(['Tent', 'DJ', 'Catering', 'Decoration', 'Full Event', 'Photography', 'Other'])
    .withMessage('Invalid category'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('description').isLength({ min: 20 }).withMessage('Description must be at least 20 characters'),
];

router.get('/categories', getCategories);
router.get('/', getServices);
router.get('/:id', getService);
router.post('/', protect, adminOnly, upload.single('image'), serviceValidation, createService);
router.put('/:id', protect, adminOnly, upload.single('image'), updateService);
router.delete('/:id', protect, adminOnly, deleteService);

module.exports = router;
