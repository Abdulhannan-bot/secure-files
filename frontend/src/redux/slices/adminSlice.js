import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/apiService';

// Base URL for your API

// Fetch all users
export const fetchUsers = createAsyncThunk('admin/fetchUsers', async () => {
    const response = await api.get('users/');
    return response.data;
});

// Add a new user
export const addUser = createAsyncThunk('admin/addUser', async (userData) => {
    const response = await api.post('users/', userData);
    return response.data;
});

// Update an existing user
export const updateUser = createAsyncThunk(
    'admin/updateUser',
    async ({ userId, userData }) => {
        console.log(userId, userData);

        const response = await api.put(`users/${userId}/`, userData);
        return response.data;
    }
);

// Delete a user
export const deleteUser = createAsyncThunk(
    'admin/deleteUser',
    async (userId) => {
        const response = await api.delete(`users/delete/${userId}/`);
        return { userId, message: response.data.message };
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        users: [],
        loading: false,
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch Users
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.loading = false;
                state.users = action.payload;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Add User
            .addCase(addUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users.push(action.payload);
            })
            .addCase(addUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Update User
            .addCase(updateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.loading = false;
                const updatedUser = action.payload;
                const index = state.users.findIndex(
                    (user) => user.id === updatedUser.id
                );
                if (index !== -1) {
                    state.users[index] = updatedUser;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            })

            // Delete User
            .addCase(deleteUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.loading = false;
                state.users = state.users.filter(
                    (user) => user.id !== action.payload.userId
                );
            })
            .addCase(deleteUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.error.message;
            });
    },
});

export default adminSlice.reducer;
