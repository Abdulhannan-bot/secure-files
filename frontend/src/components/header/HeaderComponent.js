import React, { useEffect } from 'react';
import {
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Menu,
    MenuItem,
} from '@mui/material';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/slices/authSlice';

const HeaderComponent = () => {
    const [anchorEl, setAnchorEl] = React.useState(null);
    const { loading, error, isAuthneticated } = useSelector(
        (state) => state.auth
    );
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {});

    const handleLogout = () => {
        dispatch(logout())
            .unwrap()
            .then(() => {
                navigate('/login');
            })
            .catch((err) => {
                console.error('Logout failed:', err);
            });
        handleMenuClose();
    };

    return (
        <AppBar position="sticky">
            {' '}
            {/* sticky header */}
            <Toolbar>
                <Typography variant="h6" style={{ flexGrow: 1 }}>
                    SecureFiles
                </Typography>
                <IconButton color="inherit" onClick={handleMenuClick}>
                    <AccountCircleIcon />
                </IconButton>
                <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleMenuClose}
                    anchorOrigin={{
                        vertical: 'bottom', // Open below the icon
                        horizontal: 'right', // Align right with the icon
                    }}
                    transformOrigin={{
                        vertical: 'top', // Align the top of the menu with the anchor's bottom
                        horizontal: 'right', // Align right with the anchor
                    }}>
                    <MenuItem onClick={() => navigate('/files')}>
                        My Files
                    </MenuItem>
                    <MenuItem onClick={() => navigate('/change-password')}>
                        Change Password
                    </MenuItem>
                    <MenuItem onClick={handleLogout}>Logout</MenuItem>
                </Menu>
            </Toolbar>
        </AppBar>
    );
};

export default HeaderComponent;
