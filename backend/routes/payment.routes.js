const express = require('express');
const { createPaymentSession, verifyPayment } = require('../controllers/payment.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect());

router.post('/create-session', createPaymentSession);
router.post('/verify', verifyPayment);

module.exports = router;
