import mongoose from 'mongoose';

const responseSchema = new mongoose.Schema(
    {
        questionId: { type: String, required: true },
        answer: { type: mongoose.Schema.Types.Mixed },
        correct: { type: Boolean, default: false },
        marksAwarded: { type: Number, default: 0 },
        timeSpent: { type: Number, default: 0, min: 0 },
        confidence: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
        subject: { type: String, default: '' },
        chapter: { type: String, default: '' },
        topic: { type: String, default: '' },
        difficulty: { type: String, default: '' },
        questionType: { type: String, default: '' },
    },
    { _id: false }
);

const testAttemptSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
        mode: { type: String, enum: ['practice', 'mock'], required: true },
        mockTestType: { type: String, default: '' },
        exam: { type: String, default: 'GATE', trim: true },
        branch: { type: String, trim: true, default: '' },
        subject: { type: String, trim: true, default: '' },
        chapter: { type: String, trim: true, default: '' },
        responses: { type: [responseSchema], default: [] },
        score: { type: Number, required: true },
        totalMarks: { type: Number, required: true, min: 0 },
        timeTaken: { type: Number, default: 0, min: 0 },
        submittedAt: { type: Date, default: Date.now },
        verified: { type: Boolean, default: false },
        verificationDetails: {
            verifiedAt: Date,
            discrepancies: [String],
            verifiedScore: Number,
            verifiedTotalMarks: Number,
            verifiedPercentage: Number,
        },
    },
    { timestamps: true }
);

testAttemptSchema.index({ userId: 1, submittedAt: -1 });

export default mongoose.model('TestAttempt', testAttemptSchema);