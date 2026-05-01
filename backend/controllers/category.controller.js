const Category = require('../models/category.model');

// @desc    Get all categories
// @route   GET /api/categories
// @access  Public
exports.getCategories = async (req, res) => {
    try {
        const { limit, adminOnly, cookId } = req.query;
        let query = {};

        if (adminOnly === 'true') {
            query.cookId = null;
        } else if (cookId) {
            query.$or = [{ cookId: null }, { cookId: cookId }];
        }

        const categories = await Category.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit) || 20);

        res.status(200).json({
            success: true,
            count: categories.length,
            data: categories
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create new category
// @route   POST /api/categories
// @access  Private (Admin/Cook)
exports.createCategory = async (req, res) => {
    try {
        const { name } = req.body;
        const image = req.file ? req.file.path : 'no-image.jpg';

        // Set cookId if user is a cook
        const cookId = req.user.role === 'cook' ? req.user.id : null;

        const category = await Category.create({
            name,
            image,
            cookId
        });

        res.status(201).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update category
// @route   PUT /api/categories/:id
// @access  Private (Admin/Cook)
exports.updateCategory = async (req, res) => {
    try {
        let category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Permission check: Only admin or the cook who created it can update
        if (req.user.role !== 'admin' && (!category.cookId || category.cookId.toString() !== req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this category'
            });
        }

        const updateData = { name: req.body.name };
        if (req.file) {
            updateData.image = req.file.path;
        }

        category = await Category.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: category
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete category
// @route   DELETE /api/categories/:id
// @access  Private (Admin/Cook)
exports.deleteCategory = async (req, res) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return res.status(404).json({
                success: false,
                message: 'Category not found'
            });
        }

        // Permission check: Only admin or the cook who created it can delete
        if (req.user.role !== 'admin' && (!category.cookId || category.cookId.toString() !== req.user.id)) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this category'
            });
        }

        await category.deleteOne();

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