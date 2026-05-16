const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const helmet = require('helmet')
const morgan = require('morgan')
const cookieParser = require('cookie-parser')
const rateLimit = require('express-rate-limit')
require('dotenv').config({ path: './config.env' })

const app = express()

// Middleware
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }))
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }))
app.use(morgan('dev'))
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// Rate limiting
const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: 'Too many requests' })
app.use('/api', limiter)

// Routes
app.use('/api/auth', require('./routes/authRoutes'))
app.use('/api/bookings', require('./routes/bookingRoutes'))
app.use('/api/gallery', require('./routes/galleryRoutes'))
app.use('/api/contracts', require('./routes/contractRoutes'))
app.use('/api/blog', require('./routes/blogRoutes'))
app.use('/api/payment', require('./routes/paymentRoutes'))
app.use('/api/users', require('./routes/userRoutes'))
app.use('/api/contact', require('./routes/contactRoutes'))

// Health check
app.get('/api/health', (req, res) => res.json({ status: 'OK', message: 'The Lightroom API is running' }))

// 404
app.use('*', (req, res) => res.status(404).json({ message: 'Route not found' }))

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(err.status || 500).json({ message: err.message || 'Internal server error' })
})

// Connect DB
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected')
    app.listen(process.env.PORT || 5000, () => console.log(`🚀 Server running on port ${process.env.PORT || 5000}`))
  })
  .catch(err => { console.error('❌ MongoDB connection failed:', err); process.exit(1) })
