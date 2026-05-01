const express = require('express');
const { createOrder, getMyOrders, getAllOrders, updateOrderStatus, getCookOrders } = require('../controllers/order.controller');
const { protect } = require('../middleware/auth.middleware');

const router = express.Router();

router.use(protect());

router.post('/', createOrder);
router.get('/my-orders', getMyOrders);
router.get('/cook', protect(['cook', 'admin']), getCookOrders);

// Admin / Cook Routes
router.get('/', protect(['admin']), getAllOrders);
router.patch('/:id/status', protect(['admin', 'cook']), updateOrderStatus);


module.exports = router;
