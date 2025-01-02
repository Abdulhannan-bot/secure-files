import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from '../screens/auth/Register';
import RegisterConfirmation from '../screens/auth/RegisterConfirmation';
import Login from '../screens/auth/Login';
import TwoFactorVerify from '../screens/auth/TwoFactorVerify';
import FilesComponent from '../screens/files/FilesComponent';
import FileViewComponent from '../screens/files/FIleViewCompenent';
import ChangePassword from '../screens/profile/ChangePassword';
import { IsAdmin, IsAuthenticated, IsGuest } from './protectedRoutes';

const URLRoutes = () => {
    return (
        <Router>
            <Routes>
                <Route
                    path="/register"
                    element={
                        <IsGuest>
                            <Register />
                        </IsGuest>
                    }
                />
                <Route
                    path="/register/confirm"
                    element={
                        <IsGuest>
                            <RegisterConfirmation />
                        </IsGuest>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <IsGuest>
                            <Login />
                        </IsGuest>
                    }
                />
                <Route
                    path="/2fa/verify"
                    element={
                        <IsGuest>
                            <TwoFactorVerify />
                        </IsGuest>
                    }
                />
                <Route
                    path="/files"
                    element={
                        <IsAuthenticated>
                            <FilesComponent />
                        </IsAuthenticated>
                    }
                />
                <Route
                    path="/change-password"
                    element={
                        <IsAuthenticated>
                            <ChangePassword />
                        </IsAuthenticated>
                    }
                />
                <Route
                    path="/files/view/:id"
                    element={
                        <IsAuthenticated>
                            <FileViewComponent />
                        </IsAuthenticated>
                    }
                />
            </Routes>
        </Router>
    );
};

export default URLRoutes;
