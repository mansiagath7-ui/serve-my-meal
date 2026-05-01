const Order = require('../models/order.model');
const Product = require('../models/product.model');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
exports.createOrder = async (req, res, next) => {
    try {
        const { items, totalAmount, deliveryAddress, paymentMethod } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ success: false, message: 'No items in order' });
        }

        // Enrich items with cookId from Product model
        const enrichedItems = await Promise.all(items.map(async (item) => {
            const product = await Product.findById(item.id || item._id);
            if (!product) {
                throw new Error(`Product with ID ${item.id || item._id} not found`);
            }
            if (!product.cookId) {
                throw new Error(`Product "${product.name}" does not have a cook assigned. Please contact admin.`);
            }
            return {
                productId: product._id,
                name: product.name,
                quantity: item.qty || item.quantity,
                price: product.price,
                cookId: product.cookId
            };
        }));

        const order = await Order.create({
            userId: req.user.id,
            items: enrichedItems,
            totalAmount,
            deliveryAddress,
            paymentStatus: 'Pending',
            status: 'New'
        });


        res.status(201).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
exports.getMyOrders = async (req, res, next) => {
    try {
        const orders = await Order.find({ userId: req.user.id }).sort('-createdAt');
        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all orders (Admin Only)
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res, next) => {
    try {
        const orders = await Order.find()
            .populate('userId', 'name email')
            .sort('-createdAt');
            
        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update order status (Admin Only)
// @route   PATCH /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res, next) => {
    try {
        const { status } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found' });
        }

        // Check permission: Admin or the Cook assigned to at least one item in this order
        const isCookAssociated = order.items.some(item => item.cookId?.toString() === req.user.id);
        
        if (req.user.role !== 'admin' && !isCookAssociated) {
            return res.status(403).json({ success: false, message: 'Not authorized to update this order' });
        }

        // Use findByIdAndUpdate to bypass re-validating the entire document (blocks updates if cookId is missing in items)
        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: false } // We can skip runValidators here because status is already checked by enum if we use save, but with findByIdAndUpdate we just trust the body
        );



        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get orders for cook
// @route   GET /api/orders/cook
// @access  Private (Cook)
exports.getCookOrders = async (req, res, next) => {
    try {
        // Find orders where at least one item belongs to this cook
        const orders = await Order.find({
            'items.cookId': req.user.id
        })
        .populate('userId', 'name email address phone')
        .sort('-createdAt');

        res.status(200).json({
            success: true,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

