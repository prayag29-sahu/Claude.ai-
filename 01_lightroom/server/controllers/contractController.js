const Contract = require('../models/Contract')
const Booking = require('../models/Booking')

exports.createContract = async (req, res) => {
  try {
    const { bookingId, signatureImage, termsText } = req.body
    const booking = await Booking.findById(bookingId)
    if (!booking) return res.status(404).json({ message: 'Booking not found' })

    const existing = await Contract.findOne({ bookingId })
    if (existing) return res.status(400).json({ message: 'Contract already exists for this booking' })

    const contract = await Contract.create({
      clientId: req.user._id,
      bookingId,
      termsText,
      signatureImage,
      clientName: req.user.name,
      clientEmail: req.user.email,
      eventDetails: `${booking.eventType} on ${new Date(booking.eventDate).toLocaleDateString()}`,
    })

    await Booking.findByIdAndUpdate(bookingId, { status: 'approved' })
    res.status(201).json({ success: true, contract })
  } catch (err) { res.status(400).json({ message: err.message }) }
}

exports.getContractByBooking = async (req, res) => {
  try {
    const contract = await Contract.findOne({ bookingId: req.params.bookingId })
    if (!contract) return res.status(404).json({ message: 'Contract not found' })
    res.json({ success: true, contract })
  } catch (err) { res.status(400).json({ message: err.message }) }
}
