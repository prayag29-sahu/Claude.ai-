const express = require('express');
const router = express.Router();
const { getAnalytics, getAllUsers, toggleUserStatus } = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);

router.get('/analytics', getAnalytics);
router.get('/users', getAllUsers);
router.put('/users/:id', toggleUserStatus);

module.exports = router;
