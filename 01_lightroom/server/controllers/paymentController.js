const Razorpay = require('razorpay')
const crypto = require('crypto')
const Booking = require('../models/Booking')

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
})

exports.createOrder = async (req, res) => {
  try {
    const { bookingId, amount } = req.body
    const order = await razorpay.orders.create({
      amount: amount * 100, currency: 'INR',
      receipt: `receipt_${bookingId}`,
      notes: { bookingId }
    })
    res.json({ success: true, order, key: process.env.RAZORPAY_KEY_ID })
  } catch (err) { res.status(500).json({ message: err.message }) }
}

exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, bookingId, amount } = req.body
    const body = razorpay_order_id + '|' + razorpay_payment_id
    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(body).digest('hex')

    if (expectedSignature !== razorpay_signature) return res.status(400).json({ message: 'Invalid payment signature' })

    await Booking.findByIdAndUpdate(bookingId, { $inc: { paidAmount: amount }, status: 'approved' })
    res.json({ success: true, message: 'Payment verified successfully' })
  } catch (err) { res.status(400).json({ message: err.message }) }
}
