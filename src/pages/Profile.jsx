// import React, { useState, useEffect } from 'react';
// import {
//   Container,
//   Typography,
//   Box,
//   Paper,
//   Grid,
//   CircularProgress,
//   Alert,
//   Button,
//   Avatar,
//   Divider,
// } from '@mui/material';
// import { Link } from 'react-router-dom';
// import api from '../api';
// import { Email, Phone, CalendarToday, Person, Store } from '@mui/icons-material';

// const Profile = () => {
//   const [user, setUser] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       try {
//         const response = await api.get('/accounts/profile/');
//         setUser(response.data);
//       } catch (err) {
//         setError('Failed to fetch profile data.');
//       } finally {
//         setLoading(false);
//       }
//     };
//     fetchProfile();
//   }, []);

//   if (loading) {
//     return (
//       <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
//         <CircularProgress size={50} />
//       </Box>
//     );
//   }

//   if (error || !user) {
//     return (
//       <Typography color="error" align="center" mt={6} variant="h6">
//         {error || 'User profile not found.'}
//       </Typography>
//     );
//   }

//   const initials = user.name ? user.name.charAt(0).toUpperCase() : '?';

//   return (
//     <Container maxWidth="md">
//       <Box sx={{ mt: 5 }}>
//         <Paper elevation={4} sx={{ borderRadius: 3, overflow: 'hidden' }}>
//           {/* Header Section */}
//           <Box
//             sx={{
//               backgroundColor: 'primary.main',
//               color: 'white',
//               display: 'flex',
//               alignItems: 'center',
//               flexDirection: 'column',
//               py: 4,
//             }}
//           >
//             <Avatar
//               sx={{ width: 100, height: 100, bgcolor: 'white', color: 'primary.main', fontSize: 40, mb: 2 }}
//             >
//               {initials}
//             </Avatar>
//             <Typography variant="h5" fontWeight="bold">
//               {user.name}
//             </Typography>
//             <Typography variant="subtitle1" sx={{ opacity: 0.8 }}>
//               {user.email}
//             </Typography>
//           </Box>

//           {/* Body Section */}
//           <Box sx={{ p: 4 }}>
//             <Typography variant="h6" gutterBottom>
//               Personal Details
//             </Typography>
//             <Divider sx={{ mb: 3 }} />

//             <Grid container spacing={3}>
//               <Grid item xs={12} md={6}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <Email color="primary" />
//                   <Typography>{user.email}</Typography>
//                 </Box>
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <Phone color="primary" />
//                   <Typography>{user.phone_number || 'Not provided'}</Typography>
//                 </Box>
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <Person color="primary" />
//                   <Typography>
//                     {user.gender === 'M' ? 'Male' : user.gender === 'F' ? 'Female' : 'Other'}
//                   </Typography>
//                 </Box>
//               </Grid>
//               <Grid item xs={12} md={6}>
//                 <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
//                   <CalendarToday color="primary" />
//                   <Typography>{user.date_of_birth || 'N/A'}</Typography>
//                 </Box>
//               </Grid>
//               <Grid item xs={12}>
//                 <Typography>
//                   <strong>Referral Code:</strong> {user.referral_code || 'Not available'}
//                 </Typography>
//               </Grid>
//             </Grid>

//             {/* Seller Section */}
//             <Box sx={{ mt: 4 }}>
//               <Typography variant="h6" gutterBottom>
//                 Seller Information
//               </Typography>
//               <Divider sx={{ mb: 3 }} />

//               <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
//                 <Store color="primary" />
//                 <Typography>
//                   {user.is_seller ? (
//                     <>
//                       Status: <strong>{user.seller_status}</strong>
//                     </>
//                   ) : (
//                     'Not a Seller'
//                   )}
//                 </Typography>
//               </Box>

//               {user.is_seller && user.seller_status === 'pending' && (
//                 <Alert severity="info">
//                   Your seller application is under review. We will notify you when it's approved.
//                 </Alert>
//               )}
//               {user.is_seller && user.seller_status === 'rejected' && (
//                 <Alert severity="error">
//                   Your seller application was rejected. Please contact support.
//                 </Alert>
//               )}
//               {!user.is_seller && (
//                 <Button
//                   component={Link}
//                   to="/seller/register"
//                   variant="contained"
//                   color="primary"
//                   size="large"
//                   sx={{ mt: 2 }}
//                 >
//                   Become a Seller
//                 </Button>
//               )}
//             </Box>
//           </Box>
//         </Paper>
//       </Box>
//     </Container>
//   );
// };

// export default Profile;










// src/pages/Profile.jsx - WITH EDIT FUNCTIONALITY

import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Grid, Divider, Button, CircularProgress, Alert, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField, MenuItem } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import { useAuth } from '../context/AuthContext';
import api from '../api';
import { toast } from 'react-toastify';
import { Email, Phone, CalendarToday, Person, Store, Edit, Save } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user: contextUser, isAuthenticated, logout } = useAuth();
    
    // 1. STATE MANAGEMENT
    const [profileData, setProfileData] = useState(null);
    const [notifications, setNotifications] = useState([]);
    const [isEditing, setIsEditing] = useState(false); // New state for toggling edit mode
    const [editForm, setEditForm] = useState({});       // State for editable fields
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    // 2. FETCHING DATA
    const fetchProfileData = async () => {
        if (!isAuthenticated) return;
        setLoading(true);
        try {
            const [profileRes, notifRes] = await Promise.all([
                api.get('/accounts/profile/'),
                api.get('/accounts/notifications/')
            ]);
            
            const userData = profileRes.data;
            setProfileData(userData);
            // Initialize edit form state with current user data
            setEditForm({
                name: userData.name,
                email: userData.email,
                gender: userData.gender,
                date_of_birth: userData.date_of_birth,
                referral_code: userData.referral_code || '',
            });
            setNotifications(notifRes.data.results || notifRes.data);
        } catch (err) {
            setError("Failed to fetch profile data.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, [isAuthenticated]);

    // 3. EDIT HANDLERS
    const handleEditChange = (e) => {
        setEditForm({ ...editForm, [e.target.name]: e.target.value });
    };

    const handleSave = async () => {
        setSubmitting(true);
        setError(null);
        try {
            // Note: The phone_number is intentionally NOT editable here as it's the USERNAME_FIELD
            const payload = {
                name: editForm.name,
                email: editForm.email,
                gender: editForm.gender,
                date_of_birth: editForm.date_of_birth,
                // Only send referral_code if it's explicitly part of the update
            };

            await api.patch('/accounts/profile/', payload); 
            
            toast.success("Profile updated successfully!");
            setIsEditing(false); // Exit edit mode
            fetchProfileData(); // Reload data to show updated profile
        } catch (err) {
            setError(err.response?.data?.detail || JSON.stringify(err.response?.data) || "Failed to save profile.");
        } finally {
            setSubmitting(false);
        }
    };
    
    const handleMarkRead = async (id) => {
        try {
            await api.post(`/accounts/notifications/${id}/read/`);
            setNotifications(notif => notif.map(n => n.id === id ? { ...n, is_read: true } : n));
            toast.success("Notification marked as read.");
        } catch (err) {
            toast.error("Could not mark as read.");
        }
    };

    if (loading) return <Container sx={{ py: 4, textAlign: 'center' }}><CircularProgress /></Container>;
    if (error || !profileData) return <Alert severity="error">{(error || 'User profile not found.')}</Alert>;

    const initials = profileData.name ? profileData.name.charAt(0).toUpperCase() : '?';
    const isApprovedSeller = profileData.seller_status === 'approved';
    const isPendingSeller = profileData.seller_status === 'pending';


    // Helper function for display rows
    const DetailRow = ({ Icon, label, value }) => (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1.5 }}>
            <Icon color="primary" sx={{ fontSize: 20 }} />
            <Typography>
                <strong>{label}:</strong> {value || 'N/A'}
            </Typography>
        </Box>
    );

    return (
        <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">My Profile</Typography>
            <Grid container spacing={4}>
                
                {/* 1. User Details and Edit Form */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 4, borderRadius: 2 }}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                            <Typography variant="h5">Personal Information</Typography>
                            {isEditing ? (
                                <Box>
                                    <Button onClick={handleSave} disabled={submitting} startIcon={<Save />} color="success" variant="contained" size="small">
                                        {submitting ? <CircularProgress size={20} color="inherit" /> : 'Save'}
                                    </Button>
                                    <Button onClick={() => setIsEditing(false)} disabled={submitting} size="small" sx={{ ml: 1 }}>
                                        Cancel
                                    </Button>
                                </Box>
                            ) : (
                                <IconButton onClick={() => setIsEditing(true)} color="primary">
                                    <Edit />
                                </IconButton>
                            )}
                        </Box>
                        
                        <Divider sx={{ mb: 3 }} />

                        {/* Display or Edit Fields */}
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                {isEditing ? (
                                    <TextField fullWidth label="Name" name="name" value={editForm.name} onChange={handleEditChange} required size="small" />
                                ) : (
                                    <DetailRow Icon={Person} label="Name" value={profileData.name} />
                                )}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <DetailRow Icon={Phone} label="Phone" value={profileData.phone_number} />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {isEditing ? (
                                    <TextField fullWidth label="Email" name="email" value={editForm.email} onChange={handleEditChange} required size="small" type="email" />
                                ) : (
                                    <DetailRow Icon={Email} label="Email" value={profileData.email} />
                                )}
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                {isEditing ? (
                                    <TextField fullWidth select label="Gender" name="gender" value={editForm.gender} onChange={handleEditChange} required size="small">
                                        <MenuItem value="M">Male</MenuItem>
                                        <MenuItem value="F">Female</MenuItem>
                                        <MenuItem value="O">Other</MenuItem>
                                    </TextField>
                                ) : (
                                    <DetailRow Icon={Person} label="Gender" value={profileData.gender === 'M' ? 'Male' : profileData.gender === 'F' ? 'Female' : 'Other'} />
                                )}
                            </Grid>
                            <Grid item xs={12}>
                                <DetailRow Icon={CalendarToday} label="DOB" value={profileData.date_of_birth} />
                            </Grid>
                        </Grid>
                        
                        <Divider sx={{ my: 3 }} />

                        {/* Seller Status Section */}
                        <Typography variant="subtitle1" gutterBottom sx={{ color: 'primary.main', mb: 1 }}>Seller Status</Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Store color="primary" />
                            <Typography>
                                Status: <strong>{profileData.seller_status ? profileData.seller_status.toUpperCase() : 'NOT REGISTERED'}</strong>
                            </Typography>
                        </Box>

                        <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                            {/* Conditional Seller Registration Button */}
                            {!isApprovedSeller && (
                                <Button 
                                    component={Link} 
                                    to="/seller/register" 
                                    variant="contained" 
                                    size="small"
                                    color={isPendingSeller ? "warning" : "primary"}
                                >
                                    {isPendingSeller ? 'View Application Status' : 'Become a Seller'}
                                </Button>
                            )}
                        </Box>

                    </Paper>
                </Grid>

                {/* 2. Notifications Section */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 4, borderRadius: 2 }}>
                        <Typography variant="h5" gutterBottom>Notifications</Typography>
                        <Divider sx={{ mb: 2 }} />
                        <List dense sx={{ maxHeight: 500, overflowY: 'auto' }}>
                            {notifications.length === 0 ? (
                                <Typography color="text.secondary">No notifications.</Typography>
                            ) : (
                                notifications.map((n) => (
                                    <ListItem key={n.id} disablePadding sx={{ opacity: n.is_read ? 0.6 : 1, bgcolor: n.is_read ? 'inherit' : 'grey.50' }}>
                                        <ListItemText 
                                            primary={n.title} 
                                            secondary={n.message} 
                                            primaryTypographyProps={{ fontWeight: n.is_read ? 'normal' : 'bold' }}
                                        />
                                        <ListItemSecondaryAction>
                                            {!n.is_read && (
                                                <IconButton edge="end" onClick={() => handleMarkRead(n.id)} size="small">
                                                    <CheckIcon fontSize="small" color="success" />
                                                </IconButton>
                                            )}
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))
                            )}
                        </List>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Profile;
