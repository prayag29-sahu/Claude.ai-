require('dotenv').config();
const mongoose = require('mongoose');
const Service = require('../models/Service');
const User = require('../models/User');
const Gallery = require('../models/Gallery');

const services = [
  { title: 'Classic Haircut', category: 'Haircut', description: 'Precision scissor cut with hot towel finish. Our signature style tailored to your face shape.', price: 299, duration: 30, image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=400' },
  { title: 'Fade & Taper', category: 'Haircut', description: 'Low, mid or high fade with clean taper. Perfect gradient from skin to length.', price: 399, duration: 45, image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=400' },
  { title: 'Kids Haircut', category: 'Haircut', description: 'Gentle haircut for boys under 12. Patient, fun experience in a kid-friendly setting.', price: 199, duration: 20, image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400' },
  { title: 'Beard Trim & Shape', category: 'Beard Styling', description: 'Clean line-up with precision trim. Defines your beard to enhance your facial features.', price: 199, duration: 20, image: 'https://images.unsplash.com/photo-1621605815971-fbc98d665033?w=400' },
  { title: 'Royal Beard Styling', category: 'Beard Styling', description: 'Full beard grooming with hot oil treatment, shape, and styling wax finish.', price: 349, duration: 40, image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=400' },
  { title: 'Hair Color (Full)', category: 'Hair Coloring', description: 'Full head professional hair coloring using premium ammonia-free products.', price: 799, duration: 90, image: 'https://images.unsplash.com/photo-1560869713-da86a9ec0744?w=400' },
  { title: 'Highlights', category: 'Hair Coloring', description: 'Balayage or foil highlights to add dimension and brightness to your look.', price: 999, duration: 120, image: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=400' },
  { title: 'Gold Facial', category: 'Facial & Skin Care', description: '24K gold infused facial treatment. Anti-aging, brightening, and deep cleansing.', price: 599, duration: 60, image: 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?w=400' },
  { title: 'Classic Facial', category: 'Facial & Skin Care', description: 'Steam, cleanse, scrub, and moisturize. Refreshes and revitalizes skin.', price: 399, duration: 45, image: 'https://images.unsplash.com/photo-1559599101-f09722fb4948?w=400' },
  { title: 'Keratin Hair Spa', category: 'Hair Spa', description: 'Deep conditioning keratin treatment for smooth, frizz-free, lustrous hair.', price: 1499, duration: 120, image: 'https://images.unsplash.com/photo-1634449571010-02389ed0f9b0?w=400' },
  { title: 'Hair Spa & Massage', category: 'Hair Spa', description: 'Scalp massage with hot oil + deep conditioning mask for healthy hair growth.', price: 699, duration: 75, image: 'https://images.unsplash.com/photo-1519823551278-64ac92734fb1?w=400' },
  { title: 'Groom Package - Premium', category: 'Groom Package', description: 'Complete bridal prep: Haircut + Beard + Facial + Hair Spa + Manicure. Look your best on your big day.', price: 2999, duration: 180, image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=400' },
];

const galleryImages = [
  { image: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?w=600', category: 'Haircut', caption: 'Classic taper fade' },
  { image: 'https://images.unsplash.com/photo-1599351431202-1e0f0137899a?w=600', category: 'Beard', caption: 'Styled beard' },
  { image: 'https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=600', category: 'Haircut', caption: 'Hot towel shave' },
  { image: 'https://images.unsplash.com/photo-1622286342621-4bd786c2447c?w=600', category: 'General', caption: 'Premium salon ambiance' },
  { image: 'https://images.unsplash.com/photo-1560869713-da86a9ec0744?w=600', category: 'Color', caption: 'Hair coloring session' },
  { image: 'https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?w=600', category: 'General', caption: 'Expert barber at work' },
  { image: 'https://images.unsplash.com/photo-1541533848490-bc8115cd6522?w=600', category: 'Haircut', caption: 'Scissors craft' },
  { image: 'https://images.unsplash.com/photo-1493256338651-d82f7acb2b38?w=600', category: 'Beard', caption: 'Beard grooming' },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to DB');

  await Service.deleteMany({});
  await Gallery.deleteMany({});
  await Service.insertMany(services);
  await Gallery.insertMany(galleryImages);

  // Create admin user
  const adminExists = await User.findOne({ email: 'admin@sachinsaloon.com' });
  if (!adminExists) {
    await User.create({
      name: 'Sachin (Admin)',
      email: 'admin@sachinsaloon.com',
      password: 'Admin@123',
      phone: '+91 9876543210',
      role: 'admin',
    });
    console.log('Admin created: admin@sachinsaloon.com / Admin@123');
  }

  console.log('✅ Seed complete!');
  process.exit(0);
}

seed().catch((e) => { console.error(e); process.exit(1); });
