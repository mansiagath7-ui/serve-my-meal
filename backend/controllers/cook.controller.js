const User = require('../models/user.model');
const CookProfile = require('../models/cookprofle.model');

// @desc    Get all cooks with their profiles
// @route   GET /api/cooks
// @access  Public
exports.getCooks = async (req, res) => {
    try {
        const cooks = await User.find({ role: 'cook' }).select('-password');

        const cooksWithProfiles = await Promise.all(cooks.map(async (cook) => {
            const profile = await CookProfile.findOne({ userId: cook._id });
            // Only include online cooks for the user list
            if (!profile || profile.status !== 'online') return null;

            return {
                id: cook._id,
                name: cook.name,
                email: cook.email,
                profileImage: cook.profileImage,
                specialty: profile ? profile.specialty : 'N/A',
                experience: profile ? profile.experience : 'N/A',
                rating: profile ? profile.rating : 4.5, // Default/Fallback
                hourlyRate: profile ? profile.hourlyRate : 500,
                bio: profile ? profile.bio : 'No bio provided.',
                cuisines: profile ? profile.cuisines : [],
                reviewsCount: profile ? profile.reviewsCount : 0,
                isVerified: profile ? profile.isVerified : false,
                status: profile ? profile.status : 'offline'
            };
        }));

        // Filter out nulls (offline cooks)
        const activeCooks = cooksWithProfiles.filter(c => c !== null);

        res.status(200).json({
            success: true,
            count: activeCooks.length,
            data: activeCooks
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get current cook profile
// @route   GET /api/cooks/me
// @access  Private (Cook)
exports.getOwnProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        const profile = await CookProfile.findOne({ userId: req.user.id });

        res.status(200).json({
            success: true,
            data: {
                ...user._doc,
                profile: profile || {}
            }
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update current cook profile
// @route   PUT /api/cooks/me
// @access  Private (Cook)
exports.updateOwnProfile = async (req, res) => {
    try {
        const { name, phone, address, specialty, experience, hourlyRate, bio, cuisines, status } = req.body;

        // Update User info
        await User.findByIdAndUpdate(req.user.id, {
            name, phone, address
        });

        // Update or Create CookProfile
        const profileFields = {
            specialty,
            experience,
            hourlyRate,
            bio,
            cuisines: Array.isArray(cuisines) ? cuisines : (cuisines ? cuisines.split(',').map(c => c.trim()) : []),
            status: status || 'offline'
        };

        const profile = await CookProfile.findOneAndUpdate(
            { userId: req.user.id },
            { $set: profileFields },
            { new: true, upsert: true }
        );

        res.status(200).json({
            success: true,
            data: profile
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};