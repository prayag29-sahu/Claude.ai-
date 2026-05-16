const { validationResult } = require('express-validator');
const Booking = require('../models/Booking');
const Service = require('../models/Service');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
const createBooking = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }

    const { serviceId, eventDate, eventTime, location, guestCount, requirements, contactName, contactPhone, contactEmail } = req.body;

    const service = await Service.findById(serviceId);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    if (!service.isAvailable) {
      return res.status(400).json({ success: false, message: 'This service is currently unavailable.' });
    }

    // Basic conflict check for same date/service
    const conflictBooking = await Booking.findOne({
      service: serviceId,
      eventDate: new Date(eventDate),
      status: { $in: ['pending', 'confirmed', 'in-progress'] },
    });

    if (conflictBooking) {
      return res.status(400).json({ success: false, message: 'This service is already booked for the selected date.' });
    }

    const totalAmount = service.category === 'Catering' 
      ? service.price * (guestCount || 50) 
      : service.price;

    const booking = await Booking.create({
      user: req.user._id,
      service: serviceId,
      eventDate: new Date(eventDate),
      eventTime,
      location,
      guestCount,
      requirements,
      contactName,
      contactPhone,
      contactEmail,
      totalAmount,
      advanceAmount: Math.round(totalAmount * 0.3),
    });

    const populated = await booking.populate([
      { path: 'user', select: 'name email phone' },
      { path: 'service', select: 'title category price image' },
    ]);

    res.status(201).json({
      success: true,
      message: 'Booking created successfully! We will confirm shortly.',
      booking: populated,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's bookings
// @route   GET /api/bookings/user
// @access  Private
const getUserBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const query = { user: req.user._id };
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Booking.countDocuments(query);

    const bookings = await Booking.find(query)
      .populate('service', 'title category price image')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({ success: true, total, pages: Math.ceil(total / Number(limit)), bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Admin
const getAllBookings = async (req, res, next) => {
  try {
    const { status, page = 1, limit = 20 } = req.query;
    const query = {};
    if (status) query.status = status;

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Booking.countDocuments(query);

    const bookings = await Booking.find(query)
      .populate('user', 'name email phone')
      .populate('service', 'title category price image')
      .sort('-createdAt')
      .skip(skip)
      .limit(Number(limit));

    // Stats
    const stats = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
    ]);

    res.status(200).json({ success: true, total, pages: Math.ceil(total / Number(limit)), bookings, stats });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email phone')
      .populate('service', 'title category price image description features');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // Allow access to owner or admin
    if (booking.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Update booking status (admin)
// @route   PUT /api/bookings/:id/status
// @access  Admin
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, adminNotes, paymentStatus } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, adminNotes, paymentStatus },
      { new: true, runValidators: true }
    ).populate('user service');

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    res.status(200).json({ success: true, message: 'Booking updated!', booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking (user)
// @route   PUT /api/bookings/:id/cancel
// @access  Private
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    if (['completed', 'cancelled'].includes(booking.status)) {
      return res.status(400).json({ success: false, message: `Booking is already ${booking.status}.` });
    }

    booking.status = 'cancelled';
    await booking.save();

    res.status(200).json({ success: true, message: 'Booking cancelled successfully.', booking });
  } catch (error) {
    next(error);
  }
};

// @desc    Mock payment processing
// @route   POST /api/bookings/:id/pay
// @access  Private
const processPayment = async (req, res, next) => {
  try {
    const { amount, paymentMethod } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Access denied.' });
    }

    // Mock payment processing
    const mockPaymentId = `PAY-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;

    booking.paymentId = mockPaymentId;
    booking.advanceAmount = amount || booking.advanceAmount;

    if (booking.advanceAmount >= booking.totalAmount) {
      booking.paymentStatus = 'paid';
    } else if (booking.advanceAmount > 0) {
      booking.paymentStatus = 'partial';
    }

    await booking.save();

    res.status(200).json({
      success: true,
      message: 'Payment processed successfully!',
      paymentId: mockPaymentId,
      booking,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getAllBookings,
  getBooking,
  updateBookingStatus,
  cancelBooking,
  processPayment,
};
