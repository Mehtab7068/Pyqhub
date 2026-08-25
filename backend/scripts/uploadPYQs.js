import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import 'dotenv/config';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

import QuestionBank from '../models/QuestionBank.js';

const DATA_FILE_PATH = path.join(__dirname, '..', '..', 'pyq_data.json');
const BATCH_SIZE = 100;

/**
 * Validates a single question object against the Mongoose schema constraints.
 * Returns an array of error messages. Empty array means valid.
 */
function validateQuestion(q, index) {
    const errors = [];

    if (!q || typeof q !== 'object') {
        return [`Question at index ${index} is not an object`];
    }

    if (!q.branch || typeof q.branch !== 'string') errors.push(`Index ${index}: branch is required and must be a string`);
    if (!q.subject || typeof q.subject !== 'string') errors.push(`Index ${index}: subject is required and must be a string`);
    if (!q.year || typeof q.year !== 'number') errors.push(`Index ${index}: year is required and must be a number`);
    if (!q.questionText || typeof q.questionText !== 'string') errors.push(`Index ${index}: questionText is required and must be a string`);
    if (!q.correctAnswer) errors.push(`Index ${index}: correctAnswer is required`);

    if (q.questionType && !['MCQ', 'MSQ', 'NAT'].includes(q.questionType)) {
        errors.push(`Index ${index}: questionType must be one of MCQ, MSQ, NAT`);
    }

    if (q.marks && ![1, 2].includes(q.marks)) {
        errors.push(`Index ${index}: marks must be 1 or 2`);
    }

    if (q.options && !Array.isArray(q.options)) {
        errors.push(`Index ${index}: options must be an array`);
    } else if (q.options) {
        q.options.forEach((opt, i) => {
            if (!opt.id || !opt.text) {
                errors.push(`Index ${index}, option ${i}: each option must have id and text`);
            }
        });
    }

    if (q.imageUrls && !Array.isArray(q.imageUrls)) {
        errors.push(`Index ${index}: imageUrls must be an array of strings`);
    }

    return errors;
}

/**
 * Groups flat questions into hierarchical QuestionBank structure.
 */
function groupQuestions(questions) {
    const bankMap = new Map();

    for (const q of questions) {
        const exam = q.exam || 'GATE';
        const key = `${exam}|${q.branch}`;

        if (!bankMap.has(key)) {
            bankMap.set(key, {
                exam,
                branch: q.branch,
                subjects: [],
            });
        }

        const bank = bankMap.get(key);
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

    return Array.from(bankMap.values());
}

/**
 * Reads the JSON file, validates entries, and inserts them into MongoDB in batches.
 */
async function uploadPYQs() {
    // Validate environment
    if (!process.env.MONGO_URI) {
        console.error('ERROR: MONGO_URI is not defined in the .env file.');
        process.exit(1);
    }

    // Read data file
    if (!fs.existsSync(DATA_FILE_PATH)) {
        console.error(`ERROR: Data file not found at ${DATA_FILE_PATH}`);
        console.error('Please create a pyq_data.json file in the project root.');
        process.exit(1);
    }

    const rawData = fs.readFileSync(DATA_FILE_PATH, 'utf-8');
    let questions;

    try {
        questions = JSON.parse(rawData);
    } catch (parseError) {
        console.error('ERROR: Failed to parse pyq_data.json. Ensure it is valid JSON.');
        console.error(parseError.message);
        process.exit(1);
    }

    if (!Array.isArray(questions)) {
        console.error('ERROR: pyq_data.json must contain a JSON array of question objects.');
        process.exit(1);
    }

    console.log(`Loaded ${questions.length} questions from pyq_data.json`);

    // Validate all questions
    const allErrors = [];
    questions.forEach((q, i) => {
        const errors = validateQuestion(q, i);
        allErrors.push(...errors);
    });

    if (allErrors.length > 0) {
        console.error(`Validation failed with ${allErrors.length} error(s):`);
        allErrors.forEach((err) => console.error(`  - ${err}`));
        process.exit(1);
    }

    console.log('Validation passed for all questions.');

    // Connect to MongoDB
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');
    } catch (connError) {
        console.error('ERROR: Failed to connect to MongoDB.');
        console.error(connError.message);
        process.exit(1);
    }

    // Group questions into hierarchical structure
    const banks = groupQuestions(questions);
    console.log(`Grouped into ${banks.length} QuestionBank documents`);

    // Insert in batches
    let totalInserted = 0;
    let totalSkipped = 0;

    for (let i = 0; i < banks.length; i += BATCH_SIZE) {
        const batch = banks.slice(i, i + BATCH_SIZE);
        const batchNumber = Math.floor(i / BATCH_SIZE) + 1;
        const totalBatches = Math.ceil(banks.length / BATCH_SIZE);

        try {
            const result = await QuestionBank.insertMany(batch, { ordered: false });
            totalInserted += result.length;
            console.log(`Batch ${batchNumber}/${totalBatches}: Inserted ${result.length} banks`);
        } catch (batchError) {
            // ordered: false allows partial success; count inserted documents
            if (batchError.insertedDocs) {
                totalInserted += batchError.insertedDocs.length;
                console.log(`Batch ${batchNumber}/${totalBatches}: Inserted ${batchError.insertedDocs.length} (partial due to duplicates)`);
            } else {
                console.error(`Batch ${batchNumber}/${totalBatches} failed:`, batchError.message);
            }
            totalSkipped += batch.length - (batchError.insertedDocs?.length || 0);
        }
    }

    // Count total questions inserted
    let totalQuestions = 0;
    for (const bank of banks) {
        for (const subject of bank.subjects) {
            for (const year of subject.years) {
                totalQuestions += year.questions.length;
            }
        }
    }

    console.log('\n--- Upload Summary ---');
    console.log(`Total questions processed: ${questions.length}`);
    console.log(`Total banks created:       ${banks.length}`);
    console.log(`Total questions inserted:  ${totalQuestions}`);
    console.log(`Skipped / duplicates:     ${totalSkipped}`);

    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
    process.exit(0);
}

// Handle unhandled rejections
process.on('unhandledRejection', (err) => {
    console.error('Unhandled Rejection:', err);
    process.exit(1);
});

uploadPYQs();