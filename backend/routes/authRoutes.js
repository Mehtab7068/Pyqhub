import express from 'express';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from '../models/User.js';
import { authenticateUser } from '../middleware/auth.js';

const router = express.Router();

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET || 'fallback_secret_key_change_in_production', {
        expiresIn: process.env.JWT_EXPIRE || '7d',
    });
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
const register = async (req, res) => {
    try {
        const { name, email, password, confirmPassword } = req.body;

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, password, and confirm password',
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match',
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters',
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists',
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
        });

        // Generate token
        const token = generateToken(user._id);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error during registration',
        });
    }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide email and password',
            });
        }

        // Find user with password field included
        const user = await User.findOne({ email }).select('+password');
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Check password
        const isPasswordCorrect = await user.comparePassword(password);
        if (!isPasswordCorrect) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password',
            });
        }

        // Generate token
        const token = generateToken(user._id);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error during login',
        });
    }
};

// @desc    Logout user
// @route   POST /api/v1/auth/logout
// @access  Private
const logout = (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully',
    });
};

// @desc    Get current user
// @route   GET /api/v1/auth/me
// @access  Private
const getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        res.status(200).json({
            success: true,
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
            },
        });
    } catch (error) {
        console.error('GetMe error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error',
        });
    }
};

// @desc    Admin register user
// @route   POST /api/v1/auth/admin-register
// @access  Public (requires API key)
const adminRegister = async (req, res) => {
    try {
        const { name, email, password, confirmPassword, apiKey } = req.body;

        // Validate API key
        if (!apiKey || apiKey !== process.env.ADMIN_API_KEY) {
            return res.status(403).json({
                success: false,
                message: 'Invalid or missing admin API key',
            });
        }

        // Validation
        if (!name || !email || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, password, and confirm password',
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match',
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters',
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists',
            });
        }

        // Create user with admin role
        const user = await User.create({
            name,
            email,
            password,
            role: 'admin',
        });

        // Generate token
        const token = generateToken(user._id);

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
        });

        res.status(201).json({
            success: true,
            message: 'Admin registered successfully',
            data: {
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                },
                token,
            },
        });
    } catch (error) {
        console.error('Admin register error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error during admin registration',
        });
    }
};

// @desc    Forgot password - send reset email
// @route   POST /api/v1/auth/forgot-password
// @access  Public
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email address',
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'No user found with that email address',
            });
        }

        // Generate reset token
        const resetToken = jwt.sign(
            { userId: user._id },
            process.env.JWT_SECRET || 'fallback_secret_key_change_in_production',
            { expiresIn: '1h' }
        );

        // Save reset token to user
        user.resetPasswordToken = resetToken;
        user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
        await user.save();

        // Create reset URL
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;

        // Email content
        const message = `
            <h1>Password Reset Request</h1>
            <p>You requested a password reset. Please click the link below to reset your password:</p>
            <a href="${resetUrl}" style="display: inline-block; padding: 10px 20px; background-color: #3b82f6; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Reset Password</a>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
        `;

        // Send email (using nodemailer)
        try {
            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS,
                },
            });

            await transporter.sendMail({
                from: process.env.EMAIL_USER,
                to: user.email,
                subject: 'Password Reset Request - GATE PYQ Platform',
                html: message,
            });

            res.status(200).json({
                success: true,
                message: 'Password reset email sent successfully',
            });
        } catch (emailError) {
            console.error('Email send error:', emailError);
            // If email fails, still return success but log the error
            res.status(200).json({
                success: true,
                message: 'Password reset email sent successfully',
            });
        }
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error during password reset',
        });
    }
};

// @desc    Reset password
// @route   POST /api/v1/auth/reset-password
// @access  Public
const resetPassword = async (req, res) => {
    try {
        const { token, password, confirmPassword } = req.body;

        if (!token || !password || !confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Please provide token, password, and confirm password',
            });
        }

        if (password !== confirmPassword) {
            return res.status(400).json({
                success: false,
                message: 'Passwords do not match',
            });
        }

        if (password.length < 6) {
            return res.status(400).json({
                success: false,
                message: 'Password must be at least 6 characters',
            });
        }

        // Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret_key_change_in_production');
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token',
            });
        }

        // Find user by token
        const user = await User.findOne({
            _id: decoded.userId,
            resetPasswordToken: token,
            resetPasswordExpire: { $gt: Date.now() },
        });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: 'Invalid or expired reset token',
            });
        }

        // Update password
        user.password = password;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({
            success: true,
            message: 'Password reset successful',
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Server error during password reset',
        });
    }
};

router.post('/register', register);
router.post('/login', login);
router.post('/logout', authenticateUser, logout);
router.get('/me', authenticateUser, getMe);
router.post('/admin-register', adminRegister);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;