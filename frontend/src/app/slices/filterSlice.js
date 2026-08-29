import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const fetchBranches = createAsyncThunk(
    'filter/fetchBranches',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/branches');
            return data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch branches');
        }
    }
);

export const fetchSubjects = createAsyncThunk(
    'filter/fetchSubjects',
    async (branch, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/subjects', { params: { branch } });
            return { branch, subjects: data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch subjects');
        }
    }
);

export const fetchChapters = createAsyncThunk(
    'filter/fetchChapters',
    async ({ exam, branch, subject }, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/chapters', { params: { exam, branch, subject } });
            return { branch, subject, chapters: data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch chapters');
        }
    }
);

const initialState = {
    exam: 'GATE',
    branch: '',
    subject: '',
    mode: 'subject', // 'subject' (whole subject) | 'chapter' (chapterwise)
    chapter: '',
    branches: [],
    subjects: [],
    chapters: [],
    loading: {
        branches: false,
        subjects: false,
        chapters: false,
    },
    error: null,
};

const filterSlice = createSlice({
    name: 'filter',
    initialState,
    reducers: {
        setExam(state, action) {
            state.exam = action.payload;
            state.branch = '';
            state.subject = '';
            state.mode = 'subject';
            state.chapter = '';
            state.subjects = [];
            state.chapters = [];
        },
        setBranch(state, action) {
            state.branch = action.payload;
            state.subject = '';
            state.mode = 'subject';
            state.chapter = '';
            state.subjects = [];
            state.chapters = [];
        },
        setSubject(state, action) {
            state.subject = action.payload;
            state.mode = 'subject';
            state.chapter = '';
            state.chapters = [];
        },
        setMode(state, action) {
            state.mode = action.payload;
            state.chapter = '';
        },
        setChapter(state, action) {
            state.chapter = action.payload;
        },
        clearFilters(state) {
            state.branch = '';
            state.subject = '';
            state.mode = 'subject';
            state.chapter = '';
            state.subjects = [];
            state.chapters = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch branches
            .addCase(fetchBranches.pending, (state) => {
                state.loading.branches = true;
                state.error = null;
            })
            .addCase(fetchBranches.fulfilled, (state, action) => {
                state.loading.branches = false;
                state.branches = action.payload;
            })
            .addCase(fetchBranches.rejected, (state, action) => {
                state.loading.branches = false;
                state.error = action.payload;
            })
            // Fetch subjects
            .addCase(fetchSubjects.pending, (state) => {
                state.loading.subjects = true;
                state.error = null;
            })
            .addCase(fetchSubjects.fulfilled, (state, action) => {
                state.loading.subjects = false;
                // Only update subjects if the branch matches
                if (action.payload.branch === state.branch) {
                    state.subjects = action.payload.subjects;
                }
            })
            .addCase(fetchSubjects.rejected, (state, action) => {
                state.loading.subjects = false;
                state.error = action.payload;
            })
            // Fetch chapters
            .addCase(fetchChapters.pending, (state) => {
                state.loading.chapters = true;
                state.error = null;
            })
            .addCase(fetchChapters.fulfilled, (state, action) => {
                state.loading.chapters = false;
                if (action.payload.branch === state.branch && action.payload.subject === state.subject) {
                    state.chapters = action.payload.chapters;
                }
            })
            .addCase(fetchChapters.rejected, (state, action) => {
                state.loading.chapters = false;
                state.error = action.payload;
            });
    },
});

export const { setExam, setBranch, setSubject, setMode, setChapter, clearFilters } = filterSlice.actions;

export default filterSlice.reducer;