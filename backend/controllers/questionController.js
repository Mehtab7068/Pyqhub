import mongoose from 'mongoose';
import QuestionBank from '../models/QuestionBank.js';
import { uploadToS3, getSignedS3Url } from '../config/s3.js';
import { getExamConfig } from '../config/examConfig.js';

const normalizeChapterName = (value) => {
    const normalized = String(value || '').trim().toLowerCase().replace(/\s+/g, ' ');
    return normalized === 'verbal aptitude' ? 'verbal ability' : normalized;
};

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

        // First, let's check if the subject exists
        const bank = await QuestionBank.findOne(filter);
        if (!bank) {
            return res.status(200).json({ success: true, count: 0, data: [] });
        }

        const subjectDoc = bank.subjects.find((s) => s.name === subject);
        if (!subjectDoc) {
            return res.status(200).json({ success: true, count: 0, data: [] });
        }

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

        // Normalize chapter names for consistency (trim, collapse spaces)
        const chapterNames = chapters.map((c) => c._id.trim().replace(/\s+/g, ' '));
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
            // Normalize the requested chapter: trim, lowercase, collapse spaces
            const normalizedChapter = normalizeChapterName(chapter);
            questions = questions.filter((q) => {
                // Handle missing, null, or undefined chapter field
                if (!q.chapter || typeof q.chapter !== 'string') return false;
                // Normalize stored chapter the same way
                const qChapter = normalizeChapterName(q.chapter);
                return qChapter === normalizedChapter;
            });
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
            const examConfig = getExamConfig(q.exam || 'GATE');
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
            if (!examConfig.questionTypes.includes(q.questionType)) {
                errors.push(`Q${n}: ${q.questionType} is not supported for ${q.exam || 'GATE'}`);
            }
            if (q.marks !== undefined && !examConfig.marks.includes(Number(q.marks))) {
                errors.push(`Q${n}: marks must be one of ${examConfig.marks.join(', ')} for ${q.exam || 'GATE'}`);
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
                // Mock test specific validation
                if (q.mockTestWeight !== undefined && (!Number.isInteger(q.mockTestWeight) || q.mockTestWeight < 1 || q.mockTestWeight > 5)) {
                    errors.push(`Q${n}: mockTestWeight must be an integer between 1 and 5`);
                }
                if (q.isCoreConcept !== undefined && typeof q.isCoreConcept !== 'boolean') {
                    errors.push(`Q${n}: isCoreConcept must be a boolean`);
                }
                if (q.difficulty !== undefined && !['easy', 'medium', 'hard'].includes(q.difficulty)) {
                    errors.push(`Q${n}: difficulty must be 'easy', 'medium', or 'hard'`);
                }
                if (q.tags !== undefined && (!Array.isArray(q.tags) || q.tags.some(t => typeof t !== 'string'))) {
                    errors.push(`Q${n}: tags must be an array of strings`);
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
            // Do NOT set questionNumber here - let the upsert logic assign unique numbers if missing
            // Only include questionNumber if a valid one was provided
            if (q.questionNumber && q.questionNumber >= 1) {
                questionData.questionNumber = Number(q.questionNumber);
            }
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
                // Create proper Mongoose subdocument by pushing and then getting the reference
                bank.subjects.push({ name: group.subject, years: [] });
                subjectDoc = bank.subjects[bank.subjects.length - 1];
            }

            let yearDoc = subjectDoc.years.find((y) => y.year === group.year);
            if (!yearDoc) {
                // Create proper Mongoose subdocument by pushing and then getting the reference
                subjectDoc.years.push({ year: group.year, questions: [] });
                yearDoc = subjectDoc.years[subjectDoc.years.length - 1];
            }

            // Replace questions with same questionNumber, otherwise append new ones.
            // If a questionNumber is missing, assign a unique sequential number based on existing entries.
            for (const newQ of group.questions) {
                // Ensure a valid questionNumber
                if (!newQ.questionNumber || Number(newQ.questionNumber) < 1) {
                    const existingNumbers = yearDoc.questions.map((q) => q.questionNumber).filter(Boolean);
                    const maxNumber = existingNumbers.length ? Math.max(...existingNumbers) : 0;
                    newQ.questionNumber = maxNumber + 1;
                }
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

            // Mark the nested array as modified so Mongoose persists the changes
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

// @desc    Get mock test questions
// @route   GET /api/v1/mock-test/questions?branch=XYZ&subject=ABC&mockTestType=full
// @access  Public
const getMockTestQuestions = async (req, res, next) => {
    try {
        const { exam, branch, subject, mockTestType, year, chapter, questionType, limit = 500 } = req.query;

        if (!branch || !subject || !mockTestType) {
            return res.status(400).json({
                success: false,
                message: 'Branch, subject, and mockTestType query parameters are required',
            });
        }

        const filter = { branch };
        if (exam) filter.exam = exam;

        // Determine year range based on mock test type
        let yearFilter = {};
        const currentYear = new Date().getFullYear();

        switch (mockTestType) {
            case 'full':
                // Full mock test: use all years, but limit to recent years for relevance
                yearFilter = { $gte: currentYear - 10, $lte: currentYear };
                break;
            case 'subject':
                // Subject-wise: use all years
                yearFilter = { $gte: currentYear - 15, $lte: currentYear };
                break;
            case 'chapter':
                // Chapter-wise: use all years
                yearFilter = { $gte: currentYear - 15, $lte: currentYear };
                break;
            case 'previous':
                // Previous year: only the most recent year
                yearFilter = { $eq: currentYear - 1 };
                break;
            default:
                yearFilter = { $gte: currentYear - 10, $lte: currentYear };
        }

        const allYears = !year || year === 'all';

        // Aggregate across ALL matching QuestionBank docs
        const pipeline = [
            { $match: filter },
            { $unwind: '$subjects' },
            { $match: { 'subjects.name': subject } },
            { $unwind: '$subjects.years' },
            ...(allYears ? [{ $match: { 'subjects.years.year': yearFilter } }] : [{ $match: { 'subjects.years.year': Number(year) } }]),
            { $replaceRoot: { newRoot: '$subjects.years' } },
        ];

        const yearDocs = await QuestionBank.aggregate(pipeline);

        if (!yearDocs.length) {
            return res.status(404).json({
                success: false,
                noQuestionsFound: true,
                message: allYears ? 'Subject not found' : 'Year not found',
            });
        }

        let questions = [];
        for (const doc of yearDocs) {
            const qs = (doc.questions || []).map((q) => ({ ...q, year: doc.year, yearTag: doc.year }));
            questions = questions.concat(qs);
        }

        if (chapter) {
            const normalizedChapter = chapter.trim().toLowerCase().replace(/\s+/g, ' ');
            questions = questions.filter((q) => {
                if (!q.chapter || typeof q.chapter !== 'string') return false;
                const qChapter = q.chapter.trim().toLowerCase().replace(/\s+/g, ' ');
                return qChapter === normalizedChapter;
            });
        }
        if (questionType) {
            questions = questions.filter((q) => q.questionType === questionType);
        }

        // For mock tests, we might want to shuffle and limit questions
        // Weighted selection for mock tests
        const questionLimits = getExamConfig(exam).mockLimits;
        const maxQuestions = questionLimits[mockTestType] || 50;

        // Separate core concept questions (must be included)
        const coreQuestions = questions.filter((q) => q.isCoreConcept);
        let selected = [];
        if (coreQuestions.length >= maxQuestions) {
            // If core questions exceed limit, truncate
            selected = coreQuestions.slice(0, maxQuestions);
        } else {
            selected = [...coreQuestions];
            const remaining = maxQuestions - coreQuestions.length;
            // Build weighted pool for remaining questions (exclude core already selected)
            const pool = [];
            for (const q of questions) {
                if (q.isCoreConcept) continue; // already accounted for
                const weight = Number.isInteger(q.mockTestWeight) && q.mockTestWeight > 0 ? q.mockTestWeight : 1;
                for (let i = 0; i < weight; i++) {
                    pool.push(q);
                }
            }
            // Shuffle weighted pool
            pool.sort(() => Math.random() - 0.5);
            const seen = new Set(selected.map((s) => `${s.year}-${s.questionNumber}`));
            for (const q of pool) {
                if (selected.length >= maxQuestions) break;
                const uniqueKey = `${q.year}-${q.questionNumber}`;
                if (!seen.has(uniqueKey)) {
                    selected.push(q);
                    seen.add(uniqueKey);
                }
            }
        }
        questions = selected;

        // Check if no questions found for this subject/chapter
        const noQuestionsFound = questions.length === 0;

        // Pagination
        const total = questions.length;
        const skip = (Number(req.query.page) - 1) * Number(limit);
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
            page: Number(req.query.page) || 1,
            pages: Math.ceil(total / Number(limit)),
            data: questionsWithSignedUrls,
        });
    } catch (error) {
        next(error);
    }
};

const getQuestionsByIds = async (req, res, next) => {
    try {
        const ids = String(req.query.ids || '')
            .split(',')
            .map((id) => id.trim())
            .filter((id) => mongoose.isValidObjectId(id))
            .map((id) => new mongoose.Types.ObjectId(id));

        if (ids.length === 0) {
            return res.status(400).json({ success: false, message: 'At least one valid question id is required' });
        }

        const questions = await QuestionBank.aggregate([
            { $unwind: '$subjects' },
            { $unwind: '$subjects.years' },
            { $unwind: '$subjects.years.questions' },
            { $match: { 'subjects.years.questions._id': { $in: ids } } },
            {
                $replaceRoot: {
                    newRoot: {
                        $mergeObjects: [
                            '$subjects.years.questions',
                            {
                                exam: '$exam',
                                branch: '$branch',
                                subject: '$subjects.name',
                                year: '$subjects.years.year',
                                yearTag: '$subjects.years.year',
                            },
                        ],
                    },
                },
            },
        ]);

        const data = await Promise.all(questions.map(async (question) => ({
            ...question,
            imageUrls: question.imageUrls?.length
                ? await Promise.all(question.imageUrls.map(getSignedS3Url))
                : [],
        })));

        res.status(200).json({ success: true, count: data.length, data });
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
    getQuestionsByIds,
    getMockTestQuestions,
    bulkUploadQuestions,
    uploadImages,
};