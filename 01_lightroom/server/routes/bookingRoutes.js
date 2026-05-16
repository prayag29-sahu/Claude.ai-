const router = require('express').Router()
const { createBooking, getAllBookings, getMyBookings, updateBookingStatus, getBookingById } = require('../controllers/bookingController')
const { protect, restrictTo } = require('../middleware/authMiddleware')
const upload = require('../utils/upload')

router.post('/', upload.fields([{ name: 'referenceImages', maxCount: 10 }]), createBooking)
router.get('/my', protect, getMyBookings)
router.get('/', protect, restrictTo('admin'), getAllBookings)
router.get('/:id', protect, getBookingById)
router.patch('/:id/status', protect, restrictTo('admin'), updateBookingStatus)

module.exports = router
