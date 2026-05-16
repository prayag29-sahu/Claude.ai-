const router = require('express').Router()
const { createContract, getContractByBooking } = require('../controllers/contractController')
const { protect } = require('../middleware/authMiddleware')

router.post('/', protect, createContract)
router.get('/:bookingId', protect, getContractByBooking)

module.exports = router
