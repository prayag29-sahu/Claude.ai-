require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('./db');
const User = require('../models/User');
const Service = require('../models/Service');

const seedData = async () => {
  await connectDB();

  // Clear existing data
  await User.deleteMany({});
  await Service.deleteMany({});

  console.log('🗑️  Cleared existing data');

  // Create admin user
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await User.create({
    name: 'Admin User',
    email: 'admin@eventplatform.com',
    password: adminPassword,
    role: 'admin',
    phone: '9876543210',
  });

  // Create test users
  const userPassword = await bcrypt.hash('User@123', 12);
  await User.create([
    {
      name: 'Rajesh Kumar',
      email: 'rajesh@example.com',
      password: userPassword,
      role: 'user',
      phone: '9876543211',
    },
    {
      name: 'Priya Sharma',
      email: 'priya@example.com',
      password: userPassword,
      role: 'user',
      phone: '9876543212',
    },
  ]);

  console.log('👥 Users created');

  // Create services
  await Service.create([
    {
      title: 'Royal Tent House',
      category: 'Tent',
      price: 25000,
      image: 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800',
      description: 'Luxurious royal tents with intricate embroidery, chandeliers, and full climate control. Perfect for outdoor weddings and large gatherings.',
      features: ['Climate Controlled', 'LED Lighting', 'Seating for 500+', 'Carpet Flooring', 'Side Drapes'],
      capacity: 500,
      isAvailable: true,
      rating: 4.8,
      reviewCount: 124,
    },
    {
      title: 'Premium DJ Setup',
      category: 'DJ',
      price: 15000,
      image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800',
      description: 'Professional DJ with state-of-the-art sound systems, laser lights, fog machines and a curated playlist for every mood.',
      features: ['Professional DJ', 'Laser Lights', 'Fog Machine', 'LED Wall', 'Custom Playlist'],
      capacity: 1000,
      isAvailable: true,
      rating: 4.9,
      reviewCount: 89,
    },
    {
      title: 'Grand Catering Service',
      category: 'Catering',
      price: 800,
      image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800',
      description: 'Multi-cuisine catering with live counters, experienced chefs, and impeccable service. Price per plate includes starter, main course and desserts.',
      features: ['Multi-Cuisine', 'Live Counters', 'Experienced Chefs', 'Hygienic Preparation', 'Premium Crockery'],
      capacity: 1000,
      isAvailable: true,
      rating: 4.7,
      reviewCount: 203,
    },
    {
      title: 'Floral & Thematic Decoration',
      category: 'Decoration',
      price: 35000,
      image: 'https://images.unsplash.com/photo-1478146059778-26ede37e3e4e?w=800',
      description: 'Breathtaking floral arrangements and thematic decorations tailored to your vision. From royal Indian to modern minimalist.',
      features: ['Custom Theme', 'Fresh Flowers', 'Backdrop Design', 'Table Centerpieces', 'Entrance Arch'],
      capacity: 300,
      isAvailable: true,
      rating: 4.9,
      reviewCount: 156,
    },
    {
      title: 'Complete Wedding Package',
      category: 'Full Event',
      price: 250000,
      image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800',
      description: 'All-inclusive wedding management — from invitations to final farewell. We handle everything so you can enjoy your special day.',
      features: ['End-to-End Management', 'Dedicated Event Manager', 'Vendor Coordination', 'Photography', 'Honeymoon Planning'],
      capacity: 500,
      isAvailable: true,
      rating: 5.0,
      reviewCount: 67,
    },
    {
      title: 'Corporate Event Setup',
      category: 'Full Event',
      price: 80000,
      image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800',
      description: 'Professional corporate event management including AV setup, stage design, branding and guest management.',
      features: ['AV Equipment', 'Stage Setup', 'Branding & Banners', 'Registration Desk', 'Breakout Zones'],
      capacity: 300,
      isAvailable: true,
      rating: 4.8,
      reviewCount: 45,
    },
    {
      title: 'Kids Birthday Package',
      category: 'Decoration',
      price: 12000,
      image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?w=800',
      description: 'Magical birthday setups for kids with themed decorations, balloon art, and entertainment arrangements.',
      features: ['Themed Decoration', 'Balloon Art', 'Photo Booth', 'Return Gift Setup', 'Entertainment'],
      capacity: 100,
      isAvailable: true,
      rating: 4.6,
      reviewCount: 92,
    },
    {
      title: 'Basic Sound System',
      category: 'DJ',
      price: 8000,
      image: 'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800',
      description: 'High-quality PA sound system for small to medium events. Includes speakers, microphones, and basic lighting.',
      features: ['PA System', 'Microphones', 'Basic Lighting', 'Technician Support', '8-hour Service'],
      capacity: 200,
      isAvailable: true,
      rating: 4.5,
      reviewCount: 78,
    },
  ]);

  console.log('🎪 Services created');
  console.log('\n✅ Database seeded successfully!\n');
  console.log('📧 Admin Login: admin@eventplatform.com | Password: Admin@123');
  console.log('📧 User Login:  rajesh@example.com     | Password: User@123');

  process.exit(0);
};

seedData().catch((err) => {
  console.error('❌ Seed error:', err);
  process.exit(1);
});
