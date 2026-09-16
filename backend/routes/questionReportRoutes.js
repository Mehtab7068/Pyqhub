import express from 'express';
import { authenticateUser, authorizeAdmin } from '../middleware/auth.js';
import {
    reportQuestion,
    getMyReports,
    getAllReports,
    updateReportStatus,
    getReportStats
} from '../controllers/questionReportController.js';
import {
    questionReportValidation,
    mongoIdParamValidation,
    paginationValidation,
    handleValidationErrors
} from '../middleware/validation.js';

const router = express.Router();

// User routes
router.use(authenticateUser);
router.post('/report', questionReportValidation, handleValidationErrors, reportQuestion);
router.get('/reports/my', getMyReports);

// Admin routes
router.use('/admin', authorizeAdmin);
router.get('/admin/reports', paginationValidation, handleValidationErrors, getAllReports);
router.get('/admin/reports/stats', getReportStats);
router.put('/admin/reports/:id', mongoIdParamValidation, handleValidationErrors, updateReportStatus);

export default router;