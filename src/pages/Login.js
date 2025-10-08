// src/pages/Login.jsx - PASSWORD ONLY (Beautified)

import React, { useState } from 'react';
import { Container, Typography, Box, TextField, Button, CircularProgress, Alert, Paper, InputAdornment } from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
// import api from '../api'; // Not needed for standard login
// import { toast } from 'react-toastify'; // Not needed if AuthContext handles toasts
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import LoginIcon from '@mui/icons-material/Login';

const Login = () => {
    const { login } = useAuth();
    const navigate = useNavigate();
    
    // Core State
    const [phone_number, setPhoneNumber] = useState('');
    const [password, setPassword] = useState(''); 
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null); // Used to display local errors

    // --- Core Action: Initiate Login ---
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // 1. Password Login: Use the AuthContext method
        const success = await login(phone_number, password);
        setLoading(false);
        
        if (success) {
            navigate('/');
        } else {
            // AuthContext should handle the toast/error, but set local error for UI feedback
            setError("Login failed. Check your phone number or password.");
        }
    };

    return (
        <Container maxWidth="xs" sx={{ mt: 5 }}>
            <Paper elevation={8} sx={{ p: { xs: 4, md: 5 }, borderRadius: 3 }}>
                <Box textAlign="center" mb={3}>
                    <LoginIcon color="primary" sx={{ fontSize: 40 }} />
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Welcome Back
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Log in using your phone number and password.
                    </Typography>
                </Box>
                
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Box 
                    component="form" 
                    onSubmit={handleSubmit} 
                    sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
                >
                    
                    {/* Phone Number Field */}
                    <TextField 
                        required 
                        label="Phone Number" 
                        value={phone_number} 
                        onChange={(e) => setPhoneNumber(e.target.value)}
                        InputProps={{ 
                            startAdornment: (
                                <InputAdornment position="start"><PhoneIphoneIcon /></InputAdornment>
                            ) 
                        }}
                    />
                    
                    {/* Password Field */}
                    <TextField 
                        required 
                        label="Password" 
                        type="password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        InputProps={{ 
                            startAdornment: (
                                <InputAdornment position="start"><LockOutlinedIcon /></InputAdornment>
                            ) 
                        }}
                    />
                    
                    <Button 
                        type="submit" 
                        variant="contained" 
                        size="large" 
                        disabled={loading} 
                        startIcon={!loading && <LoginIcon />}
                        sx={{ py: 1.5, mt: 1 }}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : 'Log In'}
                    </Button>
                </Box>

                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="body2">
                        Don't have an account? <Link to="/signup" style={{ color: '#1976d2', textDecoration: 'none' }}>Sign Up</Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Login;