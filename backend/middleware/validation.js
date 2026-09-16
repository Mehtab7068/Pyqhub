import { body, param, query, validationResult } from 'express-validator';

// Validation error handler
export const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: errors.array().map(err => ({
                field: err.path,
                message: err.msg,
                value: err.value
            }))
        });
    }
    next();
};

// Auth validation rules
export const registerValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 6, max: 128 })
        .withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('confirmPassword')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords do not match'),
];

export const loginValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .notEmpty()
        .withMessage('Password is required'),
];

export const forgotPasswordValidation = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
];

export const resetPasswordValidation = [
    body('token')
        .notEmpty()
        .withMessage('Reset token is required'),
    body('password')
        .isLength({ min: 6, max: 128 })
        .withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('confirmPassword')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords do not match'),
];

export const changePasswordValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 6, max: 128 })
        .withMessage('Password must be at least 6 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage('Password must contain at least one uppercase letter, one lowercase letter, and one number'),
    body('confirmPassword')
        .custom((value, { req }) => value === req.body.newPassword)
        .withMessage('Passwords do not match'),
];

export const updateProfileValidation = [
    body('name')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('phone')
        .optional()
        .trim()
        .isMobilePhone('any')
        .withMessage('Please provide a valid phone number'),
    body('targetExam')
        .optional()
        .trim()
        .isIn(['GATE', 'JEE_MAINS', 'NEET', 'SSC_CGL', 'NDA', 'UPSC'])
        .withMessage('Invalid exam type'),
    body('targetYear')
        .optional()
        .trim()
        .matches(/^\d{4}$/)
        .withMessage('Target year must be a valid 4-digit year'),
    body('branch')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('Branch must be less than 100 characters'),
    body('college')
        .optional()
        .trim()
        .isLength({ max: 100 })
        .withMessage('College must be less than 100 characters'),
    body('bio')
        .optional()
        .trim()
        .isLength({ max: 300 })
        .withMessage('Bio must be less than 300 characters'),
];

// Question validation rules
export const questionReportValidation = [
    body('questionId')
        .isMongoId()
        .withMessage('Invalid question ID'),
    body('reason')
        .isIn([
            'incorrect_answer',
            'typo',
            'ambiguous_question',
            'broken_image',
            'wrong_explanation',
            'incorrect_marks',
            'incorrect_question_type',
            'duplicate_question',
            'other'
        ])
        .withMessage('Invalid report reason'),
    body('description')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Description must be less than 500 characters'),
];

// Query validation rules
export const paginationValidation = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),
];

export const questionFilterValidation = [
    query('exam')
        .optional()
        .isIn(['GATE', 'JEE_MAINS', 'NEET', 'SSC_CGL', 'NDA', 'UPSC'])
        .withMessage('Invalid exam type'),
    query('branch')
        .optional()
        .trim()
        .isLength({ max: 100 }),
    query('subject')
        .optional()
        .trim()
        .isLength({ max: 100 }),
    query('year')
        .optional()
        .isInt({ min: 2000, max: 2100 })
        .withMessage('Invalid year'),
    query('chapter')
        .optional()
        .trim()
        .isLength({ max: 100 }),
    query('questionType')
        .optional()
        .isIn(['MCQ', 'MSQ', 'NAT'])
        .withMessage('Invalid question type'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 500 })
        .withMessage('Limit must be between 1 and 500'),
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),
];

// Admin validation rules
export const adminRegisterValidation = [
    body('name')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Name must be between 2 and 50 characters'),
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email'),
    body('password')
        .isLength({ min: 8, max: 128 })
        .withMessage('Password must be at least 8 characters')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/)
        .withMessage('Password must contain uppercase, lowercase, number, and special character'),
    body('confirmPassword')
        .custom((value, { req }) => value === req.body.password)
        .withMessage('Passwords do not match'),
    body('apiKey')
        .notEmpty()
        .withMessage('Admin API key is required'),
];

// Parameter validation
export const mongoIdParamValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid ID format'),
];

export const questionIdParamValidation = [
    param('id')
        .isMongoId()
        .withMessage('Invalid question ID format'),
];

export default {
    handleValidationErrors,
    registerValidation,
    loginValidation,
    forgotPasswordValidation,
    resetPasswordValidation,
    changePasswordValidation,
    updateProfileValidation,
    questionReportValidation,
    paginationValidation,
    questionFilterValidation,
    adminRegisterValidation,
    mongoIdParamValidation,
    questionIdParamValidation,
};