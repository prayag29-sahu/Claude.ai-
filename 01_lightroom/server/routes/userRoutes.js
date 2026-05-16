const router = require('express').Router()
const User = require('../models/User')
const { protect, restrictTo } = require('../middleware/authMiddleware')

router.get('/', protect, restrictTo('admin'), async (req, res) => {
  try {
    const users = await User.find({ role: 'client' }).sort('-createdAt')
    res.json({ success: true, users })
  } catch (err) { res.status(500).json({ message: err.message }) }
})

router.patch('/profile', protect, async (req, res) => {
  try {
    const { name, phone } = req.body
    const user = await User.findByIdAndUpdate(req.user._id, { name, phone }, { new: true })
    res.json({ success: true, user })
  } catch (err) { res.status(400).json({ message: err.message }) }
})

module.exports = router
