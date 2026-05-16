/**
 * Run this script ONCE to create the admin user:
 *   node server/utils/createAdmin.js
 */
require('dotenv').config({ path: './config.env' })
const mongoose = require('mongoose')
const User = require('../models/User')

async function createAdmin() {
  await mongoose.connect(process.env.MONGODB_URI)
  const existing = await User.findOne({ email: 'admin@thelightroom.com' })
  if (existing) { console.log('Admin already exists'); process.exit(0) }
  const admin = await User.create({
    name: 'The Lightroom Admin',
    email: 'admin@thelightroom.com',
    password: 'Admin@12345',
    role: 'admin',
    phone: '+91 98765 43210'
  })
  console.log('✅ Admin created:', admin.email)
  console.log('📧 Email: admin@thelightroom.com')
  console.log('🔑 Password: Admin@12345')
  console.log('⚠️  Change the password after first login!')
  process.exit(0)
}

createAdmin().catch(err => { console.error(err); process.exit(1) })
