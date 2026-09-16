import { getExamConfig } from '../config/examConfig.js';

/**
 * Calculate marks awarded for a single question based on exam rules
 * @param {Object} question - The question object with correctAnswer, questionType, marks, etc.
 * @param {*} answer - The user's answer
 * @param {string} exam - The exam type (GATE, JEE_MAINS, NEET, etc.)
 * @returns {number} Marks awarded (can be negative for wrong MCQ answers)
 */
export function calculateMarksAwarded(question, answer, exam = 'GATE') {
    const config = getExamConfig(exam);

    // Check if answer is provided
    if (answer === undefined || answer === '' || answer === null) {
        return 0; // Unanswered
    }

    // Check if answer is correct
    const isCorrect = isAnswerCorrect(question, answer);

    if (isCorrect) {
        return question.marks || config.marks[0] || 1;
    }

    // Wrong answer - apply negative marking for MCQ only
    if (question.questionType === 'MCQ') {
        // Get negative marking for this exam
        const negativeMark = getNegativeMarking(exam, question.marks);
        return negativeMark;
    }

    // MSQ and NAT have no negative marking
    return 0;
}

/**
 * Check if the user's answer is correct
 * @param {Object} question - The question object
 * @param {*} answer - The user's answer
 * @returns {boolean} Whether the answer is correct
 */
export function isAnswerCorrect(question, answer) {
    if (answer === undefined || answer === '' || answer === null) {
        return false;
    }

    if (question.questionType === 'MSQ') {
        const selected = Array.isArray(answer) ? answer : [answer];
        const expected = Array.isArray(question.correctAnswer) ? question.correctAnswer : [question.correctAnswer];
        return JSON.stringify([...selected].sort()) === JSON.stringify([...expected].sort());
    }

    if (question.questionType === 'NAT') {
        const expected = question.correctAnswer;
        const min = question.natRange?.min ?? Number(expected) - 1e-6;
        const max = question.natRange?.max ?? Number(expected) + 1e-6;
        return Number(answer) >= Number(min) && Number(answer) <= Number(max);
    }

    // MCQ
    return String(answer) === String(question.correctAnswer);
}

/**
 * Get negative marking for an exam
 * @param {string} exam - The exam type
 * @param {number} marks - The marks for the question
 * @returns {number} Negative marks (negative number)
 */
export function getNegativeMarking(exam, marks) {
    const config = getExamConfig(exam);

    // Default GATE negative marking
    if (exam === 'GATE') {
        return marks === 2 ? -2 / 3 : -1 / 3;
    }

    // JEE Mains: -1 for 4 marks
    if (exam === 'JEE_MAINS') {
        return -1;
    }

    // NEET: -1 for 4 marks
    if (exam === 'NEET') {
        return -1;
    }

    // SSC CGL: -0.5 for 2 marks
    if (exam === 'SSC_CGL') {
        return -0.5;
    }

    // NDA: -0.83 for 2.5 marks (1/3 negative)
    if (exam === 'NDA') {
        return -marks / 3;
    }

    // UPSC: -0.66 for 2 marks (1/3 negative)
    if (exam === 'UPSC') {
        return -marks / 3;
    }

    // Default: no negative marking
    return 0;
}

/**
 * Calculate total score for an attempt
 * @param {Array} questions - Array of question objects
 * @param {Object} answers - Map of questionId to answer
 * @param {string} exam - The exam type
 * @returns {Object} { score, totalMarks, percentage }
 */
export function calculateTotalScore(questions, answers, exam = 'GATE') {
    let score = 0;
    let totalMarks = 0;

    for (const question of questions) {
        const userAnswer = answers[question._id] || answers[question.questionId];
        const marksAwarded = calculateMarksAwarded(question, userAnswer, exam);
        score += marksAwarded;
        totalMarks += question.marks || 1;
    }

    const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;

    return { score, totalMarks, percentage };
}

/**
 * Verify a submitted attempt's score
 * @param {Object} attemptData - The attempt data from frontend
 * @returns {Object} { verified: boolean, score, totalMarks, percentage, discrepancies: Array }
 */
export function verifyAttemptScore(attemptData) {
    const { responses, exam, score: submittedScore, totalMarks: submittedTotalMarks } = attemptData;

    // Reconstruct questions from responses
    const questions = responses.map(r => ({
        _id: r.questionId,
        questionType: r.questionType,
        marks: r.marksAwarded > 0 ? r.marksAwarded : 1, // This is approximate, we need actual question data
        correctAnswer: r.correct ? r.answer : null, // We don't have the correct answer in responses
        questionType: r.questionType,
    }));

    // Since we don't have full question data in responses, we'll verify using the marksAwarded field
    let calculatedScore = 0;
    let calculatedTotalMarks = 0;

    for (const response of responses) {
        calculatedScore += response.marksAwarded || 0;
        // We need the actual question marks - this is a limitation
        // For now, we'll trust the marksAwarded but flag if score doesn't match
    }

    const discrepancies = [];

    if (Math.abs(calculatedScore - submittedScore) > 0.01) {
        discrepancies.push(`Score mismatch: submitted ${submittedScore}, calculated ${calculatedScore}`);
    }

    return {
        verified: discrepancies.length === 0,
        score: calculatedScore,
        totalMarks: calculatedTotalMarks,
        percentage: calculatedTotalMarks > 0 ? Math.round((calculatedScore / calculatedTotalMarks) * 100) : 0,
        discrepancies
    };
}

/**
 * Full verification using actual question data from database
 * This should be used when we have access to the actual questions
 * @param {Array} responses - User responses
 * @param {Array} questions - Actual questions from database
 * @param {string} exam - Exam type
 * @returns {Object} Verification result
 */
export async function verifyAttemptWithQuestions(responses, questions, exam = 'GATE') {
    const questionMap = new Map(questions.map(q => [String(q._id), q]));

    let score = 0;
    let totalMarks = 0;
    const discrepancies = [];

    for (const response of responses) {
        const question = questionMap.get(String(response.questionId));

        if (!question) {
            discrepancies.push(`Question ${response.questionId} not found in database`);
            continue;
        }

        const marksAwarded = calculateMarksAwarded(question, response.answer, exam);
        score += marksAwarded;
        totalMarks += question.marks || 1;

        // Check if the stored marksAwarded matches our calculation
        if (response.marksAwarded !== undefined && Math.abs(response.marksAwarded - marksAwarded) > 0.01) {
            discrepancies.push(`Marks mismatch for question ${response.questionId}: stored ${response.marksAwarded}, calculated ${marksAwarded}`);
        }
    }

    const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;

    return {
        verified: discrepancies.length === 0,
        score,
        totalMarks,
        percentage,
        discrepancies
    };
}

export default {
    calculateMarksAwarded,
    isAnswerCorrect,
    getNegativeMarking,
    calculateTotalScore,
    verifyAttemptScore,
    verifyAttemptWithQuestions
};