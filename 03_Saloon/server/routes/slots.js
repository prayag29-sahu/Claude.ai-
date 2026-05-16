const express = require('express');
const router = express.Router();
const TimeSlot = require('../models/TimeSlot');
const { protect, adminOnly } = require('../middleware/auth');
const { asyncHandler } = require('../middleware/errorHandler');

// Get all slots
router.get('/', asyncHandler(async (req, res) => {
  const slots = await TimeSlot.find({ isActive: true }).sort({ time: 1 });
  res.json({ success: true, slots });
}));

// Admin: Add slot
router.post('/', protect, adminOnly, asyncHandler(async (req, res) => {
  const slot = await TimeSlot.create(req.body);
  res.status(201).json({ success: true, slot });
}));

// Admin: Toggle slot
router.put('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  const slot = await TimeSlot.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json({ success: true, slot });
}));

// Admin: Delete slot
router.delete('/:id', protect, adminOnly, asyncHandler(async (req, res) => {
  await TimeSlot.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: 'Slot deleted' });
}));

module.exports = router;
