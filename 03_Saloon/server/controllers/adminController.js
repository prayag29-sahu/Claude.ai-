const Booking = require('../models/Booking');
const User = require('../models/User');
const Service = require('../models/Service');
const { asyncHandler } = require('../middleware/errorHandler');

// @desc    Get admin dashboard analytics
// @route   GET /api/admin/analytics
// @access  Admin
exports.getAnalytics = asyncHandler(async (req, res) => {
  const [
    totalBookings,
    pendingBookings,
    approvedBookings,
    cancelledBookings,
    totalUsers,
    totalServices,
    revenueData,
    topServices,
  ] = await Promise.all([
    Booking.countDocuments(),
    Booking.countDocuments({ status: 'pending' }),
    Booking.countDocuments({ status: 'approved' }),
    Booking.countDocuments({ status: 'cancelled' }),
    User.countDocuments({ role: 'user' }),
    Service.countDocuments({ isActive: true }),
    // Revenue from completed/approved bookings
    Booking.aggregate([
      { $match: { status: { $in: ['approved', 'completed'] } } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } },
    ]),
    // Top services
    Booking.aggregate([
      { $match: { status: { $in: ['approved', 'completed'] } } },
      { $group: { _id: '$serviceId', count: { $sum: 1 }, revenue: { $sum: '$totalAmount' } } },
      { $sort: { count: -1 } },
      { $limit: 5 },
      { $lookup: { from: 'services', localField: '_id', foreignField: '_id', as: 'service' } },
      { $unwind: '$service' },
      { $project: { name: '$service.title', count: 1, revenue: 1 } },
    ]),
  ]);

  // Monthly revenue for the last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

  const monthlyRevenue = await Booking.aggregate([
    { $match: { status: { $in: ['approved', 'completed'] }, createdAt: { $gte: sixMonthsAgo } } },
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        revenue: { $sum: '$totalAmount' },
        bookings: { $sum: 1 },
      },
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
  ]);

  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const chartData = monthlyRevenue.map((m) => ({
    month: monthNames[m._id.month - 1],
    revenue: m.revenue,
    bookings: m.bookings,
  }));

  res.json({
    success: true,
    stats: {
      totalBookings,
      pendingBookings,
      approvedBookings,
      cancelledBookings,
      totalUsers,
      totalServices,
      totalRevenue: revenueData[0]?.total || 0,
    },
    chartData,
    topServices,
  });
});

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Admin
exports.getAllUsers = asyncHandler(async (req, res) => {
  const users = await User.find({ role: 'user' }).sort({ createdAt: -1 });
  res.json({ success: true, count: users.length, users });
});

// @desc    Toggle user status
// @route   PUT /api/admin/users/:id
// @access  Admin
exports.toggleUserStatus = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ success: false, message: 'User not found' });

  user.isActive = !user.isActive;
  await user.save();

  res.json({ success: true, message: `User ${user.isActive ? 'activated' : 'deactivated'}`, user });
});
