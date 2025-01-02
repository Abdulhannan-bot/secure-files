// /redux/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import api from '../../api/apiService';

// Async thunks
export const register = createAsyncThunk('auth/register', async (formData) => {
    console.log(formData);

    try {
        const response = await api.post('register/', formData);
        const incomingData = response.data;

        if (incomingData.success) {
            toast.success(incomingData.msg);
            return incomingData.data;
        } else {
            toast.error('An unknown error occurred');
            return { error: 'An unknown error occurred' }; // Return error response
        }
    } catch (error) {
        console.log(error);

        toast.error(error.response?.data?.msg || 'Registration failed');
        return { error: error.response?.data?.msg || 'Registration failed' }; // Return error response
    }
});

export const login = createAsyncThunk('auth/login', async (formData) => {
    try {
        const response = await api.post('login/', formData);
        const incomingData = response.data;

        if (incomingData.success) {
            toast.success(incomingData.msg);
            return incomingData.data; // Return successful response
        } else {
            toast.error('Login failed');
            return { error: 'Login failed' }; // Return error response
        }
    } catch (error) {
        toast.error(error.response?.data?.msg || 'Login failed');
        return { error: error.response?.data?.msg || 'Login failed' }; // Return error response
    }
});

export const sendOtp = createAsyncThunk('auth/sendOtp', async (email) => {
    try {
        const response = await api.post('send-otp/', { email });
        const incomingData = response.data;

        if (incomingData.success) {
            toast.success(incomingData.msg);
            return incomingData; // Return successful response
        } else {
            toast.error('Failed to send OTP');
            return { error: 'Failed to send OTP' }; // Return error response
        }
    } catch (error) {
        toast.error(error.response?.data?.msg || 'Failed to send OTP');
        return { error: error.response?.data?.msg || 'Failed to send OTP' }; // Return error response
    }
});

export const verifyOtp = createAsyncThunk(
    'auth/verifyOtp',
    async ({ email, otp }) => {
        try {
            const response = await api.post('verify-otp/', { email, otp });
            const incomingData = response.data;

            if (incomingData.success) {
                toast.success(incomingData.msg);
                return incomingData;
            } else {
                toast.error('OTP verification failed');
                return { error: 'OTP verification failed' };
            }
        } catch (error) {
            console.log(error.response.data.error);

            toast.error(
                error?.response?.data?.error || 'OTP verification failed'
            );
            return {
                error:
                    error?.response?.data?.error || 'OTP verification failed',
            }; // Return error response
        }
    }
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ currentPassword, newPassword }) => {
        try {
            const response = await api.patch('reset-password/', {
                currentPassword,
                newPassword,
            });
            const incomingData = response.data;

            if (incomingData.success) {
                toast.success(incomingData.msg);
                return incomingData; // Return successful response
            } else {
                toast.error('Password reset failed');
                return { error: 'Password reset failed' }; // Return error response
            }
        } catch (error) {
            toast.error(error.response?.data?.msg || 'Password reset failed');
            return {
                error: error.response?.data?.msg || 'Password reset failed',
            }; // Return error response
        }
    }
);

export const verifyUser = createAsyncThunk(
    'auth/verifyUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('verify-user/');
            const incomingData = response.data;

            if (incomingData.success) {
                return incomingData;
            } else {
                return rejectWithValue('User verification failed.');
            }
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                    error.message ||
                    'An unknown error occurred.'
            );
        }
    }
);
export const logout = createAsyncThunk('auth/logout', async () => {
    try {
        const response = await api.post('logout/');
        const incomingData = response.data;

        if (incomingData.success) {
            toast.info(incomingData.msg || `You've been logged out`);
            return true; // Return success response
        } else {
            toast.error(incomingData.msg || 'Logout failed');
            return { error: incomingData.msg || 'Logout failed' }; // Return error response
        }
    } catch (error) {
        toast.error(error.response?.data?.msg || 'Logout failed');
        return { error: error.response?.data?.msg || 'Logout failed' }; // Return error response
    }
});

const initialState = {
    loading: false,
    error: null,
    user: null,
    registerData: null,
    loginData: null,
    email: null,
    isAuthenticated: false,
    isAdmin: null,
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(register.pending, (state) => {
                state.loading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.registerData = action.payload;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error; // Handling error messages
            })
            // Login
            .addCase(login.pending, (state) => {
                state.loading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.loginData = action.payload;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error; // Handling error messages
            })
            // Send OTP
            .addCase(sendOtp.pending, (state) => {
                state.loading = true;
            })
            .addCase(sendOtp.fulfilled, (state, action) => {
                state.loading = false;
            })
            .addCase(sendOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error; // Handling error messages
            })
            // Verify OTP
            .addCase(verifyOtp.pending, (state) => {
                state.loading = true;
            })
            .addCase(verifyOtp.fulfilled, (state, action) => {
                state.loading = false;
                state.verifyData = action.payload;
                // toast.success('OTP verified');
            })
            .addCase(verifyOtp.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error; // Handling error messages
            })
            // Reset Password
            .addCase(resetPassword.pending, (state) => {
                state.loading = true;
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.loading = false;
                // toast.success('Password reset successfully');
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error; // Handling error messages
            })
            // Logout
            .addCase(logout.pending, (state) => {
                state.loading = true;
            })
            .addCase(logout.fulfilled, (state) => {
                state.loading = false;
                state.isAuthenticated = false;
                state.user = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.error; // Handling error messages
            })
            .addCase(verifyUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(verifyUser.fulfilled, (state, action) => {
                state.isAuthenticated = action.payload.success;
                state.isAdmin = action.payload.is_admin;
                state.loading = false;
            })
            .addCase(verifyUser.rejected, (state, action) => {
                state.isAuthenticated = false;
                state.isAdmin = false;
                state.error = action.payload || 'Failed to authenticate';
                state.loading = false;
            });
    },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
