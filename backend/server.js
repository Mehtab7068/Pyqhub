import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB from './config/db.js';
import questionRoutes from './routes/questionRoutes.js';
import authRoutes from './routes/authRoutes.js';
import attemptRoutes from './routes/attemptRoutes.js';
import questionReportRoutes from './routes/questionReportRoutes.js';

// Security middlewares
import {
    helmetConfig,
    mongoSanitizeMiddleware,
    xssMiddleware,
    hppMiddleware,
    customSecurityHeaders,
    requestSizeLimiter,
    requestLogger,
    securityAudit
} from './middleware/security.js';

// Rate limiters
import {
    apiLimiter,
    authLimiter,
    passwordResetLimiter,
    uploadLimiter,
    reportLimiter
} from './middleware/rateLimiter.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const app = express();

// Connect to database
connectDB();

// Security middlewares (apply early)
app.use(helmetConfig);
app.use(customSecurityHeaders);
app.use(mongoSanitizeMiddleware);
app.use(xssMiddleware);
app.use(hppMiddleware);
app.use(requestSizeLimiter('10mb'));
app.use(requestLogger);

// CORS configuration
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000,http://localhost:3001').split(',');
app.use(cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-API-Key'],
    exposedHeaders: ['X-Total-Count'],
    maxAge: 86400 // 24 hours
}));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(cookieParser());

// Apply general API rate limiter
app.use('/api/', apiLimiter);

// Serve uploaded images statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Health check (no rate limiting)
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API routes with specific rate limiters
app.use('/api/v1/auth/login', authLimiter);
app.use('/api/v1/auth/register', authLimiter);
app.use('/api/v1/auth/forgot-password', passwordResetLimiter);
app.use('/api/v1/auth/reset-password', passwordResetLimiter);
app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/attempts', attemptRoutes);
app.use('/api/v1/questions/report', reportLimiter);
app.use('/api/v1/questions', questionReportRoutes);
app.use('/api/v1/admin/upload', uploadLimiter);
app.use('/api/v1', questionRoutes);

// Global error handler
app.use((err, req, res, next) => {
    console.error('Global Error Handler:', err);
    res.status(err.status || 500).json({
        success: false,
        message: err.message || 'Internal Server Error',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
});

// 404 handler
app.use('*', (req, res) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.originalUrl} not found`,
    });
});

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

export { app, server };