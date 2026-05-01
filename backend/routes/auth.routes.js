const express = require('express');
const {
    register,
    login,
    getMe,
    updateProfile,
    deleteUser,
    getUsers,
    getSellers,
    updateAvatar,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress
} = require('../controllers/auth.controller');

const router = express.Router();

const { protect } = require('../middleware/auth.middleware');
const upload = require('../middleware/upload.middleware');

// Public routes
router.post('/register', register);
router.post('/login', login);

// Private routes
router.get('/me', protect(), getMe);
router.put('/update', protect(), updateProfile);
router.post('/update-avatar', protect(), upload.single('image'), updateAvatar);
router.delete('/delete/:id', protect(), deleteUser);

// Address Management
router.post('/address', protect(), addAddress);
router.put('/address/:id', protect(), updateAddress);
router.delete('/address/:id', protect(), deleteAddress);
router.patch('/address/:id/default', protect(), setDefaultAddress);

// Admin only routes
router.get('/users', protect('admin'), getUsers);
router.get('/sellers', getSellers);

module.exports = router;
