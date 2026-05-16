const express = require('express');
const { getAllUsers, toggleUserStatus, getDashboardStats } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

const router = express.Router();

router.get('/stats', protect, adminOnly, getDashboardStats);
router.get('/', protect, adminOnly, getAllUsers);
router.put('/:id/toggle', protect, adminOnly, toggleUserStatus);

module.exports = router;
