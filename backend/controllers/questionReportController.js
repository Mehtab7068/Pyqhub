import QuestionReport from '../models/QuestionReport.js';
import QuestionBank from '../models/QuestionBank.js';
import mongoose from 'mongoose';

// @desc    Report a question
// @route   POST /api/v1/questions/report
// @access  Private
const reportQuestion = async (req, res, next) => {
    try {
        const { questionId, reason, description } = req.body;

        if (!questionId || !reason) {
            return res.status(400).json({
                success: false,
                message: 'questionId and reason are required'
            });
        }

        // Check if question exists
        const questionExists = await QuestionBank.aggregate([
            { $unwind: '$subjects' },
            { $unwind: '$subjects.years' },
            { $unwind: '$subjects.years.questions' },
            { $match: { 'subjects.years.questions._id': new mongoose.Types.ObjectId(questionId) } },
            { $limit: 1 }
        ]);

        if (!questionExists.length) {
            return res.status(404).json({
                success: false,
                message: 'Question not found'
            });
        }

        // Check if user already reported this question
        const existingReport = await QuestionReport.findOne({
            questionId,
            userId: req.user.userId
        });

        if (existingReport) {
            return res.status(400).json({
                success: false,
                message: 'You have already reported this question'
            });
        }

        const report = await QuestionReport.create({
            questionId,
            userId: req.user.userId,
            reason,
            description: description || ''
        });

        res.status(201).json({
            success: true,
            message: 'Question reported successfully',
            data: report
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get user's reports
// @route   GET /api/v1/questions/reports/my
// @access  Private
const getMyReports = async (req, res, next) => {
    try {
        const reports = await QuestionReport.find({ userId: req.user.userId })
            .sort({ createdAt: -1 })
            .limit(50)
            .lean();

        res.status(200).json({
            success: true,
            count: reports.length,
            data: reports
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all reports (admin)
// @route   GET /api/v1/admin/questions/reports
// @access  Private/Admin
const getAllReports = async (req, res, next) => {
    try {
        const { status, reason, page = 1, limit = 20 } = req.query;
        const filter = {};

        if (status) filter.status = status;
        if (reason) filter.reason = reason;

        const reports = await QuestionReport.find(filter)
            .populate('userId', 'name email')
            .populate('reviewedBy', 'name email')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit)
            .lean();

        const total = await QuestionReport.countDocuments(filter);

        res.status(200).json({
            success: true,
            count: reports.length,
            total,
            page: Number(page),
            pages: Math.ceil(total / limit),
            data: reports
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update report status (admin)
// @route   PUT /api/v1/admin/questions/reports/:id
// @access  Private/Admin
const updateReportStatus = async (req, res, next) => {
    try {
        const { status, adminNotes } = req.body;

        if (!['pending', 'under_review', 'resolved', 'rejected'].includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid status'
            });
        }

        const report = await QuestionReport.findByIdAndUpdate(
            req.params.id,
            {
                status,
                adminNotes: adminNotes || '',
                reviewedBy: req.user.userId,
                reviewedAt: new Date()
            },
            { new: true }
        ).populate('userId', 'name email').populate('reviewedBy', 'name email');

        if (!report) {
            return res.status(404).json({
                success: false,
                message: 'Report not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Report status updated',
            data: report
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get report statistics (admin)
// @route   GET /api/v1/admin/questions/reports/stats
// @access  Private/Admin
const getReportStats = async (req, res, next) => {
    try {
        const stats = await QuestionReport.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const reasonStats = await QuestionReport.aggregate([
            {
                $group: {
                    _id: '$reason',
                    count: { $sum: 1 }
                }
            }
        ]);

        const recentReports = await QuestionReport.find()
            .sort({ createdAt: -1 })
            .limit(10)
            .populate('userId', 'name email')
            .lean();

        res.status(200).json({
            success: true,
            data: {
                byStatus: stats,
                byReason: reasonStats,
                recentReports
            }
        });
    } catch (error) {
        next(error);
    }
};

export {
    reportQuestion,
    getMyReports,
    getAllReports,
    updateReportStatus,
    getReportStats
};