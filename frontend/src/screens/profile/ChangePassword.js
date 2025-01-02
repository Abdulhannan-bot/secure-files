import React, { useState } from 'react';
import { Box, TextField, Button, Typography } from '@mui/material';
import { useDispatch } from 'react-redux';
import { resetPassword } from '../../redux/slices/authSlice'; // Adjust path for your change password action
import { toast, ToastContainer } from 'react-toastify';
import HeaderComponent from '../../components/header/HeaderComponent';

const ChangePassword = () => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const dispatch = useDispatch();

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate new and confirm password
        if (newPassword !== confirmPassword) {
            toast.error('New Password and Confirm Password do not match.');
            return;
        }

        // Dispatch change password action
        dispatch(resetPassword({ currentPassword, newPassword }))
            .unwrap()
            .then(() => {
                setCurrentPassword('');
                setNewPassword('');
                setConfirmPassword('');
            })
            .catch((err) => {
                toast.error(err.message || 'Failed to change password.');
            });
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#f4f6f8',
            }}>
            <HeaderComponent />
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginTop: '20px',
                    // minHeight: '100vh',
                    // padding: '16px',
                    backgroundColor: '#f4f6f8',
                }}>
                <ToastContainer />
                <Typography variant="h5" mb={2}>
                    Change Password
                </Typography>

                <form
                    onSubmit={handleSubmit}
                    style={{ maxWidth: '400px', width: '100%' }}>
                    <TextField
                        label="Current Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                    />
                    <TextField
                        label="New Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                    <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        fullWidth
                        sx={{ marginTop: 2 }}>
                        Change Password
                    </Button>
                </form>
            </Box>
        </Box>
    );
};

export default ChangePassword;
