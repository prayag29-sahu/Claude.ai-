const jwt = require('jsonwebtoken')
const User = require('../models/User')

const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN })

const sendTokenResponse = (user, statusCode, res) => {
  const token = signToken(user._id)
  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000
  })
  res.status(statusCode).json({ success: true, token, user })
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already registered' })
    const user = await User.create({ name, email, password, phone, role: 'client' })
    sendTokenResponse(user, 201, res)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password required' })
    const user = await User.findOne({ email }).select('+password')
    if (!user || !(await user.comparePassword(password))) return res.status(401).json({ message: 'Invalid credentials' })
    sendTokenResponse(user, 200, res)
  } catch (err) {
    res.status(400).json({ message: err.message })
  }
}

exports.logout = (req, res) => {
  res.cookie('token', 'logged_out', { httpOnly: true, expires: new Date(Date.now() + 5000) })
  res.status(200).json({ success: true, message: 'Logged out' })
}

exports.getMe = async (req, res) => {
  res.json({ success: true, user: req.user })
}
