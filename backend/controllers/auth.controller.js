const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const CookProfile = require('../models/cookprofle.model'); // Note: filename typo from user?

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role, phone, address } = req.body;

        // Check if admin already exists
        if (role === 'admin') {
            const adminExists = await User.findOne({ role: 'admin' });
            if (adminExists) {
                return res.status(400).json({ success: false, message: 'Admin already exists' });
            }
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            role: role || 'customer',
            phone,
            address
        });

        // If cook, create profile
        if (user.role === 'cook') {
            await CookProfile.create({
                userId: user._id,
                specialty: 'Pending Specification',
                experience: '0 years',
                hourlyRate: 0
            });
        }

        sendTokenResponse(user, 201, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'Please provide email and password' });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        next(error);
    }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        // Migration logic: If user has old address but no new addresses array
        if (user.address && (!user.addresses || user.addresses.length === 0)) {
            const hasLegacyData = user.address.street || user.address.city || user.address.state || user.address.zip;

            if (hasLegacyData) {
                const addressStr = typeof user.address === 'string'
                    ? user.address
                    : `${user.address.street || ''}, ${user.address.city || ''}, ${user.address.state || ''} ${user.address.zip || ''}`;

                // Only migrate if it's not just a string of commas/placeholders
                const cleanStr = addressStr.replace(/[,\s]/g, '');
                if (cleanStr.length > 0) {
                    user.addresses.push({
                        label: 'Home',
                        street: addressStr,
                        city: user.address.city || 'Default',
                        state: user.address.state || 'Default',
                        zip: user.address.zip || '000000',
                        isDefault: true
                    });
                }
            }

            // Always clear legacy address after checking (success or skip) to prevent re-runs
            user.address = undefined;
            await user.save();
        }

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// @desc    Update profile
// @route   PUT /api/auth/update
// @access  Private
exports.updateProfile = async (req, res, next) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone
        };

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        res.status(200).json({ success: true, data: user });
    } catch (error) {
        next(error);
    }
};

// @desc    Add new address
// @route   POST /api/auth/address
// @access  Private
exports.addAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        if (user.addresses.length >= 5) {
            return res.status(400).json({ success: false, message: 'Maximum limit of 5 addresses reached' });
        }

        const isDefault = user.addresses.length === 0 ? true : (req.body.isDefault === true || req.body.isDefault === 'true');

        // If setting as default, unset others
        if (isDefault) {
            user.addresses.forEach(addr => addr.isDefault = false);
        }

        user.addresses.push({
            label: req.body.label,
            street: req.body.street,
            city: req.body.city,
            state: req.body.state,
            zip: req.body.zip,
            isDefault
        });

        await user.save();

        res.status(200).json({ success: true, data: user.addresses });
    } catch (error) {
        next(error);
    }
};

// @desc    Update address
// @route   PUT /api/auth/address/:id
// @access  Private
exports.updateAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const address = user.addresses.id(req.params.id);

        if (!address) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        address.label = req.body.label || address.label;
        address.street = req.body.street || address.street;
        address.city = req.body.city || address.city;
        address.state = req.body.state || address.state;
        address.zip = req.body.zip || address.zip;

        if (req.body.isDefault === true || req.body.isDefault === 'true') {
            user.addresses.forEach(addr => addr.isDefault = false);
            address.isDefault = true;
        } else if (req.body.isDefault === false || req.body.isDefault === 'false') {
            // Only allow unsetting default if we have other addresses to make default
            address.isDefault = false;
            if (user.addresses.every(a => !a.isDefault) && user.addresses.length > 0) {
                user.addresses[0].isDefault = true;
            }
        }

        await user.save();
        res.status(200).json({ success: true, data: user.addresses });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete address
// @route   DELETE /api/auth/address/:id
// @access  Private
exports.deleteAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);
        const address = user.addresses.id(req.params.id);

        if (!address) {
            return res.status(404).json({ success: false, message: 'Address not found' });
        }

        const wasDefault = address.isDefault;
        user.addresses.pull(req.params.id);

        // If we deleted the default, make another one default if possible
        if (wasDefault && user.addresses.length > 0) {
            user.addresses[0].isDefault = true;
        }

        // If we deleted the last address, ensure legacy field is also clear
        if (user.addresses.length === 0) {
            user.address = undefined;
        }

        await user.save();
        res.status(200).json({ success: true, data: user.addresses });
    } catch (error) {
        next(error);
    }
};

// @desc    Set default address
// @route   PATCH /api/auth/address/:id/default
// @access  Private
exports.setDefaultAddress = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id);

        user.addresses.forEach(addr => {
            addr.isDefault = addr._id.toString() === req.params.id;
        });

        await user.save();
        res.status(200).json({ success: true, data: user.addresses });
    } catch (error) {
        next(error);
    }
};

// @desc    Update profile photo
// @route   POST /api/auth/update-avatar
// @access  Private
exports.updateAvatar = async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'Please upload a file' });
        }

        const profileImageUrl = `/uploads/${req.file.filename}`;

        const user = await User.findByIdAndUpdate(req.user.id, {
            profileImage: profileImageUrl
        }, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete user
// @route   DELETE /api/auth/delete/:id
// @access  Private
exports.deleteUser = async (req, res, next) => {
    try {
        // Only Admin or the user themselves can delete
        if (req.user.role !== 'admin' && req.user.id !== req.params.id) {
            return res.status(403).json({ success: false, message: 'Not authorized' });
        }

        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // If cook, also delete profile
        if (user.role === 'cook') {
            await CookProfile.findOneAndDelete({ userId: user._id });
        }

        res.status(200).json({ success: true, message: 'User deleted' });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all customers (Admin Only)
// @route   GET /api/auth/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
    try {
        const users = await User.find({ role: 'customer' });
        res.status(200).json({ success: true, count: users.length, data: users });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all sellers/cooks (Admin Only)
// @route   GET /api/auth/sellers
// @access  Private/Admin
exports.getSellers = async (req, res, next) => {
    try {
        const sellers = await User.find({ role: 'cook' });

        const sellersWithProfiles = await Promise.all(sellers.map(async (seller) => {
            const profile = await CookProfile.findOne({ userId: seller._id });
            return {
                ...seller._doc,
                profile: profile || { status: 'offline' }
            };
        }));

        res.status(200).json({ success: true, count: sellersWithProfiles.length, data: sellersWithProfiles });
    } catch (error) {
        next(error);
    }
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    // Create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d'
    });

    res.status(statusCode).json({
        success: true,
        token,
        data: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });
};