const express = require('express');
const router = express.Router();
const {
    createBooking,
    getMyBookings,
    getAllBookings,
    updateBookingStatus,
    getCookBookings
} = require('../controllers/booking.controller');
const { protect } = require('../middleware/auth.middleware');

// Customer Routes (Authenticated)
router.post('/', protect(), createBooking);
router.get('/my-bookings', protect(), getMyBookings);

// Cook Routes (Authenticated + Cook Role)
router.get('/my-chef-bookings', protect(['cook']), getCookBookings);

// Shared/Admin Routes (Authenticated)
router.get('/all', protect(['admin']), getAllBookings); 
router.patch('/:id/status', protect(['admin', 'cook']), updateBookingStatus);

module.exports = router;

