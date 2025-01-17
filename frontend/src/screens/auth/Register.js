import React, { useState, useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { register } from '../../redux/slices/authSlice';
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

const Register = () => {
    const [userData, setUserData] = useState({
        first_name: '',
        last_name: '',
        email: '',
    });
    // const [loading, setLoading] = useState(false);
    const { loading, error, registerData } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setUserData({
            ...userData,
            [e.target.name]: e.target.value,
        });
    };

    useEffect(() => {
        if (registerData && registerData.email) {
            navigate('/register/confirm', {
                state: {
                    email: registerData.email,
                },
            });
        }
    }, [registerData, navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await dispatch(register(userData)).unwrap();
        console.log(response);
        const returnedData = response.data;
        console.log(registerData);

        // if (response.meta.requestStatus === 'rejected') {
        //     toast.error('Registration failed');
        // }
    };

    const isFormValid =
        userData.first_name && userData.last_name && userData.email;

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
                            Register
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="First Name"
                            name="first_name"
                            value={userData.first_name}
                            onChange={handleChange}
                            fullWidth
                            required
                            variant="outlined"
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Last Name"
                            name="last_name"
                            value={userData.last_name}
                            onChange={handleChange}
                            fullWidth
                            required
                            variant="outlined"
                        />
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
                            Register
                        </Button>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography
                            variant="body2"
                            align="center"
                            sx={{ marginTop: 2 }}>
                            Already Registered?{' '}
                            <Link
                                to="/login"
                                style={{ textDecoration: 'none' }}
                                sx={{
                                    color: 'primary.main',
                                    fontWeight: 'bold',
                                }}>
                                Login
                            </Link>
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default Register;
