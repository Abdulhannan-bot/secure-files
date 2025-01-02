import logo from './logo.svg';
import './App.css';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Register from './screens/auth/Register';
import RegisterConfirmation from './screens/auth/RegisterConfirmation';
import Login from './screens/auth/Login';
import TwoFactorVerify from './screens/auth/TwoFactorVerify';
import FilesComponent from './screens/files/FilesComponent';
import FileViewComponent from './screens/files/FIleViewCompenent';
import ChangePassword from './screens/profile/ChangePassword';

import URLRoutes from './routes/URLRoutes';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
// import Dashboard from './screens/auth/dashboard';

const theme = createTheme({
    palette: {
        primary: {
            main: '#1976d2',
            light: '#42a5f5',
            dark: '#1565c0',
            contrastText: '#fff',
        },
        secondary: {
            main: '#9c27b0',
            light: '#ba68c8',
            dark: '#7b1fa2',
            contrastText: '#fff',
        },
        error: {
            main: '#d32f2f',
        },
        warning: {
            main: '#ed6c02',
        },
        info: {
            main: '#0288d1',
        },
        success: {
            main: '#2e7d32',
        },
        background: {
            default: '#f5f5f5',
            paper: '#fff',
        },
    },
    typography: {
        fontFamily: [
            'Roboto',
            '-apple-system',
            'BlinkMacSystemFont',
            '"Segoe UI"',
            'Arial',
            'sans-serif',
        ].join(','),
        h1: {
            fontSize: '2.5rem',
            fontWeight: 500,
        },
        h2: {
            fontSize: '2rem',
            fontWeight: 500,
        },
        button: {
            textTransform: 'none', // Prevents automatic uppercase transformation
            fontWeight: 500,
        },
    },
    shape: {
        borderRadius: 8, // Custom border radius for components
    },
    spacing: 8, // Base spacing unit
    components: {
        // Customize specific components
        MuiButton: {
            styleOverrides: {
                root: {
                    padding: '8px 24px',
                },
                contained: {
                    boxShadow: 'none',
                    '&:hover': {
                        boxShadow: 'none',
                    },
                },
            },
            defaultProps: {
                disableElevation: true, // Removes default button shadow
            },
        },
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
                size: 'medium',
            },
            styleOverrides: {
                root: {
                    '& .MuiOutlinedInput-root': {
                        '& fieldset': {
                            borderColor: '#e0e0e0',
                        },
                        '&:hover fieldset': {
                            borderColor: '#1976d2',
                        },
                    },
                },
            },
        },
        MuiCard: {
            styleOverrides: {
                root: {
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                },
            },
        },
    },
    breakpoints: {
        values: {
            xs: 0,
            sm: 600,
            md: 900,
            lg: 1200,
            xl: 1536,
        },
    },
    transitions: {
        duration: {
            shortest: 150,
            shorter: 200,
            short: 250,
            standard: 300,
            complex: 375,
            enteringScreen: 225,
            leavingScreen: 195,
        },
    },
});

function App() {
    return (
        <ThemeProvider theme={theme}>
            <ToastContainer />
            <URLRoutes />
        </ThemeProvider>
    );
}

export default App;
