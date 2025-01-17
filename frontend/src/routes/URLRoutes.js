import {
    BrowserRouter as Router,
    Route,
    Routes,
    Navigate,
} from 'react-router-dom';
import Register from '../screens/auth/Register';
import RegisterConfirmation from '../screens/auth/RegisterConfirmation';
import Login from '../screens/auth/Login';
import TwoFactorVerify from '../screens/auth/TwoFactorVerify';
import FilesComponent from '../screens/files/FilesComponent';
import FileViewComponent from '../screens/files/FIleViewCompenent';
import ChangePassword from '../screens/profile/ChangePassword';
import AdminFilesComponent from '../screens/admin/files/AdminFilesView';
import Users from '../screens/admin/users/Users';
import { IsAdmin, IsAuthenticated, IsGuest } from './protectedRoutes';
import { ProtectedRoute } from './protectedRoutes';
// import { verifyUser } from '../redux/slices/authSlice';

const URLRoutes = () => {
    return (
        <Router>
            <Routes>
                {/* Guest Routes */}
                <Route
                    path="/register"
                    element={
                        <ProtectedRoute requireGuest>
                            <Register />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/register/confirm"
                    element={
                        <ProtectedRoute requireGuest>
                            <RegisterConfirmation />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/login"
                    element={
                        <ProtectedRoute requireGuest>
                            <Login />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/2fa/verify"
                    element={
                        <ProtectedRoute requireGuest>
                            <TwoFactorVerify />
                        </ProtectedRoute>
                    }
                />

                {/* Authenticated User Routes */}
                <Route
                    path="/files"
                    element={
                        <ProtectedRoute requireAuth>
                            <FilesComponent />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/change-password"
                    element={
                        <ProtectedRoute requireAuth>
                            <ChangePassword />
                        </ProtectedRoute>
                    }
                />

                {/* Admin Routes */}
                <Route
                    path="/files/all"
                    element={
                        <ProtectedRoute requireAdmin>
                            <AdminFilesComponent />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/users"
                    element={
                        <ProtectedRoute requireAdmin>
                            <Users />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/files/view/:id"
                    element={
                        <ProtectedRoute requireAuth>
                            <FileViewComponent />
                        </ProtectedRoute>
                    }
                />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
};

export default URLRoutes;
