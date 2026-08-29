import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

export const fetchQuestions = createAsyncThunk(
    'test/fetchQuestions',
    async ({ exam, branch, subject, chapter }, { rejectWithValue }) => {
        try {
            const params = { exam, branch, subject, year: 'all', limit: 500 };
            if (chapter) params.chapter = chapter;
            const { data } = await api.get('/questions', { params });
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch questions');
        }
    }
);

const initialState = {
    questions: [],
    currentIndex: 0,
    answers: {},           // { questionId: selectedOptionId(s) }
    submittedAnswers: {},  // { questionId: true } — per-question submit (practice mode)
    questionTimes: {},     // { questionId: secondsSpent }
    markedForReview: [], // array of question ids
    timeRemaining: 0,  // seconds
    isSubmitted: false,
    score: null,
    loading: false,
    error: null,
    noQuestionsFound: false,
    testConfig: {
        durationMinutes: 180, // default 3 hours
        totalMarks: 0,
    },
};

const testSlice = createSlice({
    name: 'test',
    initialState,
    reducers: {
        setCurrentIndex(state, action) {
            state.currentIndex = action.payload;
        },
        setAnswer(state, action) {
            const { questionId, answer } = action.payload;
            state.answers[questionId] = answer;
        },
        submitAnswer(state, action) {
            const questionId = action.payload;
            state.submittedAnswers[questionId] = true;
        },
        incrementQuestionTime(state, action) {
            const questionId = action.payload;
            state.questionTimes[questionId] = (state.questionTimes[questionId] || 0) + 1;
        },
        toggleMarkForReview(state, action) {
            const questionId = action.payload;
            const index = state.markedForReview.indexOf(questionId);
            if (index >= 0) {
                state.markedForReview.splice(index, 1);
            } else {
                state.markedForReview.push(questionId);
            }
        },
        setTimeRemaining(state, action) {
            state.timeRemaining = action.payload;
        },
        submitTest(state) {
            state.isSubmitted = true;
            // Calculate score
            let score = 0;
            state.questions.forEach((q) => {
                const userAnswer = state.answers[q._id];
                if (userAnswer === undefined || userAnswer === '' || userAnswer === null) return;
                if (q.questionType === 'MSQ') {
                    // MSQ: exact match of selected set (normalize both sides to arrays)
                    const selected = Array.isArray(userAnswer) ? userAnswer : [userAnswer];
                    const expected = Array.isArray(q.correctAnswer) ? q.correctAnswer : [q.correctAnswer];
                    const a = JSON.stringify([...selected].sort());
                    const b = JSON.stringify([...expected].sort());
                    if (a === b) score += q.marks;
                } else if (q.questionType === 'MCQ') {
                    if (String(userAnswer) === String(q.correctAnswer)) score += q.marks;
                } else if (q.questionType === 'NAT') {
                    // NAT: numeric comparison with tolerance
                    if (Math.abs(Number(userAnswer) - Number(q.correctAnswer)) < 1e-6) {
                        score += q.marks;
                    }
                }
            });
            state.score = score;
            // Calculate total marks
            state.testConfig.totalMarks = state.questions.reduce((sum, q) => sum + q.marks, 0);
        },
        resetTest(state) {
            state.questions = [];
            state.currentIndex = 0;
            state.answers = {};
            state.submittedAnswers = {};
            state.questionTimes = {};
            state.markedForReview = [];
            state.timeRemaining = 0;
            state.isSubmitted = false;
            state.score = null;
            state.error = null;
            state.noQuestionsFound = false;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchQuestions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchQuestions.fulfilled, (state, action) => {
                state.loading = false;
                state.questions = action.payload.data || action.payload; // Handle both old and new response format
                state.currentIndex = 0;
                state.noQuestionsFound = action.payload.noQuestionsFound || false;
                state.testConfig.totalMarks = (action.payload.data || action.payload).reduce((sum, q) => sum + q.marks, 0);
            })
            .addCase(fetchQuestions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const {
    setCurrentIndex,
    setAnswer,
    submitAnswer,
    incrementQuestionTime,
    toggleMarkForReview,
    setTimeRemaining,
    submitTest,
    resetTest,
} = testSlice.actions;

export default testSlice.reducer;