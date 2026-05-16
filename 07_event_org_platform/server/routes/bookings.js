const express = require('express');
const { body } = require('express-validator');
const {
  createBooking, getUserBookings, getAllBookings, getBooking,
  updateBookingStatus, cancelBooking, processPayment,
} = require('../controllers/bookingController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

const bookingValidation = [
  body('serviceId').notEmpty().withMessage('Service is required'),
  body('eventDate').isISO8601().withMessage('Valid event date is required'),
  body('location.address').notEmpty().withMessage('Address is required'),
  body('location.city').notEmpty().withMessage('City is required'),
  body('contactName').notEmpty().withMessage('Contact name is required'),
  body('contactPhone').matches(/^[0-9]{10}$/).withMessage('Valid 10-digit phone is required'),
  body('contactEmail').isEmail().withMessage('Valid email is required'),
];

router.post('/', protect, bookingValidation, createBooking);
router.get('/user', protect, getUserBookings);
router.get('/', protect, adminOnly, getAllBookings);
router.get('/:id', protect, getBooking);
router.put('/:id/status', protect, adminOnly, updateBookingStatus);
router.put('/:id/cancel', protect, cancelBooking);
router.post('/:id/pay', protect, processPayment);

module.exports = router;
