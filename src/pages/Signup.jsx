// src/pages/Signup.jsx - TABBED & HIGHLY COMPACT UI

import React, { useState } from 'react';
import { 
    Container, Typography, Box, TextField, Button, CircularProgress, Alert, MenuItem, 
    Paper, Grid, IconButton, InputAdornment, Avatar, Tabs, Tab 
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { toast } from 'react-toastify';

// Corrected Icon Imports
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ShareIcon from '@mui/icons-material/Share'; 
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import EmailIcon from '@mui/icons-material/Email';

// Helper component for Tab Content
const TabPanel = (props) => {
    const { children, value, index, ...other } = props;
    return (
        <div hidden={value !== index} {...other}>
            {value === index && (<Box sx={{ pt: 3 }}>{children}</Box>)}
        </div>
    );
};


const Signup = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '', phone_number: '', email: '', gender: 'M', date_of_birth: '', password: '', password2: '',
        referral_code: '' 
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [activeTab, setActiveTab] = useState(0); // State for Tab control

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        // Final check before sending (ensure user is on the last tab)
        if (activeTab === 0) {
            setActiveTab(1);
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await api.post('/accounts/signup/', formData); 
            toast.success("Registration successful! Please log in.");
            navigate('/login');
        } catch (err) {
            const errors = err.response?.data;
            let errorMessage = errors?.detail || JSON.stringify(errors, null, 2);
            setError(errorMessage || 'Signup failed.');
            setActiveTab(1); // Keep user on security tab if error occurs there
        } finally {
            setLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword((prev) => !prev);
    };

    return (
        <Container maxWidth="sm" sx={{ mt: 3, mb: 3 }}>
            <Paper elevation={10} sx={{ p: { xs: 3, md: 4 }, borderRadius: 2, margin: '0 auto' }}>
                
                {/* Header & Title */}
                <Box textAlign="center" mb={2}>
                    <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48, m: '0 auto', mb: 1 }}>
                        <PersonOutlineIcon sx={{ fontSize: 26 }} />
                    </Avatar>
                    <Typography variant="h5" component="h1" fontWeight={600}>
                        Create Account
                    </Typography>
                </Box>
                
                {error && (
                    <Alert severity="error" sx={{ mb: 2, whiteSpace: 'pre-wrap' }}>{error}</Alert>
                )}

                <Box component="form" onSubmit={handleSubmit}>
                    
                    {/* Tab Navigation */}
                    <Tabs value={activeTab} onChange={(e, val) => setActiveTab(val)} centered variant="fullWidth" sx={{ mb: 1 }}>
                        <Tab label="1. Personal Info" />
                        <Tab label="2. Security" />
                    </Tabs>

                    {/* Tab Content 1: Personal Details */}
                    <TabPanel value={activeTab} index={0}>
                        <Grid container spacing={2}> 
                            
                            {/* Name, Phone, Email (Required) */}
                            <Grid item xs={12} sm={6}>
                                <TextField required fullWidth size="small" label="Full Name" name="name" value={formData.name} onChange={handleChange} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField required fullWidth size="small" label="Phone Number" name="phone_number" type="tel" value={formData.phone_number} onChange={handleChange} inputProps={{ maxLength: 15 }} 
                                    InputProps={{ startAdornment: (<InputAdornment position="start"><PhoneIphoneIcon /></InputAdornment>) }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField required fullWidth size="small" label="Email" name="email" type="email" value={formData.email} onChange={handleChange} 
                                    InputProps={{ startAdornment: (<InputAdornment position="start"><EmailIcon /></InputAdornment>) }}
                                />
                            </Grid>

                            {/* DOB, Gender */}
                            <Grid item xs={12} sm={6}>
                                <TextField 
                                    required fullWidth size="small" label="Date of Birth" name="date_of_birth" type="date"
                                    InputLabelProps={{ shrink: true }} value={formData.date_of_birth} onChange={handleChange} 
                                    InputProps={{ startAdornment: (<InputAdornment position="start"><CalendarTodayIcon /></InputAdornment>) }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField required select label="Gender" name="gender" value={formData.gender} onChange={handleChange} fullWidth size="small">
                                    <MenuItem value="M">Male</MenuItem>
                                    <MenuItem value="F">Female</MenuItem>
                                    <MenuItem value="O">Other</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField 
                                    fullWidth size="small" label="Referral Code (Optional)" name="referral_code" 
                                    value={formData.referral_code} onChange={handleChange} 
                                    InputProps={{ startAdornment: (<InputAdornment position="start"><ShareIcon /></InputAdornment>) }}
                                />
                            </Grid>
                        </Grid>
                        
                        {/* Next Button for Tab 0 */}
                        <Button 
                            variant="contained" 
                            color="primary" 
                            size="large" 
                            fullWidth 
                            onClick={() => setActiveTab(1)}
                            sx={{ mt: 3, py: 1.2 }}
                        >
                            Next: Set Password
                        </Button>
                    </TabPanel>

                    {/* Tab Content 2: Security */}
                    <TabPanel value={activeTab} index={1}>
                        <Grid container spacing={2}> 
                            
                            <Grid item xs={12} sm={6}>
                                <TextField 
                                    required fullWidth size="small" label="Password" name="password" 
                                    type={showPassword ? 'text' : 'password'} value={formData.password} onChange={handleChange}
                                    InputProps={{
                                        startAdornment: ( <InputAdornment position="start"><LockOutlinedIcon /></InputAdornment> ),
                                        endAdornment: (
                                            <IconButton onClick={togglePasswordVisibility} edge="end" size="small">
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        )
                                    }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField 
                                    required fullWidth size="small" label="Confirm Password" name="password2" 
                                    type={showPassword ? 'text' : 'password'} value={formData.password2} onChange={handleChange}
                                />
                            </Grid>
                        </Grid>

                        {/* Submit Button for Tab 1 */}
                        <Button 
                            type="submit" 
                            variant="contained" 
                            color="primary" 
                            size="large" 
                            fullWidth 
                            disabled={loading} 
                            sx={{ mt: 3, py: 1.2, fontSize: '1.1rem' }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                        </Button>
                        <Button 
                            onClick={() => setActiveTab(0)} 
                            variant="text" 
                            fullWidth 
                            sx={{ mt: 1 }}
                            disabled={loading}
                        >
                            Back to Personal Info
                        </Button>
                    </TabPanel>
                </Box>
                
                {/* Footer Link */}
                <Box sx={{ mt: 3, textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                        Already have an account? 
                        <Link to="/login" style={{ textDecoration: 'none', color: '#1976d2', fontWeight: 600, marginLeft: 4 }}>
                             Log In
                        </Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default Signup;