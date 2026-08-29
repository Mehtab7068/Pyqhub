import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question.js';
import QuestionBank from '../models/QuestionBank.js';

dotenv.config();

const migrateQuestions = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing QuestionBank documents
        await QuestionBank.deleteMany({});
        console.log('Cleared existing QuestionBank documents');

        // Get all unique exam-branch-subject-year combinations
        const pipeline = [
            {
                group: {
                    _id: { exam: '$exam', branch: '$branch', subject: '$subject', year: '$year' },
                    questions: { $push: '$$ROOT' },
                },
            },
            {
                sort: { '_id.exam': 1, '_id.branch': 1, '_id.subject': 1, '_id.year': 1 },
            },
        ];

        const groupedQuestions = await Question.aggregate(pipeline);
        console.log(`Found ${groupedQuestions.length} unique combinations`);

        // Transform to hierarchical structure
        const bankMap = new Map();

        for (const group of groupedQuestions) {
            const { exam, branch, subject, year } = group._id;

            const bankKey = `${exam}|${branch}`;
            if (!bankMap.has(bankKey)) {
                bankMap.set(bankKey, {
                    exam,
                    branch,
                    subjects: [],
                });
            }

            const bank = bankMap.get(bankKey);
            let subjectDoc = bank.subjects.find((s) => s.name === subject);
            if (!subjectDoc) {
                subjectDoc = { name: subject, years: [] };
                bank.subjects.push(subjectDoc);
            }

            const yearDoc = subjectDoc.years.find((y) => y.year === year);
            if (!yearDoc) {
                yearDoc = { year, questions: [] };
                subjectDoc.years.push(yearDoc);
            }

            // Add questions (excluding the _id and the grouping fields)
            for (const q of group.questions) {
                const { _id, exam, branch, subject, year, ...questionData } = q;
                // Include yearTag for Option 2 unified format
                questionData.yearTag = year;
                yearDoc.questions.push(questionData);
            }
        }

        // Insert all QuestionBank documents
        const banks = Array.from(bankMap.values());
        const result = await QuestionBank.insertMany(banks, { ordered: false });
        console.log(`Migrated ${result.length} QuestionBank documents`);

        // Count total questions migrated
        let totalQuestions = 0;
        for (const bank of banks) {
            for (const subject of bank.subjects) {
                for (const year of subject.years) {
                    totalQuestions += year.questions.length;
                }
            }
        }
        console.log(`Total questions migrated: ${totalQuestions}`);

        console.log('Migration completed successfully');
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
};

migrateQuestions();