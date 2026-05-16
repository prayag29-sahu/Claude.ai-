const express = require('express');
const router = express.Router();
const {
  getAvailableSlots, createBooking, getUserBookings,
  getAllBookings, updateBookingStatus, cancelBooking, getAnalytics
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/auth');

router.get('/slots', getAvailableSlots);
router.post('/', protect, createBooking);
router.get('/user', protect, getUserBookings);
router.get('/admin', protect, adminOnly, getAllBookings);
router.get('/analytics', protect, adminOnly, getAnalytics);
router.put('/:id/status', protect, adminOnly, updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);

module.exports = router;
