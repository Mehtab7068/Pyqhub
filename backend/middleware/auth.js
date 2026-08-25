import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Authenticate user via JWT (cookie or Authorization header)
const authenticateUser = async (req, res, next) => {
    try {
        let token;

        // Get token from cookie
        if (req.cookies?.token) {
            token = req.cookies.token;
        }
        // Get token from Authorization header
        else if (req.headers.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized to access this route. Please log in.',
            });
        }

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_change_in_production');

        // Get user from token (exclude password)
        const user = await User.findById(decoded.userId).select('-password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found. Please log in again.',
            });
        }

        req.user = { userId: user._id, role: user.role };
        next();
    } catch (error) {
        console.error('Auth middleware error:', error);
        return res.status(401).json({
            success: false,
            message: 'Not authorized to access this route. Token is invalid or expired.',
        });
    }
};

// Authorize admin via API key or JWT admin role
const authorizeAdmin = async (req, res, next) => {
    try {
        // Check API key first (allows non-admin JWT users to use admin endpoints with valid key)
        const apiKey = req.headers['x-api-key'];
        if (apiKey && apiKey === process.env.ADMIN_API_KEY) {
            return next();
        }

        // Fall back to JWT admin role
        if (req.user) {
            if (req.user.role !== 'admin') {
                return res.status(403).json({
                    success: false,
                    message: 'Access denied. Admin privileges required.',
                });
            }
            return next();
        }

        return res.status(401).json({
            success: false,
            message: 'Unauthorized - Invalid or missing API key',
        });
    } catch (error) {
        console.error('Admin auth error:', error);
        return res.status(401).json({
            success: false,
            message: 'Unauthorized',
        });
    }
};

export { authenticateUser, authorizeAdmin };