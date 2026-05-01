const Booking = require('../models/booking.model');
const User = require('../models/user.model');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res) => {
    try {
        const {
            cookId,
            date,
            time,
            guests,
            occasion,
            dishes,
            totalAmount,
            note
        } = req.body;

        const booking = await Booking.create({
            userId: req.user.id,
            cookId,
            date,
            time,
            guests,
            occasion,
            dishes,
            totalAmount,
            note
        });

        res.status(201).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get logged in user's bookings
// @route   GET /api/bookings/my-bookings
// @access  Private
exports.getMyBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.user.id })
            .populate('cookId', 'name email profileImage')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all bookings (Admin)
// @route   GET /api/bookings
// @access  Private (Admin)
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find()
            .populate('userId', 'name email')
            .populate('cookId', 'name email')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get bookings for a specific cook
// @route   GET /api/bookings/cook
// @access  Private (Cook)
exports.getCookBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ cookId: req.user.id })
            .populate('userId', 'name email phone avatar')
            .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: bookings.length,
            data: bookings
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update booking status
// @route   PATCH /api/bookings/:id/status
// @access  Private (Admin, Cook)
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status, paymentStatus } = req.body;
        
        let booking = await Booking.findById(req.params.id);

        if (!booking) {
            return res.status(404).json({
                success: false,
                message: 'Booking not found'
            });
        }

        // Authorization Check: Admins can do anything; Cooks can only update their own bookings
        if (req.user.role !== 'admin' && booking.cookId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'You are not authorized to update this booking'
            });
        }

        // Apply updates
        if (status) booking.status = status;
        if (paymentStatus) booking.paymentStatus = paymentStatus;

        await booking.save();

        res.status(200).json({
            success: true,
            data: booking
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

