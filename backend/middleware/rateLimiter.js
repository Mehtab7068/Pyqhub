import rateLimit from 'express-rate-limit';
import { RedisStore } from 'rate-limit-redis';
import { createClient } from 'redis';

// Create Redis client for distributed rate limiting (optional)
// const redisClient = createClient({ url: process.env.REDIS_URL });
// redisClient.connect().catch(console.error);

// General API rate limiter
export const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: 'Too many requests from this IP, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    // store: new RedisStore({ sendCommand: (...args) => redisClient.sendCommand(args) }),
});

// Strict rate limiter for auth endpoints
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // limit each IP to 10 requests per windowMs
    message: {
        success: false,
        message: 'Too many authentication attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
    skipSuccessfulRequests: true, // Don't count successful requests
});

// Very strict rate limiter for password reset
export const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // limit each IP to 3 requests per hour
    message: {
        success: false,
        message: 'Too many password reset attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter for question upload (admin)
export const uploadLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20, // limit each IP to 20 uploads per hour
    message: {
        success: false,
        message: 'Too many upload attempts, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Rate limiter for question reports
export const reportLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 10, // limit each IP to 10 reports per hour
    message: {
        success: false,
        message: 'Too many reports submitted, please try again later.'
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Custom rate limiter factory
export const createRateLimiter = (options = {}) => {
    return rateLimit({
        windowMs: options.windowMs || 15 * 60 * 1000,
        max: options.max || 100,
        message: options.message || {
            success: false,
            message: 'Too many requests, please try again later.'
        },
        standardHeaders: true,
        legacyHeaders: false,
        keyGenerator: options.keyGenerator || ((req) => req.ip),
        skip: options.skip || (() => false),
    });
};