const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    cookId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // User with role 'cook'
        required: true
    },
    date: {
        type: Date,
        required: [true, 'Please select a date']
    },
    time: {
        type: String,
        required: [true, 'Please select a time']
    },
    guests: {
        type: Number,
        required: true,
        default: 1
    },
    occasion: String,
    dishes: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product'
            },
            name: String,
            quantity: Number
        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enum: ['Pending', 'Paid', 'Confirmed', 'Completed', 'Cancelled'],
        default: 'Pending'
    },

    paymentId: String,
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
    },
    note: String,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Booking', bookingSchema);
