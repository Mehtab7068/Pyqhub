import mongoose from 'mongoose';
import TestAttempt from '../models/TestAttempt.js';
import QuestionBank from '../models/QuestionBank.js';
import { verifyAttemptWithQuestions } from '../utils/scoring.js';

const createAttempt = async (req, res, next) => {
    try {
        const {
            mode,
            mockTestType = '',
            exam = 'GATE',
            branch = '',
            subject = '',
            chapter = '',
            responses = [],
            score,
            totalMarks,
            timeTaken = 0,
        } = req.body;

        if (!['practice', 'mock'].includes(mode)) {
            return res.status(400).json({ success: false, message: 'mode must be practice or mock' });
        }
        if (!Array.isArray(responses) || !Number.isFinite(Number(score)) || !Number.isFinite(Number(totalMarks))) {
            return res.status(400).json({ success: false, message: 'responses, score, and totalMarks are required' });
        }

        // Server-side score verification
        let verified = false;
        let verificationDetails = {};

        try {
            // Fetch actual questions from database for verification
            const questionIds = responses.map(r => r.questionId).filter(Boolean);
            const questions = await QuestionBank.aggregate([
                { $unwind: '$subjects' },
                { $unwind: '$subjects.years' },
                { $unwind: '$subjects.years.questions' },
                { $match: { 'subjects.years.questions._id': { $in: questionIds.map(id => new mongoose.Types.ObjectId(id)) } } },
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

            const verification = await verifyAttemptWithQuestions(responses, questions, exam);
            verified = verification.verified;
            verificationDetails = {
                verifiedAt: new Date(),
                discrepancies: verification.discrepancies,
                verifiedScore: verification.score,
                verifiedTotalMarks: verification.totalMarks,
                verifiedPercentage: verification.percentage,
            };
        } catch (verificationError) {
            console.error('Score verification failed:', verificationError);
            // If verification fails, we still save the attempt but mark as unverified
            verified = false;
            verificationDetails = {
                verifiedAt: new Date(),
                discrepancies: ['Verification failed: ' + verificationError.message],
            };
        }

        const attempt = await TestAttempt.create({
            userId: req.user.userId,
            mode,
            mockTestType,
            exam,
            branch,
            subject,
            chapter,
            responses,
            score: Number(score),
            totalMarks: Number(totalMarks),
            timeTaken: Math.max(0, Number(timeTaken) || 0),
            verified,
            verificationDetails,
        });

        res.status(201).json({ success: true, data: attempt });
    } catch (error) {
        next(error);
    }
};

const getAttempts = async (req, res, next) => {
    try {
        const limit = Math.min(Math.max(Number(req.query.limit) || 20, 1), 100);
        const attempts = await TestAttempt.find({ userId: req.user.userId })
            .sort({ submittedAt: -1 })
            .limit(limit)
            .lean();

        res.status(200).json({ success: true, count: attempts.length, data: attempts });
    } catch (error) {
        next(error);
    }
};

const getAttempt = async (req, res, next) => {
    try {
        const attempt = await TestAttempt.findOne({ _id: req.params.id, userId: req.user.userId }).lean();
        if (!attempt) return res.status(404).json({ success: false, message: 'Attempt not found' });
        res.status(200).json({ success: true, data: attempt });
    } catch (error) {
        next(error);
    }
};

const getLeaderboard = async (req, res, next) => {
    try {
        const { exam = 'GATE', mode = 'mock', period = 'all' } = req.query;
        const match = { exam, mode, totalMarks: { $gt: 0 }, verified: true };
        if (period === 'week' || period === 'month') {
            const days = period === 'week' ? 7 : 30;
            match.submittedAt = { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) };
        }

        const rows = await TestAttempt.aggregate([
            { $match: match },
            {
                $addFields: {
                    percentage: { $multiply: [{ $divide: ['$score', '$totalMarks'] }, 100] },
                },
            },
            { $sort: { percentage: -1, submittedAt: 1 } },
            { $group: { _id: '$userId', best: { $first: '$$ROOT' }, attempts: { $sum: 1 } } },
            { $sort: { 'best.percentage': -1, 'best.submittedAt': 1 } },
            { $limit: 100 },
            { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'user' } },
            { $unwind: '$user' },
            {
                $project: {
                    _id: 0,
                    name: '$user.name',
                    percentage: '$best.percentage',
                    score: '$best.score',
                    totalMarks: '$best.totalMarks',
                    attempts: 1,
                    submittedAt: '$best.submittedAt',
                    branch: '$best.branch',
                },
            },
        ]);

        const data = rows.map((row, index) => {
            const parts = String(row.name || 'Student').trim().split(/\s+/);
            const displayName = parts.length > 1 ? `${parts[0]} ${parts[parts.length - 1][0]}.` : parts[0];
            return { ...row, rank: index + 1, name: displayName };
        });

        res.status(200).json({ success: true, exam, mode, period, count: data.length, data });
    } catch (error) {
        next(error);
    }
};

export { createAttempt, getAttempts, getAttempt, getLeaderboard };