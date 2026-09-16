import express from 'express';
import { authenticateUser } from '../middleware/auth.js';
import { createAttempt, getAttempt, getAttempts, getLeaderboard } from '../controllers/attemptController.js';
import { paginationValidation, mongoIdParamValidation, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

router.get('/leaderboard', paginationValidation, handleValidationErrors, getLeaderboard);
router.use(authenticateUser);
router.post('/', createAttempt);
router.get('/', paginationValidation, handleValidationErrors, getAttempts);
router.get('/:id', mongoIdParamValidation, handleValidationErrors, getAttempt);

export default router;