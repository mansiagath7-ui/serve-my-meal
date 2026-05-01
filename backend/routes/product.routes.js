const express = require('express');
const {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
    getCookProducts
} = require('../controllers/product.controller');

const router = express.Router();

const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

router
    .route('/')
    .get(getProducts)
    .post(protect(['admin', 'cook']), upload.single('image'), createProduct);

router.get('/cook', protect(['cook', 'admin']), getCookProducts);


router
    .route('/:id')
    .get(getProduct)
    .put(protect(['admin', 'cook']), upload.single('image'), updateProduct)
    .delete(protect(['admin', 'cook']), deleteProduct);

module.exports = router;
