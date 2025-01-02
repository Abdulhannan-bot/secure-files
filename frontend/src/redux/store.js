import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import filesReducer from './slices/filesSlice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        files: filesReducer,
    },
});

export default store;
