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

export const fetchYears = createAsyncThunk(
    'filter/fetchYears',
    async ({ branch, subject }, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/years', { params: { branch, subject } });
            return { branch, subject, years: data.data };
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch years');
        }
    }
);

const initialState = {
    exam: 'GATE',
    branch: '',
    subject: '',
    year: '',
    branches: [],
    subjects: [],
    years: [],
    loading: {
        branches: false,
        subjects: false,
        years: false,
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
            state.year = '';
            state.subjects = [];
            state.years = [];
        },
        setBranch(state, action) {
            state.branch = action.payload;
            state.subject = '';
            state.year = '';
            state.subjects = [];
            state.years = [];
        },
        setSubject(state, action) {
            state.subject = action.payload;
            state.year = '';
            state.years = [];
        },
        setYear(state, action) {
            state.year = action.payload;
        },
        clearFilters(state) {
            state.branch = '';
            state.subject = '';
            state.year = '';
            state.subjects = [];
            state.years = [];
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
            // Fetch years
            .addCase(fetchYears.pending, (state) => {
                state.loading.years = true;
                state.error = null;
            })
            .addCase(fetchYears.fulfilled, (state, action) => {
                state.loading.years = false;
                if (action.payload.branch === state.branch && action.payload.subject === state.subject) {
                    state.years = action.payload.years;
                }
            })
            .addCase(fetchYears.rejected, (state, action) => {
                state.loading.years = false;
                state.error = action.payload;
            });
    },
});

export const { setExam, setBranch, setSubject, setYear, clearFilters } = filterSlice.actions;

export default filterSlice.reducer;