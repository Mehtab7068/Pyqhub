import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Async thunks
export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/auth/register', userData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Registration failed');
        }
    }
);

export const loginUser = createAsyncThunk(
    'auth/login',
    async (credentials, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/auth/login', credentials);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Login failed');
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            await api.post('/auth/logout');
        } catch (error) {
            // Continue with logout even if API call fails
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const getCurrentUser = createAsyncThunk(
    'auth/getCurrentUser',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await api.get('/auth/me');
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch user');
        }
    }
);

export const adminRegisterUser = createAsyncThunk(
    'auth/adminRegister',
    async (userData, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/auth/admin-register', userData);
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Admin registration failed');
        }
    }
);

export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async (email, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/auth/forgot-password', { email });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to send reset email');
        }
    }
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ token, password, confirmPassword }, { rejectWithValue }) => {
        try {
            const { data } = await api.post('/auth/reset-password', { token, password, confirmPassword });
            return data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message || 'Failed to reset password');
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        token: localStorage.getItem('token') || null,
        loading: false,
        error: null,
        isAuthenticated: false,
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setCredentials: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            localStorage.setItem('token', action.payload.token);
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
            localStorage.removeItem('token');
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(registerUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.data.user;
                state.token = action.payload.data.token;
                state.isAuthenticated = true;
                localStorage.setItem('token', action.payload.data.token);
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Admin Register
            .addCase(adminRegisterUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(adminRegisterUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.data.user;
                state.token = action.payload.data.token;
                state.isAuthenticated = true;
                localStorage.setItem('token', action.payload.data.token);
            })
            .addCase(adminRegisterUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Login
            .addCase(loginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.data.user;
                state.token = action.payload.data.token;
                state.isAuthenticated = true;
                localStorage.setItem('token', action.payload.data.token);
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Logout
            .addCase(logoutUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.loading = false;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.error = null;
                localStorage.removeItem('token');
            })
            .addCase(logoutUser.rejected, (state) => {
                // Still logout locally even if API call fails
                state.loading = false;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.error = null;
                localStorage.removeItem('token');
            })
            // Get current user
            .addCase(getCurrentUser.pending, (state) => {
                state.loading = true;
            })
            .addCase(getCurrentUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.data.user;
                state.isAuthenticated = true;
            })
            .addCase(getCurrentUser.rejected, (state) => {
                state.loading = false;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                localStorage.removeItem('token');
            });
    },
});

export const { clearError, setCredentials, logout } = authSlice.actions;
export default authSlice.reducer;