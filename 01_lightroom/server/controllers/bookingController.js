const Booking = require('../models/Booking')
const { uploadImage } = require('../utils/cloudinary')
const { sendBookingConfirmation } = require('../utils/email')

exports.createBooking = async (req, res) => {
  try {
    const { name, email, phone, eventType, eventDate, location, budget, message } = req.body
    const referenceImages = []

    if (req.files?.referenceImages) {
      const files = Array.isArray(req.files.referenceImages) ? req.files.referenceImages : [req.files.referenceImages]
      for (const file of files) {
        const result = await uploadImage(file.path, 'lightroom/bookings')
        referenceImages.push(result)
      }
    }

    const booking = await Booking.create({
      clientId: req.user?._id,
      name, email, phone, eventType, eventDate, location, budget, message, referenceImages
    })

    try { await sendBookingConfirmation(booking) } catch (emailErr) { console.error('Email failed:', emailErr) }
    res.status(201).json({ success: true, message: 'Booking submitted successfully', booking })
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find().populate('clientId', 'name email phone').sort('-createdAt')
    res.json({ success: true, bookings })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ $or: [{ clientId: req.user._id }, { email: req.user.email }] }).sort('-createdAt')
    res.json({ success: true, bookings })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.updateBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(req.params.id, { status: req.body.status }, { new: true })
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    res.json({ success: true, booking })
  } catch (err) { res.status(400).json({ message: err.message }) }
}

exports.getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate('clientId', 'name email phone')
    if (!booking) return res.status(404).json({ message: 'Booking not found' })
    res.json({ success: true, booking })
  } catch (err) { res.status(400).json({ message: err.message }) }
}
