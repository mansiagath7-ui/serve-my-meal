const express = require('express');
const {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory
} = require('../controllers/category.controller');

const router = express.Router();

const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router
    .route('/')
    .get(getCategories)
    .post(protect(['admin', 'cook']), upload.single('image'), createCategory);

router
    .route('/:id')
    .put(protect(['admin', 'cook']), upload.single('image'), updateCategory)
    .delete(protect(['admin', 'cook']), deleteCategory);


module.exports = router;
