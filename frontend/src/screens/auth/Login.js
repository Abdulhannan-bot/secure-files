import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/slices/authSlice';
import { ToastContainer, toast } from 'react-toastify';
import {
    TextField,
    Button,
    Grid,
    CircularProgress,
    Typography,
    Paper,
} from '@mui/material';
import { Box } from '@mui/system';

const Login = () => {
    const [userData, setUserData] = useState({
        email: '',
        password: '',
    });

    const { loading, error, loginData } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        if (loginData && loginData.email) {
            navigate('/2fa/verify', {
                state: {
                    email: loginData.email,
                },
            }); // Redirect to dashboard or home page after login
        }
    }, [loginData, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await dispatch(login(userData)).unwrap();
    };

    const isFormValid = userData.email && userData.password;

    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f4f6f8',
            }}>
            <ToastContainer />
            {loading && (
                <Box
                    sx={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100vw',
                        height: '100vh',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)',
                        zIndex: 9999,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <CircularProgress size={80} color="inherit" />
                </Box>
            )}
            <Paper sx={{ padding: 4, width: 400 }}>
                <Grid
                    container
                    spacing={2}
                    sx={{ maxWidth: 400, width: '100%' }}>
                    <Grid item xs={12}>
                        <Typography variant="h4" align="center" sx={{ mb: 2 }}>
                            Login
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Email"
                            name="email"
                            type="email"
                            value={userData.email}
                            onChange={handleChange}
                            fullWidth
                            required
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Password"
                            name="password"
                            type="password"
                            value={userData.password}
                            onChange={handleChange}
                            fullWidth
                            required
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <Button
                            variant="contained"
                            color="primary"
                            fullWidth
                            onClick={handleSubmit}
                            disabled={!isFormValid || loading}
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                            Login
                        </Button>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography
                            variant="body2"
                            align="center"
                            sx={{ marginTop: 2 }}>
                            Don't have an account?{' '}
                            <Link
                                to="/register"
                                style={{ textDecoration: 'none' }}
                                sx={{
                                    color: 'primary.main',
                                    fontWeight: 'bold',
                                }}>
                                Register
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default Login;
