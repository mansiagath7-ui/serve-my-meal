const { cashfree } = require('../config/cashfree');
const Order = require('../models/order.model');
const Booking = require('../models/booking.model');

// @desc    Create Cashfree payment session
// @route   POST /api/payments/create-session
// @access  Private
exports.createPaymentSession = async (req, res, next) => {
    try {
        const { orderId, bookingId, amount } = req.body;

        if ((!orderId && !bookingId) || !amount) {
            return res.status(400).json({ success: false, message: 'Please provide orderId or bookingId and amount' });
        }

        const id = orderId || bookingId;
        const type = orderId ? 'order' : 'booking';

        // Format amount to exactly 2 decimal places (Cashfree requirement)
        const formattedAmount = Number(parseFloat(amount).toFixed(2));

        const request = {
            order_amount: formattedAmount,
            order_currency: "INR",
            order_id: id + "_" + Date.now(),
            customer_details: {
                customer_id: req.user._id.toString(),
                customer_phone: (req.user.phone || "9999999999").replace(/\D/g, '').slice(-10), // Ensure 10 digits
                customer_name: req.user.name || "Guest User",
                customer_email: req.user.email || "guest@example.com"
            },
            order_meta: {
                return_url: `http://localhost:5173/payment-success?${type}_id=${id}`
            }
        };

        // Save the Cashfree order ID to our database record
        if (type === 'order') {
            await Order.findByIdAndUpdate(orderId, { paymentId: request.order_id });
        } else {
            await Booking.findByIdAndUpdate(bookingId, { paymentId: request.order_id });
        }

        const response = await cashfree.PGCreateOrder(request);
        
        res.status(200).json({
            success: true,
            data: response.data
        });
    } catch (error) {
        const cfError = error.response ? error.response.data : null;
        const errorMessage = cfError ? (cfError.message || JSON.stringify(cfError)) : error.message;
        
        console.error("Cashfree API Error:", errorMessage);
        
        res.status(400).json({
            success: false,
            message: `Cashfree: ${errorMessage}`,
            details: cfError
        });
    }
};

// @desc    Verify payment status
// @route   POST /api/payments/verify
// @access  Private
exports.verifyPayment = async (req, res, next) => {
    try {
        const { order_id, booking_id } = req.body;

        let record;
        let type;

        if (order_id) {
            record = await Order.findById(order_id);
            type = 'order';
        } else if (booking_id) {
            record = await Booking.findById(booking_id);
            type = 'booking';
        }

        if (!record) {
            return res.status(404).json({ success: false, message: 'Record not found' });
        }

        // Fetch order details from Cashfree to check status
        const response = await cashfree.PGFetchOrder(record.paymentId);
        const cfOrder = response.data;

        if (cfOrder.order_status === 'PAID') {
            // Update status securely
            record.paymentStatus = 'Paid';
            if (type === 'booking') {
                record.status = 'Paid'; // Initial status after payment
            }
            await record.save();

            res.status(200).json({ 
                success: true, 
                message: 'Payment verified successfully',
                data: record
            });
        } else {
            res.status(400).json({ 
                success: false, 
                message: `Payment status: ${cfOrder.order_status}`,
                status: cfOrder.order_status
            });
        }
    } catch (error) {
        const cfError = error.response ? error.response.data : null;
        console.error("Verification Error:", cfError || error.message);
        res.status(500).json({ success: false, message: 'Verification failed' });
    }
};

