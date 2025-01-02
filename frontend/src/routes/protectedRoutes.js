import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyUser } from '../redux/slices/authSlice';
import { CircularProgress } from '@mui/material';
import { Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const LoadingSpinner = () => {
    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
            }}>
            <CircularProgress />
        </div>
    );
};

export const ProtectedRoute = ({
    children,
    requireAuth = false,
    requireAdmin = false,
    requireGuest = false,
}) => {
    const { loading, isAuthenticated, isAdmin } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    // if (loading) {
    //     return <LoadingSpinner />;
    // }

    // Handle guest routes
    if (requireGuest) {
        if (isAdmin) {
            console.log('ga');

            // return <Navigate to={isAdmin ? '/files/all' : '/files'} replace />;
            // return <Navigate to={'/change-password'} replace />;
            return navigate(location.state?.from || '/files/all', {
                replace: true,
            });
        }
        if (isAuthenticated) {
            console.log('gau');

            // return <Navigate to={isAdmin ? '/files/all' : '/files'} replace />;
            return navigate(location.state?.from || '/files', {
                replace: true,
            });
        }
        return children;
    }

    // Handle non-authenticated users for protected routes
    if (!isAuthenticated) {
        console.log(`!au`);

        if (requireAuth || requireAdmin) {
            console.log(`!au au a`);

            return (
                <Navigate
                    to="/login"
                    state={{ from: location.pathname }}
                    replace
                />
            );
        }
    }

    // Handle authenticated users
    if (isAuthenticated) {
        console.log(`au`);

        // Block non-admin users from admin routes
        if (requireAdmin && !isAdmin) {
            console.log(`au aaaa`);

            return <Navigate to="/files" replace />;
        }
        // Allow admins to access everything
        // Allow regular users to access non-admin routes
        return children;
    }

    return children;
};
