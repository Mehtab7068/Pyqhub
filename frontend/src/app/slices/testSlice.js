import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';
import { getExamConfig } from '../../data/examConfig';

export const fetchQuestions = createAsyncThunk(
    'test/fetchQuestions',
    async ({ exam, branch, subject, chapter }, { rejectWithValue }) => {
        try {
            // Default to the primary exam (GATE) when none is selected.
            const effectiveExam = exam && exam.trim() !== '' ? exam : 'GATE';
            const params = { exam: effectiveExam, branch, subject, year: 'all', limit: 500 };
            if (chapter) params.chapter = chapter;
            const { data } = await api.get('/questions', { params });
            // The backend may return either { data: [...] } or the array directly.
            return data.data || data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch questions');
        }
    }
);

export const fetchQuestionsByIds = createAsyncThunk(
    'test/fetchQuestionsByIds',
    async (ids, { rejectWithValue }) => {
        try {
            const questionIds = Array.isArray(ids) ? ids : ids.ids;
            const { data } = await api.get('/questions/by-ids', { params: { ids: questionIds.join(',') } });
            return data.data || [];
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to load mistake replay');
        }
    }
);

export const fetchMockTestQuestions = createAsyncThunk(
    'test/fetchMockTestQuestions',
    async ({ exam, branch, subject, mockTestType, chapter }, { rejectWithValue }) => {
        try {
            const params = { exam: exam || 'GATE', branch, subject, mockTestType, year: 'all', limit: 500 };
            if (chapter) params.chapter = chapter;
            const { data } = await api.get('/mock-test/questions', { params });
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch mock test questions');
        }
    }
);

export const saveAttempt = createAsyncThunk(
    'test/saveAttempt',
    async (attempt, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/attempts', attempt);
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to save test attempt');
        }
    }
);

const isCorrectAnswer = (question, answer) => {
    if (answer === undefined || answer === '' || answer === null) return false;
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
    return String(answer) === String(question.correctAnswer);
};

const getMarksAwarded = (question, answer, exam = 'GATE') => {
    if (isCorrectAnswer(question, answer)) return question.marks;
    if (question.questionType === 'MCQ' && answer !== undefined && answer !== '' && answer !== null) {
        return getExamConfig(exam).scoring.mcqNegative(question.marks);
    }
    return 0;
};

const initialState = {
    questions: [],
    currentIndex: 0,
    answers: {},           // { questionId: selectedOptionId(s) }
    confidence: {},        // { questionId: 'low' | 'medium' | 'high' }
    submittedAnswers: {},  // { questionId: true } — per-question submit (practice mode)
    questionTimes: {},     // { questionId: secondsSpent }
    markedForReview: [], // array of question ids
    timeRemaining: 0,  // seconds
    isSubmitted: false,
    score: null,
    loading: false,
    error: null,
    attemptSaved: false,
    attemptSaving: false,
    noQuestionsFound: false,
    testConfig: {
        exam: 'GATE',
        durationMinutes: 180, // default 3 hours
        totalMarks: 0,
    },
    // Mock test specific state
    mockTestConfig: {
        type: '', // 'full' | 'subject' | 'chapter' | 'previous'
        durationMinutes: 180,
        error: null,
        noQuestionsFound: false,
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
        setConfidence(state, action) {
            const { questionId, confidence } = action.payload;
            state.confidence[questionId] = confidence;
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
        setTestExam(state, action) {
            state.testConfig.exam = action.payload || 'GATE';
        },
        submitTest(state) {
            state.isSubmitted = true;
            // Calculate score
            let score = 0;
            state.questions.forEach((q) => {
                const userAnswer = state.answers[q._id];
                if (userAnswer === undefined || userAnswer === '' || userAnswer === null) return;
                score += getMarksAwarded(q, userAnswer, state.testConfig.exam);
            });
            state.score = score;
            // Calculate total marks
            state.testConfig.totalMarks = state.questions.reduce((sum, q) => sum + q.marks, 0);
        },
        resetTest(state) {
            state.questions = [];
            state.currentIndex = 0;
            state.answers = {};
            state.confidence = {};
            state.submittedAnswers = {};
            state.questionTimes = {};
            state.markedForReview = [];
            state.timeRemaining = 0;
            state.isSubmitted = false;
            state.score = null;
            state.error = null;
            state.attemptSaved = false;
            state.attemptSaving = false;
            state.noQuestionsFound = false;
            state.mockTestConfig = {
                type: '',
                durationMinutes: 180,
                error: null,
                noQuestionsFound: false,
            };
        },
        setMockTestConfig(state, action) {
            state.mockTestConfig = { ...state.mockTestConfig, ...action.payload };
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
            })
            .addCase(fetchQuestionsByIds.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.questions = [];
            })
            .addCase(fetchQuestionsByIds.fulfilled, (state, action) => {
                state.loading = false;
                state.questions = action.payload;
                state.currentIndex = 0;
                state.noQuestionsFound = action.payload.length === 0;
                state.testConfig.totalMarks = action.payload.reduce((sum, question) => sum + question.marks, 0);
            })
            .addCase(fetchQuestionsByIds.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Mock test questions
            .addCase(fetchMockTestQuestions.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.mockTestConfig.error = null;
                state.mockTestConfig.noQuestionsFound = false;
            })
            .addCase(fetchMockTestQuestions.fulfilled, (state, action) => {
                state.loading = false;
                state.questions = action.payload.data || action.payload;
                state.currentIndex = 0;
                state.mockTestConfig.noQuestionsFound = action.payload.noQuestionsFound || false;
                state.testConfig.totalMarks = (action.payload.data || action.payload).reduce((sum, q) => sum + q.marks, 0);
            })
            .addCase(fetchMockTestQuestions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.mockTestConfig.error = action.payload;
            })
            .addCase(saveAttempt.pending, (state) => {
                state.attemptSaving = true;
            })
            .addCase(saveAttempt.fulfilled, (state) => {
                state.attemptSaving = false;
                state.attemptSaved = true;
            })
            .addCase(saveAttempt.rejected, (state, action) => {
                state.attemptSaving = false;
                state.error = action.payload;
            });
    },
});

export const {
    setCurrentIndex,
    setAnswer,
    setConfidence,
    submitAnswer,
    incrementQuestionTime,
    toggleMarkForReview,
    setTimeRemaining,
    setTestExam,
    submitTest,
    resetTest,
    setMockTestConfig,
} = testSlice.actions;

export { getMarksAwarded, isCorrectAnswer };
export default testSlice.reducer;