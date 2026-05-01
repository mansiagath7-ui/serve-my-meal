const Product = require('../models/product.model');

// @desc    Get all products
// @route   GET /api/products
// @access  Public
exports.getProducts = async (req, res) => {
    try {
        const { category, type, search, isBestSeller, isQuickPick } = req.query;
        let query = {};

        if (category) {
            query.category = category;
        }

        if (type) {
            query.type = type;
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        if (isBestSeller) {
            query.isBestSeller = isBestSeller === 'true';
        }

        if (isQuickPick) {
            query.isQuickPick = isQuickPick === 'true';
        }

        const products = await Product.find(query).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single product
// @route   GET /api/products/:id
// @access  Public
exports.getProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create new product
// @route   POST /api/products
// @access  Private (Admin/Cook)
exports.createProduct = async (req, res) => {
    try {
        const { name, description, price, category, type, cookId } = req.body;
        const image = req.file ? req.file.path : 'no-food-image.jpg';

        // Set cookId based on role
        const assignedCookId = req.user.role === 'admin' ? cookId : req.user.id;

        if (!assignedCookId) {
            return res.status(400).json({ success: false, message: 'Please provide a cook ID' });
        }

        const product = await Product.create({
            name,
            description,
            price,
            category,
            type,
            image,
            cookId: assignedCookId,
            createdBy: req.user.id,
            isBestSeller: req.body.isBestSeller === 'true' || req.body.isBestSeller === true,
            isQuickPick: req.body.isQuickPick === 'true' || req.body.isQuickPick === true
        });


        res.status(201).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update product
// @route   PUT /api/products/:id
// @access  Private (Admin/Cook)
exports.updateProduct = async (req, res) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Permission check: Only admin or the cook who owns the product can update
        if (req.user.role !== 'admin' && product.cookId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this product'
            });
        }

        // Add additional field updates
        const fieldsToUpdate = ['name', 'description', 'price', 'category', 'type', 'isAvailable', 'isBestSeller', 'isQuickPick'];
        const updateData = {};

        fieldsToUpdate.forEach(field => {
            if (req.body[field] !== undefined) {
                // Defensive boolean parsing
                if (['isAvailable', 'isBestSeller', 'isQuickPick'].includes(field)) {
                    const val = req.body[field];
                    updateData[field] = Array.isArray(val) ? (val.includes('true') || val.includes(true)) : (val === 'true' || val === true);
                } else {
                    updateData[field] = req.body[field];
                }
            }
        });

        if (req.file) {
            updateData.image = req.file.path;
        }

        product = await Product.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete product
// @route   DELETE /api/products/:id
// @access  Private (Admin/Cook)
exports.deleteProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: 'Product not found'
            });
        }

        // Permission check: Only admin or the cook who owns the product can delete
        if (req.user.role !== 'admin' && product.cookId.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this product'
            });
        }

        await product.deleteOne();

        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get cook's products
// @route   GET /api/products/cook
// @access  Private (Cook)
exports.getCookProducts = async (req, res) => {
    try {
        const products = await Product.find({ cookId: req.user.id }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: products.length,
            data: products
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};