import express from 'express';
import {
    getBranches,
    getSubjects,
    getYears,
    getChapters,
    getQuestions,
    getQuestionsByIds,
    getMockTestQuestions,
    bulkUploadQuestions,
    uploadImages,
} from '../controllers/questionController.js';
import { authenticateUser, authorizeAdmin } from '../middleware/auth.js';
import upload from '../middleware/upload.js';
import { importPracticePaper } from '../controllers/practicePaperController.js';
import {
    questionFilterValidation,
    paginationValidation,
    handleValidationErrors
} from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/branches', getBranches);
router.get('/subjects', getSubjects);
router.get('/years', getYears);
router.get('/chapters', getChapters);
router.get('/questions/by-ids', getQuestionsByIds);
router.get('/questions', questionFilterValidation, handleValidationErrors, getQuestions);
router.get('/mock-test/questions', questionFilterValidation, paginationValidation, handleValidationErrors, getMockTestQuestions);

// Protected admin routes
router.post('/admin/bulk-upload', authorizeAdmin, bulkUploadQuestions);
router.post('/admin/upload-images', authorizeAdmin, upload.array('images', 10), uploadImages);
// Temporary migration utility; remove this route after the question import is complete.
router.post('/admin/import-practicepaper', authorizeAdmin, importPracticePaper);

export default router;