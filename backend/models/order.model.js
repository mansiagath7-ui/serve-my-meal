const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            name: String,
            quantity: {
                type: Number,
                required: true,
                min: 1
            },
            price: {
                type: Number,
                required: true
            },
            cookId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            }

        }
    ],
    totalAmount: {
        type: Number,
        required: true
    },
    deliveryAddress: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['New', 'Preparing', 'Ready', 'Delivered', 'Cancelled'],
        default: 'New'
    },
    paymentId: String,
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Order', orderSchema);
