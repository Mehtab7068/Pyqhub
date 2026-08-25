import { configureStore } from '@reduxjs/toolkit';
import filterReducer from './slices/filterSlice';
import testReducer from './slices/testSlice';
import authReducer from './slices/authSlice';

export const store = configureStore({
    reducer: {
        filter: filterReducer,
        test: testReducer,
        auth: authReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                // Ignore these action types for serializable check
                ignoredActions: ['test/submitTest'],
            },
        }),
});

export default store;