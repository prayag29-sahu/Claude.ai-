const Booking = require('../models/Booking');
const Service = require('../models/Service');

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM', '11:00 AM', '11:30 AM',
  '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM',
  '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM',
];

exports.getAvailableSlots = async (req, res) => {
  try {
    const { date } = req.query;
    if (!date) return res.status(400).json({ success: false, message: 'Date required' });

    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const booked = await Booking.find({
      date: { $gte: start, $lte: end },
      status: { $ne: 'cancelled' },
    }).select('timeSlot');

    const bookedSlots = booked.map((b) => b.timeSlot);
    const available = TIME_SLOTS.filter((s) => !bookedSlots.includes(s));

    res.json({ success: true, slots: available, allSlots: TIME_SLOTS });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createBooking = async (req, res) => {
  try {
    const { serviceId, date, timeSlot, name, phone, email, paymentMethod, notes } = req.body;

    // Check slot availability
    const start = new Date(date);
    start.setHours(0, 0, 0, 0);
    const end = new Date(date);
    end.setHours(23, 59, 59, 999);

    const existing = await Booking.findOne({
      date: { $gte: start, $lte: end },
      timeSlot,
      status: { $ne: 'cancelled' },
    });

    if (existing) return res.status(409).json({ success: false, message: 'This time slot is already booked' });

    const booking = await Booking.create({
      userId: req.user.id,
      serviceId,
      date,
      timeSlot,
      name,
      phone,
      email,
      paymentMethod,
      notes,
    });

    await booking.populate(['userId', 'serviceId']);
    res.status(201).json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate('serviceId')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('userId', 'name email phone')
      .populate('serviceId', 'title category price')
      .sort({ createdAt: -1 });
    res.json({ success: true, bookings });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateBookingStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status }, { new: true })
      .populate('userId', 'name email')
      .populate('serviceId', 'title price');
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({ _id: req.params.id, userId: req.user.id });
    if (!booking) return res.status(404).json({ success: false, message: 'Booking not found' });
    if (booking.status === 'completed') return res.status(400).json({ success: false, message: 'Cannot cancel completed booking' });
    booking.status = 'cancelled';
    await booking.save();
    res.json({ success: true, booking });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAnalytics = async (req, res) => {
  try {
    const totalBookings = await Booking.countDocuments();
    const pending = await Booking.countDocuments({ status: 'pending' });
    const approved = await Booking.countDocuments({ status: 'approved' });
    const cancelled = await Booking.countDocuments({ status: 'cancelled' });
    const completed = await Booking.countDocuments({ status: 'completed' });

    // Revenue: sum price of approved/completed bookings
    const revenueData = await Booking.aggregate([
      { $match: { status: { $in: ['approved', 'completed'] } } },
      { $lookup: { from: 'services', localField: 'serviceId', foreignField: '_id', as: 'service' } },
      { $unwind: '$service' },
      { $group: { _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } }, revenue: { $sum: '$service.price' }, count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ]);

    res.json({ success: true, analytics: { totalBookings, pending, approved, cancelled, completed, revenueData } });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
