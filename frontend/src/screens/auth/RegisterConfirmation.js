import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Paper,
    CircularProgress,
} from '@mui/material';
import { Link, useNavigate, useLocation } from 'react-router-dom';

const RegisterConfirmation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    if (!email) {
        navigate('/register');
    }

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f4f6f8',
            }}>
            <Paper sx={{ padding: 4, width: 400 }}>
                <Typography variant="h5" align="center" sx={{ mb: 2 }}>
                    Registration Successful
                </Typography>
                <Typography variant="body1" align="center" sx={{ mb: 2 }}>
                    A temporary email has been sent to <strong>{email}</strong>.
                    Please check your inbox and follow the instructions to
                    complete your registration.
                </Typography>
                <Typography variant="body2" align="center" sx={{ mb: 2 }}>
                    If you did not receive the email, please check your spam
                    folder.
                </Typography>
                <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    component={Link}
                    to="/login"
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}>
                    Click here to login
                </Button>
            </Paper>
        </Box>
    );
};

export default RegisterConfirmation;
