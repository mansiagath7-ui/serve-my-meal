const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

/**
 * Protect middleware to verify JWT and check user roles
 * @param {string|string[]} roles - Allowed roles (e.g. 'admin' or ['admin', 'cook'])
 */
const protect = (roles = []) => {
    return async (req, res, next) => {
        let token;

        if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
        }

        try {
            // Verify token
            const decoded = jwt.verify(token, process.env.JWT_SECRET);

            // Fetch user and attach to request
            req.user = await User.findById(decoded.id);

            if (!req.user) {
                return res.status(401).json({ success: false, message: 'User not found' });
            }

            // Check if roles are specified and if user has required role
            if (roles.length > 0) {
                const allowedRoles = Array.isArray(roles) ? roles : [roles];
                if (!allowedRoles.includes(req.user.role)) {
                    return res.status(403).json({ 
                        success: false, 
                        message: `User role '${req.user.role}' is not authorized to access this route` 
                    });
                }
            }

            next();
        } catch (error) {
            return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
        }
    };
};

module.exports = { protect };
