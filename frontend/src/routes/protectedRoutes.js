import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyUser } from '../redux/slices/authSlice';
import { CircularProgress } from '@mui/material';
import { Navigate } from 'react-router-dom';

export const IsAuthenticated = ({ children }) => {
    const dispatch = useDispatch();
    const { loading, isAuthenticated, error } = useSelector(
        (state) => state.auth
    );

    console.log(children);

    useEffect(() => {
        if (isAuthenticated === null) {
            dispatch(verifyUser());
        }
    }, [dispatch, isAuthenticated]);

    if (loading) {
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
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export const IsAdmin = ({ children }) => {
    const dispatch = useDispatch();
    const { loading, isAuthenticated, isAdmin, error } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        dispatch(verifyUser());
    }, [dispatch, isAdmin, isAuthenticated]);

    if (loading) {
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
    }

    if (!isAuthenticated || !isAdmin) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

export const IsGuest = ({ children }) => {
    const dispatch = useDispatch();
    const { loading, isAuthenticated } = useSelector((state) => state.auth);

    useEffect(() => {
        dispatch(verifyUser());
    }, [dispatch]);

    if (loading) {
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
    }

    if (isAuthenticated) {
        return <Navigate to="/files" replace />;
    }

    return children;
};
