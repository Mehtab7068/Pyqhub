import mongoose from 'mongoose';

const optionSchema = new mongoose.Schema(
    {
        id: { type: String, required: true },
        text: { type: String, required: true },
    },
    { _id: false }
);

const questionSchema = new mongoose.Schema(
    {
        exam: {
            type: String,
            required: [true, 'Exam is required'],
            trim: true,
            default: 'GATE',
        },
        branch: {
            type: String,
            required: [true, 'Branch is required'],
            trim: true,
        },
        subject: {
            type: String,
            required: [true, 'Subject is required'],
            trim: true,
        },
        year: {
            type: Number,
            required: [true, 'Year is required'],
            min: [2000, 'Year seems invalid'],
            max: [2100, 'Year seems invalid'],
            index: true,
        },
        yearTag: {
            type: Number,
            min: [2000, 'Year seems invalid'],
            max: [2100, 'Year seems invalid'],
        },
        questionType: {
            type: String,
            enum: {
                values: ['MCQ', 'MSQ', 'NAT'],
                message: '{VALUE} is not a valid question type',
            },
            required: [true, 'Question type is required'],
        },
        marks: {
            type: Number,
            enum: {
                values: [1, 2],
                message: '{VALUE} is not a valid marks value',
            },
            required: [true, 'Marks is required'],
        },
        questionText: {
            type: String,
            required: [true, 'Question text is required'],
        },
        options: {
            type: [optionSchema],
            validate: {
                validator: function (arr) {
                    if (!arr || arr.length === 0) return true;
                    return arr.length >= 2;
                },
                message: 'At least 2 options are required if options are provided',
            },
        },
        correctAnswer: {
            type: mongoose.Schema.Types.Mixed,
            required: [true, 'Correct answer is required'],
        },
        explanation: {
            type: String,
            default: '',
        },
        imageUrls: {
            type: [String],
            default: [],
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Compound index optimized for the four-tier hierarchy queries
questionSchema.index({ exam: 1, branch: 1, subject: 1, year: 1 });

// Additional indexes for common filter patterns
questionSchema.index({ exam: 1, branch: 1, subject: 1 });
questionSchema.index({ exam: 1, branch: 1 });
questionSchema.index({ exam: 1, subject: 1 });

// Virtual for yearTag (alias for year) - Option 2 unified format
questionSchema.virtual('yearTag').get(function () {
    return this.year;
}).set(function (value) {
    this.year = value;
});

// Ensure virtuals are included in JSON output
questionSchema.set('toJSON', { virtuals: true });
questionSchema.set('toObject', { virtuals: true });

export default mongoose.model('Question', questionSchema);