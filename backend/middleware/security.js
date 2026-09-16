import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import xss from 'xss-clean';
import hpp from 'hpp';

// Helmet configuration for security headers
export const helmetConfig = helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            styleSrc: ["'self'", "'unsafe-inline'", 'https://fonts.googleapis.com'],
            fontSrc: ["'self'", 'https://fonts.gstatic.com'],
            imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
            scriptSrc: ["'self'"],
            connectSrc: ["'self'", 'https://*.amazonaws.com'],
            frameSrc: ["'none'"],
            objectSrc: ["'none'"],
            upgradeInsecureRequests: process.env.NODE_ENV === 'production' ? [] : null,
        },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    hsts: {
        maxAge: 31536000,
        includeSubDomains: true,
        preload: true,
    },
    referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
    noSniff: true,
    xssFilter: true,
    frameguard: { action: 'deny' },
});

// MongoDB sanitization middleware
export const mongoSanitizeMiddleware = mongoSanitize({
    replaceWith: '_',
    onSanitize: ({ req, key }) => {
        console.warn(`Sanitized ${key} from request`);
    }
});

// XSS protection middleware
export const xssMiddleware = xss();

// HTTP Parameter Pollution protection
export const hppMiddleware = hpp({
    whitelist: [
        'branch', 'subject', 'year', 'chapter', 'questionType',
        'exam', 'mode', 'mockTestType', 'limit', 'page'
    ]
});

// Custom security headers middleware
export const customSecurityHeaders = (req, res, next) => {
    // Remove X-Powered-By header
    res.removeHeader('X-Powered-By');

    // Add custom security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

    // Cache control for API responses
    if (req.path.startsWith('/api/')) {
        res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
        res.setHeader('Pragma', 'no-cache');
        res.setHeader('Expires', '0');
    }

    next();
};

// Request size limiter
export const requestSizeLimiter = (maxSize = '10mb') => {
    return (req, res, next) => {
        const contentLength = req.headers['content-length'];
        if (contentLength && parseInt(contentLength) > parseSize(maxSize)) {
            return res.status(413).json({
                success: false,
                message: 'Request entity too large'
            });
        }
        next();
    };
};

function parseSize(size) {
    const units = { b: 1, kb: 1024, mb: 1024 * 1024, gb: 1024 * 1024 * 1024 };
    const match = size.toString().toLowerCase().match(/^(\d+(?:\.\d+)?)\s*(b|kb|mb|gb)?$/);
    if (!match) return 10 * 1024 * 1024; // default 10mb
    const value = parseFloat(match[1]);
    const unit = match[2] || 'b';
    return Math.floor(value * (units[unit] || 1));
}

// IP blocking middleware (for known malicious IPs)
export const ipBlocker = (blockedIps = []) => {
    return (req, res, next) => {
        const clientIp = req.ip || req.connection.remoteAddress;
        if (blockedIps.includes(clientIp)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied'
            });
        }
        next();
    };
};

// Request logging middleware
export const requestLogger = (req, res, next) => {
    const start = Date.now();
    const { method, originalUrl, ip } = req;

    res.on('finish', () => {
        const duration = Date.now() - start;
        const { statusCode } = res;

        // Log only errors and slow requests in production
        if (process.env.NODE_ENV === 'production') {
            if (statusCode >= 400 || duration > 1000) {
                console.log(`${method} ${originalUrl} ${statusCode} ${duration}ms - ${ip}`);
            }
        } else {
            console.log(`${method} ${originalUrl} ${statusCode} ${duration}ms - ${ip}`);
        }
    });

    next();
};

// Security audit middleware for sensitive operations
export const securityAudit = (action) => {
    return (req, res, next) => {
        const auditLog = {
            action,
            userId: req.user?.userId || 'anonymous',
            ip: req.ip,
            userAgent: req.get('User-Agent'),
            timestamp: new Date(),
            endpoint: req.originalUrl,
            method: req.method,
        };

        // In production, send to logging service
        if (process.env.NODE_ENV === 'production') {
            // Send to logging service (e.g., Winston, Bunyan, or external service)
            console.log('SECURITY_AUDIT:', JSON.stringify(auditLog));
        } else {
            console.log('SECURITY_AUDIT:', auditLog);
        }

        next();
    };
};

export default {
    helmetConfig,
    mongoSanitizeMiddleware,
    xssMiddleware,
    hppMiddleware,
    customSecurityHeaders,
    requestSizeLimiter,
    ipBlocker,
    requestLogger,
    securityAudit
};