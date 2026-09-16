import mongoose from 'mongoose';

const questionReportSchema = new mongoose.Schema(
    {
        questionId: { type: String, required: true, index: true },
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        reason: {
            type: String,
            enum: [
                'incorrect_answer',
                'typo',
                'ambiguous_question',
                'broken_image',
                'wrong_explanation',
                'incorrect_marks',
                'incorrect_question_type',
                'duplicate_question',
                'other'
            ],
            required: true
        },
        description: { type: String, trim: true, maxlength: 500 },
        status: {
            type: String,
            enum: ['pending', 'under_review', 'resolved', 'rejected'],
            default: 'pending',
            index: true
        },
        adminNotes: { type: String, trim: true, maxlength: 1000 },
        reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        reviewedAt: Date,
    },
    { timestamps: true }
);

// Compound index for efficient queries
questionReportSchema.index({ questionId: 1, status: 1 });
questionReportSchema.index({ userId: 1, createdAt: -1 });

export default mongoose.model('QuestionReport', questionReportSchema);