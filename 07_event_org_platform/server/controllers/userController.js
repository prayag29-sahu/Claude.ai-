const User = require('../models/User');
const Booking = require('../models/Booking');

// @desc    Get all users (admin)
// @route   GET /api/users
// @access  Admin
const getAllUsers = async (req, res, next) => {
  try {
    const { page = 1, limit = 20, search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await User.countDocuments(query);
    const users = await User.find(query).sort('-createdAt').skip(skip).limit(Number(limit));

    res.status(200).json({ success: true, total, users });
  } catch (error) {
    next(error);
  }
};

// @desc    Toggle user active status
// @route   PUT /api/users/:id/toggle
// @access  Admin
const toggleUserStatus = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ success: false, message: 'User not found.' });
    if (user.role === 'admin') return res.status(400).json({ success: false, message: 'Cannot deactivate admin.' });

    user.isActive = !user.isActive;
    await user.save();

    res.status(200).json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}.`, user });
  } catch (error) {
    next(error);
  }
};

// @desc    Get admin dashboard stats
// @route   GET /api/users/stats
// @access  Admin
const getDashboardStats = async (req, res, next) => {
  try {
    const [totalUsers, totalBookings, revenueData, recentBookings] = await Promise.all([
      User.countDocuments({ role: 'user' }),
      Booking.countDocuments(),
      Booking.aggregate([
        { $match: { paymentStatus: { $in: ['partial', 'paid'] } } },
        { $group: { _id: null, total: { $sum: '$advanceAmount' } } },
      ]),
      Booking.find().populate('user', 'name').populate('service', 'title').sort('-createdAt').limit(5),
    ]);

    const bookingsByStatus = await Booking.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalBookings,
        totalRevenue: revenueData[0]?.total || 0,
        bookingsByStatus,
        recentBookings,
      },
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { getAllUsers, toggleUserStatus, getDashboardStats };
