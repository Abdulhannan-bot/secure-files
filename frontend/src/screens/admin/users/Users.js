import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    Button,
    Modal,
    Box,
    TextField,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    IconButton,
    CircularProgress,
} from '@mui/material';
import { Delete, Edit } from '@mui/icons-material';
import {
    fetchUsers,
    addUser,
    deleteUser,
    updateUser,
} from '../../../redux/slices/adminSlice';
import { toast, ToastContainer } from 'react-toastify';
import HeaderComponent from '../../../components/header/HeaderComponent';

export default function Users() {
    const dispatch = useDispatch();
    const { users, loading } = useSelector((state) => state.admin);

    const [isAddUserModalOpen, setIsAddUserModalOpen] = useState(false);
    const [isEditUserModalOpen, setIsEditUserModalOpen] = useState(false);
    const [isDeleteUserModalOpen, setIsDeleteUserModalOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [userData, setUserData] = useState({
        email: '',
        first_name: '',
        last_name: '',
    });

    useEffect(() => {
        dispatch(fetchUsers());
    }, [dispatch]);

    const handleAddUser = () => {
        dispatch(addUser(userData))
            .then(() => {
                toast.success('User added successfully');
                setIsAddUserModalOpen(false);
            })
            .catch((error) => {
                toast.error('Error adding user');
            });
    };

    const handleEditUser = () => {
        dispatch(
            updateUser({ userId: selectedUser.id, userData: { ...userData } })
        )
            .then(() => {
                toast.success('User updated successfully');
                setIsEditUserModalOpen(false);
            })
            .catch((error) => {
                toast.error('Error updating user');
            });
    };

    const handleDeleteUser = () => {
        dispatch(deleteUser(selectedUser.id))
            .then(() => {
                toast.success('User deleted successfully');
                setIsDeleteUserModalOpen(false);
            })
            .catch((error) => {
                toast.error('Error deleting user');
            });
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                backgroundColor: '#f4f6f8',
            }}>
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
            <HeaderComponent />

            <ToastContainer />

            <Box sx={{ padding: '20px' }}>
                <Button
                    variant="contained"
                    sx={{ mb: 2, float: 'right', fontSize: '0.9rem' }}
                    onClick={() => setIsAddUserModalOpen(true)}>
                    Add User
                </Button>

                <TableContainer
                    sx={{
                        marginTop: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                    }}>
                    <Table sx={{ maxWidth: '600px' }}>
                        <TableHead>
                            <TableRow>
                                <TableCell>Email</TableCell>
                                <TableCell>First Name</TableCell>
                                <TableCell>Last Name</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {users &&
                                users.map((user) => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>{user.first_name}</TableCell>
                                        <TableCell>{user.last_name}</TableCell>
                                        <TableCell>
                                            <IconButton
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setUserData({
                                                        email: user.email,
                                                        first_name:
                                                            user.first_name,
                                                        last_name:
                                                            user.last_name,
                                                    });
                                                    setIsEditUserModalOpen(
                                                        true
                                                    );
                                                }}>
                                                <Edit />
                                            </IconButton>
                                            <IconButton
                                                onClick={() => {
                                                    setSelectedUser(user);
                                                    setIsDeleteUserModalOpen(
                                                        true
                                                    );
                                                }}>
                                                <Delete />
                                            </IconButton>
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Box>

            {/* Add User Modal */}
            <Modal
                open={isAddUserModalOpen}
                onClose={() => setIsAddUserModalOpen(false)}>
                <Box sx={{ ...modalStyle }}>
                    <h2>Add User</h2>
                    <TextField
                        label="Email"
                        value={userData.email}
                        onChange={(e) =>
                            setUserData({ ...userData, email: e.target.value })
                        }
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="First Name"
                        value={userData.first_name}
                        onChange={(e) =>
                            setUserData({
                                ...userData,
                                first_name: e.target.value,
                            })
                        }
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Last Name"
                        value={userData.last_name}
                        onChange={(e) =>
                            setUserData({
                                ...userData,
                                last_name: e.target.value,
                            })
                        }
                        fullWidth
                        margin="normal"
                    />
                    <Button
                        variant="contained"
                        onClick={handleAddUser}
                        sx={{ mt: 2 }}>
                        Add User
                    </Button>
                </Box>
            </Modal>

            {/* Edit User Modal */}
            <Modal
                open={isEditUserModalOpen}
                onClose={() => setIsEditUserModalOpen(false)}>
                <Box sx={{ ...modalStyle }}>
                    <h2>Edit User</h2>
                    <TextField
                        label="Email"
                        value={userData.email}
                        disabled
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="First Name"
                        value={userData.first_name}
                        onChange={(e) =>
                            setUserData({
                                ...userData,
                                first_name: e.target.value,
                            })
                        }
                        fullWidth
                        margin="normal"
                    />
                    <TextField
                        label="Last Name"
                        value={userData.last_name}
                        onChange={(e) =>
                            setUserData({
                                ...userData,
                                last_name: e.target.value,
                            })
                        }
                        fullWidth
                        margin="normal"
                    />
                    <Button
                        variant="contained"
                        onClick={handleEditUser}
                        sx={{ mt: 2 }}>
                        Save Changes
                    </Button>
                </Box>
            </Modal>

            {/* Delete User Confirmation Modal */}
            <Modal
                open={isDeleteUserModalOpen}
                onClose={() => setIsDeleteUserModalOpen(false)}>
                <Box sx={{ ...modalStyle }}>
                    <h2>Are you sure you want to delete this user?</h2>
                    <Button
                        variant="contained"
                        onClick={handleDeleteUser}
                        sx={{ mt: 2 }}>
                        Yes, Delete
                    </Button>
                    <Button
                        variant="outlined"
                        onClick={() => setIsDeleteUserModalOpen(false)}
                        sx={{ mt: 2 }}>
                        Cancel
                    </Button>
                </Box>
            </Modal>
        </Box>
    );
}

const modalStyle = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
    p: 4,
};
