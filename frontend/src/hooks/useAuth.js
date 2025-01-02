import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { verifyUser } from '../redux/slices/authSlice';

export const useAuth = () => {
    const dispatch = useDispatch();
    const { loading, isAuthenticated, isAdmin, error } = useSelector(
        (state) => state.auth
    );

    useEffect(() => {
        const verify = async () => {
            await dispatch(verifyUser());
        };
        verify();
    }, [dispatch]);

    return { loading, isAuthenticated, isAdmin, error };
};
