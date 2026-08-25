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
    }
);

const yearSchema = new mongoose.Schema(
    {
        year: {
            type: Number,
            required: [true, 'Year is required'],
            min: [2000, 'Year seems invalid'],
            max: [2100, 'Year seems invalid'],
        },
        questions: {
            type: [questionSchema],
            default: [],
        },
    },
    { _id: false }
);

const subjectSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Subject name is required'],
            trim: true,
        },
        years: {
            type: [yearSchema],
            default: [],
        },
    },
    { _id: false }
);

const questionBankSchema = new mongoose.Schema(
    {
        exam: {
            type: String,
            required: [true, 'Exam is required'],
            trim: true,
            default: 'GATE',
            index: true,
        },
        branch: {
            type: String,
            required: [true, 'Branch is required'],
            trim: true,
            index: true,
        },
        subjects: {
            type: [subjectSchema],
            default: [],
        },
    },
    {
        timestamps: true,
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Compound indexes for efficient hierarchical queries
questionBankSchema.index({ exam: 1, branch: 1 });
questionBankSchema.index({ exam: 1, branch: 1, 'subjects.name': 1 });
questionBankSchema.index({ exam: 1, branch: 1, 'subjects.name': 1, 'subjects.years.year': 1 });
questionBankSchema.index({ exam: 1, 'subjects.name': 1 });
questionBankSchema.index({ branch: 1, 'subjects.name': 1 });

export default mongoose.model('QuestionBank', questionBankSchema);