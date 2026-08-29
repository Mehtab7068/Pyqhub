import QuestionBank from '../models/QuestionBank.js';
import { uploadToS3, getSignedS3Url } from '../config/s3.js';

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

// @desc    Get distinct chapters for a branch and subject
// @route   GET /api/v1/chapters?branch=XYZ&subject=ABC&exam=GATE
// @access  Public
const getChapters = async (req, res, next) => {
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

        const chapters = await QuestionBank.aggregate([
            { $match: filter },
            { $unwind: '$subjects' },
            { $match: { 'subjects.name': subject } },
            { $unwind: '$subjects.years' },
            { $unwind: '$subjects.years.questions' },
            { $match: { 'subjects.years.questions.chapter': { $nin: ['', null] } } },
            { $group: { _id: '$subjects.years.questions.chapter' } },
            { $sort: { _id: 1 } },
        ]);

        // Trim chapter names for consistency
        const chapterNames = chapters.map((c) => c._id.trim());
        res.status(200).json({
            success: true,
            count: chapterNames.length,
            data: chapterNames,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get questions by exam, branch, subject, and optional year/chapter
// @route   GET /api/v1/questions?exam=GATE&branch=XYZ&subject=ABC&year=YYYY|all&chapter=XYZ
// @access  Public
const getQuestions = async (req, res, next) => {
    try {
        const { exam, branch, subject, year, chapter, questionType, limit = 50, page = 1 } = req.query;

        if (!branch || !subject) {
            return res.status(400).json({
                success: false,
                message: 'Branch and subject query parameters are required',
            });
        }

        const filter = { branch };
        if (exam) filter.exam = exam;

        const allYears = !year || year === 'all';

        // Aggregate across ALL matching QuestionBank docs (one per year-group)
        const pipeline = [
            { $match: filter },
            { $unwind: '$subjects' },
            { $match: { 'subjects.name': subject } },
            { $unwind: '$subjects.years' },
            ...(allYears ? [] : [{ $match: { 'subjects.years.year': Number(year) } }]),
            { $replaceRoot: { newRoot: '$subjects.years' } },
        ];

        const yearDocs = await QuestionBank.aggregate(pipeline);

        if (!yearDocs.length) {
            return res.status(404).json({
                success: false,
                message: allYears ? 'Subject not found' : 'Year not found',
            });
        }

        let questions = [];
        for (const doc of yearDocs) {
            const qs = (doc.questions || []).map((q) => ({ ...q, year: doc.year, yearTag: doc.year }));
            questions = questions.concat(qs);
        }
        if (chapter) {
            const normalizedChapter = chapter.trim().toLowerCase();
            questions = questions.filter((q) => q.chapter && q.chapter.trim().toLowerCase() === normalizedChapter);
        }
        if (questionType) {
            questions = questions.filter((q) => q.questionType === questionType);
        }

        // Check if no questions found for this subject/chapter
        const noQuestionsFound = questions.length === 0;

        // Pagination
        const total = questions.length;
        const skip = (Number(page) - 1) * Number(limit);
        const paginatedQuestions = questions.slice(skip, skip + Number(limit));

        const questionsWithSignedUrls = await Promise.all(
            paginatedQuestions.map(async (q) => ({
                ...q,
                imageUrls: q.imageUrls?.length
                    ? await Promise.all(q.imageUrls.map(getSignedS3Url))
                    : [],
            }))
        );

        res.status(200).json({
            success: true,
            noQuestionsFound,
            count: paginatedQuestions.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / Number(limit)),
            data: questionsWithSignedUrls,
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

        // Validate each question
        const errors = [];
        questions.forEach((q, i) => {
            const n = q.questionNumber ?? i + 1;
            // Support both year and yearTag (Option 2 unified format)
            const yearValue = q.year ?? q.yearTag;
            if (!q.branch || !q.subject || !q.questionText) {
                errors.push(`Q${n}: missing required fields (branch, subject, questionText)`);
                return;
            }
            // Normalize year field - default to current year if not provided
            const currentYear = new Date().getFullYear();
            q.year = yearValue ? Number(yearValue) : currentYear;
            if (isNaN(q.year)) {
                errors.push(`Q${n}: invalid year/yearTag value`);
                return;
            }
            if (!['MCQ', 'MSQ', 'NAT'].includes(q.questionType)) {
                errors.push(`Q${n}: questionType must be MCQ, MSQ or NAT`);
                return;
            }
            // correctAnswer present (0 is a valid NAT answer, so check explicitly)
            if (q.correctAnswer === undefined || q.correctAnswer === null || q.correctAnswer === ''
                || (Array.isArray(q.correctAnswer) && q.correctAnswer.length === 0)) {
                errors.push(`Q${n}: correctAnswer is required`);
                return;
            }
            if (q.questionType === 'NAT') {
                if (isNaN(Number(q.correctAnswer))) {
                    errors.push(`Q${n}: NAT correctAnswer must be a number`);
                }
            } else {
                const optionIds = (q.options || []).map((o) => o.id);
                if (optionIds.length < 2) {
                    errors.push(`Q${n}: at least 2 options are required`);
                } else if (q.questionType === 'MCQ' && !optionIds.includes(q.correctAnswer)) {
                    errors.push(`Q${n}: MCQ correctAnswer "${q.correctAnswer}" is not one of the option ids`);
                } else if (q.questionType === 'MSQ') {
                    if (!Array.isArray(q.correctAnswer)) {
                        errors.push(`Q${n}: MSQ correctAnswer must be an array of option ids`);
                    } else {
                        const bad = q.correctAnswer.filter((id) => !optionIds.includes(id));
                        if (bad.length > 0) {
                            errors.push(`Q${n}: MSQ correctAnswer contains invalid option ids: ${bad.join(', ')}`);
                        }
                    }
                }
            }
        });

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Validation failed: ${errors[0]}${errors.length > 1 ? ` (+${errors.length - 1} more)` : ''}`,
                errors,
            });
        }

        // Group questions by exam|branch|subject|year
        const grouped = new Map();
        for (const q of questions) {
            const exam = q.exam || 'GATE';
            const key = `${exam}|${q.branch}|${q.subject}|${q.year}`;
            if (!grouped.has(key)) grouped.set(key, { exam, branch: q.branch, subject: q.subject, year: Number(q.year), questions: [] });
            const { _id, exam: _e, branch: _b, subject: _s, year: _y, yearTag: _yt, ...questionData } = q;
            // Explicitly ensure questionNumber is set
            questionData.questionNumber = q.questionNumber && q.questionNumber >= 1 ? Number(q.questionNumber) : (Number(q._index) || 1);
            // Include yearTag in questionData for Option 2 format
            questionData.yearTag = q.year;
            grouped.get(key).questions.push(questionData);
        }

        // Upsert: merge into existing QuestionBank docs instead of creating duplicates
        let totalInserted = 0;
        let totalUpdated = 0;

        for (const group of grouped.values()) {
            let bank = await QuestionBank.findOne({ exam: group.exam, branch: group.branch });

            if (!bank) {
                bank = new QuestionBank({ exam: group.exam, branch: group.branch, subjects: [] });
            }

            let subjectDoc = bank.subjects.find((s) => s.name === group.subject);
            if (!subjectDoc) {
                subjectDoc = { name: group.subject, years: [] };
                bank.subjects.push(subjectDoc);
            }

            let yearDoc = subjectDoc.years.find((y) => y.year === group.year);
            if (!yearDoc) {
                yearDoc = { year: group.year, questions: [] };
                subjectDoc.years.push(yearDoc);
            }

            // Replace questions with same questionNumber, append new ones
            for (const newQ of group.questions) {
                const existingIdx = yearDoc.questions.findIndex((eq) => eq.questionNumber === newQ.questionNumber);
                if (existingIdx >= 0) {
                    yearDoc.questions[existingIdx] = newQ;
                    totalUpdated++;
                } else {
                    yearDoc.questions.push(newQ);
                    totalInserted++;
                }
            }

            // Keep questions sorted by questionNumber
            yearDoc.questions.sort((a, b) => a.questionNumber - b.questionNumber);

            // Rebuild subjects array so Mongoose detects nested array changes
            bank.subjects = bank.subjects.map((s) => ({
                name: s.name,
                years: s.years.map((y) => ({
                    year: y.year,
                    questions: y.questions.map((q) => ({ ...q })),
                })),
            }));
            bank.markModified('subjects');

            await bank.save();
        }

        res.status(201).json({
            success: true,
            message: `Upload complete: ${totalInserted} new, ${totalUpdated} updated`,
            count: totalInserted + totalUpdated,
            inserted: totalInserted,
            updated: totalUpdated,
        });
    } catch (error) {
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

        const imageUrls = await Promise.all(
            req.files.map(async (file) => {
                const ext = file.originalname.split('.').pop() || 'png';
                const key = `questions/${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;
                return uploadToS3(file.buffer, key, file.mimetype);
            })
        );

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
    getChapters,
    getQuestions,
    bulkUploadQuestions,
    uploadImages,
};