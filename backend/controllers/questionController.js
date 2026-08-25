import QuestionBank from '../models/QuestionBank.js';

// @desc    Get distinct branches
// @route   GET /api/v1/branches
// @access  Public
const getBranches = async (req, res, next) => {
    try {
        const { exam } = req.query;
        const filter = exam ? { exam } : {};
        const branches = await QuestionBank.distinct('branch', filter);
        res.status(200).json({
            success: true,
            count: branches.length,
            data: branches.sort(),
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get distinct subjects for a branch
// @route   GET /api/v1/subjects?branch=XYZ&exam=GATE
// @access  Public
const getSubjects = async (req, res, next) => {
    try {
        const { branch, exam } = req.query;

        if (!branch) {
            return res.status(400).json({
                success: false,
                message: 'Branch query parameter is required',
            });
        }

        const filter = { branch };
        if (exam) filter.exam = exam;

        const subjects = await QuestionBank.aggregate([
            { $match: filter },
            { $unwind: '$subjects' },
            { $group: { _id: '$subjects.name' } },
            { $sort: { _id: 1 } },
        ]);

        const subjectNames = subjects.map((s) => s._id);
        res.status(200).json({
            success: true,
            count: subjectNames.length,
            data: subjectNames,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get distinct years for a branch and subject
// @route   GET /api/v1/years?branch=XYZ&subject=ABC&exam=GATE
// @access  Public
const getYears = async (req, res, next) => {
    try {
        const { branch, subject, exam } = req.query;

        if (!branch || !subject) {
            return res.status(400).json({
                success: false,
                message: 'Branch and subject query parameters are required',
            });
        }

        const filter = { branch };
        if (exam) filter.exam = exam;

        const years = await QuestionBank.aggregate([
            { $match: filter },
            { $unwind: '$subjects' },
            { $match: { 'subjects.name': subject } },
            { $unwind: '$subjects.years' },
            { $group: { _id: '$subjects.years.year' } },
            { $sort: { _id: -1 } },
        ]);

        const yearNumbers = years.map((y) => y._id);
        res.status(200).json({
            success: true,
            count: yearNumbers.length,
            data: yearNumbers,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get questions by exam, branch, subject, and year
// @route   GET /api/v1/questions?exam=GATE&branch=XYZ&subject=ABC&year=YYYY
// @access  Public
const getQuestions = async (req, res, next) => {
    try {
        const { exam, branch, subject, year, questionType, limit = 50, page = 1 } = req.query;

        if (!branch || !subject || !year) {
            return res.status(400).json({
                success: false,
                message: 'Branch, subject, and year query parameters are required',
            });
        }

        const filter = { branch };
        if (exam) filter.exam = exam;

        const bank = await QuestionBank.findOne(filter);
        if (!bank) {
            return res.status(404).json({
                success: false,
                message: 'Question bank not found',
            });
        }

        const subjectDoc = bank.subjects.find((s) => s.name === subject);
        if (!subjectDoc) {
            return res.status(404).json({
                success: false,
                message: 'Subject not found',
            });
        }

        const yearDoc = subjectDoc.years.find((y) => y.year === Number(year));
        if (!yearDoc) {
            return res.status(404).json({
                success: false,
                message: 'Year not found',
            });
        }

        let questions = yearDoc.questions || [];
        if (questionType) {
            questions = questions.filter((q) => q.questionType === questionType);
        }

        // Pagination
        const total = questions.length;
        const skip = (Number(page) - 1) * Number(limit);
        const paginatedQuestions = questions.slice(skip, skip + Number(limit));

        res.status(200).json({
            success: true,
            count: paginatedQuestions.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            data: paginatedQuestions,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Bulk upload questions (protected)
// @route   POST /api/v1/admin/bulk-upload
// @access  Private/Admin
const bulkUploadQuestions = async (req, res, next) => {
    try {
        const questions = req.body;

        if (!Array.isArray(questions) || questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Request body must be a non-empty array of question objects',
            });
        }

        // Basic validation before insert
        const invalidQuestions = questions.filter((q) => !q.branch || !q.subject || !q.year || !q.questionText || !q.correctAnswer);

        if (invalidQuestions.length > 0) {
            return res.status(400).json({
                success: false,
                message: `${invalidQuestions.length} question(s) are missing required fields (branch, subject, year, questionText, correctAnswer)`,
                invalidCount: invalidQuestions.length,
            });
        }

        // Group questions by exam, branch, subject, year
        const grouped = new Map();

        for (const q of questions) {
            const exam = q.exam || 'GATE';
            const key = `${exam}|${q.branch}|${q.subject}|${q.year}`;
            if (!grouped.has(key)) {
                grouped.set(key, {
                    exam,
                    branch: q.branch,
                    subjects: [],
                });
            }

            const bank = grouped.get(key);
            let subjectDoc = bank.subjects.find((s) => s.name === q.subject);
            if (!subjectDoc) {
                subjectDoc = { name: q.subject, years: [] };
                bank.subjects.push(subjectDoc);
            }

            let yearDoc = subjectDoc.years.find((y) => y.year === q.year);
            if (!yearDoc) {
                yearDoc = { year: q.year, questions: [] };
                subjectDoc.years.push(yearDoc);
            }

            // Remove _id if present and add to questions array
            const { _id, ...questionData } = q;
            yearDoc.questions.push(questionData);
        }

        const banks = Array.from(grouped.values());
        const result = await QuestionBank.insertMany(banks, { ordered: false });

        // Count total questions inserted
        let totalQuestions = 0;
        for (const bank of result) {
            for (const subject of bank.subjects) {
                for (const year of subject.years) {
                    totalQuestions += year.questions.length;
                }
            }
        }

        res.status(201).json({
            success: true,
            message: `Successfully inserted ${totalQuestions} questions into ${result.length} banks`,
            count: totalQuestions,
            data: result,
        });
    } catch (error) {
        // Handle partial bulk insert errors gracefully
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: 'Some questions already exist (duplicate key error). Please check for duplicates.',
                error: error.message,
            });
        }
        next(error);
    }
};

// @desc    Upload question images (protected)
// @route   POST /api/v1/admin/upload-images
// @access  Private/Admin
const uploadImages = async (req, res, next) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No image files provided',
            });
        }

        const imageUrls = req.files.map((file) => `/uploads/${file.filename}`);

        res.status(201).json({
            success: true,
            count: imageUrls.length,
            data: imageUrls,
        });
    } catch (error) {
        next(error);
    }
};

export {
    getBranches,
    getSubjects,
    getYears,
    getQuestions,
    bulkUploadQuestions,
    uploadImages,
};