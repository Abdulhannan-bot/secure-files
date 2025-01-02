import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { verifyOtp, sendOtp } from '../../redux/slices/authSlice'; // Assuming verifyOtp action is created in authSlice
import { ToastContainer, toast } from 'react-toastify';
import { verifyUser } from '../../redux/slices/authSlice';
import {
    TextField,
    Button,
    Grid,
    CircularProgress,
    Typography,
    Paper,
} from '@mui/material';
import { Box } from '@mui/system';

const TwoFactorVerify = () => {
    const [otp, setOtp] = useState('');
    const { loading, error, verifyData } = useSelector((state) => state.auth);

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    if (!email) {
        console.log('first');

        navigate('/login');
    }

    useEffect(() => {
        // Redirect to dashboard or home page if OTP is successfully verified
        if (verifyData && verifyData.success && !loading) {
            dispatch(verifyUser())
                .unwrap()
                .then(() => {
                    navigate(location.state?.from || '/files', {
                        replace: true,
                    });
                })
                .catch((error) => {
                    console.error('Verification failed:', error);
                });
        }
    }, [verifyData, navigate, location.state, loading]);

    const handleChange = (e) => {
        setOtp(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await dispatch(verifyOtp({ email, otp })).unwrap();
        console.log(response);
    };

    const handleResendOtp = async (e) => {
        dispatch(sendOtp(email));
    };

    const isFormValid = otp.length === 6; // Assuming OTP length is 6 digits

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
                            Two-Factor Authentication
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <Typography
                            variant="body1"
                            align="center"
                            sx={{ mb: 2 }}>
                            An OTP has been sent to your email. Please enter it
                            below to verify.
                        </Typography>
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Enter OTP"
                            name="otp"
                            type="text"
                            value={otp}
                            onChange={handleChange}
                            fullWidth
                            required
                            variant="outlined"
                            inputProps={{ maxLength: 6 }}
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
                            Verify OTP
                        </Button>
                    </Grid>

                    <Grid item xs={12}>
                        <Typography
                            variant="body2"
                            align="center"
                            sx={{ marginTop: 2 }}>
                            Didn't receive the OTP?{' '}
                            <Button
                                onClick={() => {
                                    handleResendOtp();
                                }}
                                variant="text"
                                sx={{
                                    color: 'primary.main',
                                    fontWeight: 'bold',
                                }}>
                                Resend OTP
                            </Button>
                        </Typography>
                    </Grid>
                </Grid>
            </Paper>
        </Box>
    );
};

export default TwoFactorVerify;
