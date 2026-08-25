import express from 'express';
import {
    getBranches,
    getSubjects,
    getYears,
    getQuestions,
    bulkUploadQuestions,
    uploadImages,
} from '../controllers/questionController.js';
import { authenticateUser, authorizeAdmin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';

const router = express.Router();

// Public routes
router.get('/branches', getBranches);
router.get('/subjects', getSubjects);
router.get('/years', getYears);
router.get('/questions', getQuestions);

// Protected admin routes
router.post('/admin/bulk-upload', authorizeAdmin, bulkUploadQuestions);
router.post('/admin/upload-images', authorizeAdmin, upload.array('images', 10), uploadImages);

export default router;