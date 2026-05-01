const express = require('express');
const router = express.Router();
const { getCooks, getOwnProfile, updateOwnProfile } = require('../controllers/cook.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/', getCooks);

// Protected routes
router.use(protect('cook'));

router.get('/me', getOwnProfile);
router.put('/me', updateOwnProfile);

module.exports = router;
