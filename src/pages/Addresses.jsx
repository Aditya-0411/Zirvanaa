// src/pages/Addresses.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Grid, Button, CircularProgress, Alert, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import api from '../api';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

const initialAddressState = { id: null, address_line_1: '', address_line_2: '', city: '', state: '', pincode: '', address_type: 'home', is_default: false };

const AddressForm = ({ currentAddress, onSave, onCancel }) => {
    const [formData, setFormData] = useState(currentAddress || initialAddressState);
    const [submitting, setSubmitting] = useState(false);
    const isEdit = !!formData.id;

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === 'checkbox' ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        await onSave(formData);
        setSubmitting(false);
    };

    return (
        <Paper sx={{ p: 3, mb: 3 }} component="form" onSubmit={handleSubmit}>
            <Typography variant="h6">{isEdit ? 'Edit Address' : 'Add New Address'}</Typography>
            <Grid container spacing={2} sx={{ mt: 1 }}>
                <Grid item xs={12}><TextField required fullWidth label="Address Line 1" name="address_line_1" value={formData.address_line_1} onChange={handleChange} /></Grid>
                <Grid item xs={12}><TextField fullWidth label="Address Line 2 (Optional)" name="address_line_2" value={formData.address_line_2} onChange={handleChange} /></Grid>
                <Grid item xs={6}><TextField required fullWidth label="City" name="city" value={formData.city} onChange={handleChange} /></Grid>
                <Grid item xs={6}><TextField required fullWidth label="State" name="state" value={formData.state} onChange={handleChange} /></Grid>
                <Grid item xs={6}><TextField required fullWidth label="Pincode" name="pincode" value={formData.pincode} onChange={handleChange} inputProps={{maxLength: 6}} /></Grid>
                <Grid item xs={6}>
                    <FormControl fullWidth required>
                        <InputLabel>Type</InputLabel>
                        <Select label="Type" name="address_type" value={formData.address_type} onChange={handleChange}>
                            <MenuItem value="home">Home</MenuItem>
                            <MenuItem value="office">Office</MenuItem>
                            <MenuItem value="other">Other</MenuItem>
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
            <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                <Button onClick={onCancel} variant="outlined" disabled={submitting}>Cancel</Button>
                <Button type="submit" variant="contained" startIcon={<SaveIcon />} disabled={submitting}>
                    {submitting ? <CircularProgress size={24} /> : (isEdit ? 'Update' : 'Save')}
                </Button>
            </Box>
        </Paper>
    );
};


const Addresses = () => {
    const { isAuthenticated } = useAuth();
    const [addresses, setAddresses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingAddress, setEditingAddress] = useState(null);
    const [showForm, setShowForm] = useState(false);

    const fetchAddresses = async () => {
        if (!isAuthenticated) { setLoading(false); return; }
        setLoading(true);
        try {
            const response = await api.get('/catalog/addresses/'); 
            setAddresses(response.data.results || response.data);
        } catch (err) {
            toast.error("Failed to fetch addresses. Please log in.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAddresses();
    }, [isAuthenticated]);

    const handleSaveAddress = async (formData) => {
        try {
            if (formData.id) {
                // Update (PUT/PATCH in DRF for ModelViewSet)
                await api.put(`/catalog/addresses/${formData.id}/`, formData);
                toast.success("Address updated.");
            } else {
                // Create (POST)
                await api.post('/catalog/addresses/', formData);
                toast.success("Address added.");
            }
            setShowForm(false);
            setEditingAddress(null);
            fetchAddresses();
        } catch (err) {
            toast.error(err.response?.data?.detail || "Failed to save address.");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this address?")) return;
        try {
            await api.delete(`/catalog/addresses/${id}/`);
            toast.success("Address deleted.");
            fetchAddresses();
        } catch (err) {
            toast.error("Failed to delete address.");
        }
    };
    
    const handleCloseForm = () => {
        setShowForm(false);
        setEditingAddress(null);
    }

    if (!isAuthenticated) return <Alert severity="warning" sx={{ m: 3 }}>Please log in to manage your addresses.</Alert>;
    if (loading) return <Container sx={{ py: 4, textAlign: 'center' }}><CircularProgress /></Container>;

    return (
        <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
            <Typography variant="h4" gutterBottom fontWeight="bold">My Addresses</Typography>
            
            <Button variant="contained" onClick={() => { setEditingAddress(null); setShowForm(true); }} sx={{ mb: 3 }}>
                Add New Address
            </Button>

            {(showForm || editingAddress) && (
                <AddressForm 
                    currentAddress={editingAddress || initialAddressState} 
                    onSave={handleSaveAddress} 
                    onCancel={handleCloseForm}
                />
            )}

            <Paper sx={{ p: 2, borderRadius: 2 }}>
                <List>
                    {addresses.length === 0 ? (
                        <ListItem><ListItemText primary="You have no saved addresses." /></ListItem>
                    ) : (
                        addresses.map((addr) => (
                            <ListItem key={addr.id} divider sx={{ bgcolor: addr.is_default ? 'grey.50' : 'inherit' }}>
                                <ListItemText 
                                    primary={`${addr.address_line_1}, ${addr.city} (${addr.address_type.toUpperCase()})`} 
                                    secondary={`${addr.state} - ${addr.pincode} ${addr.is_default ? ' (DEFAULT)' : ''}`}
                                    primaryTypographyProps={{ fontWeight: addr.is_default ? 'bold' : 'normal' }}
                                />
                                <ListItemSecondaryAction>
                                    <IconButton edge="end" onClick={() => { setEditingAddress(addr); setShowForm(true); }} color="primary"><EditIcon /></IconButton>
                                    <IconButton edge="end" onClick={() => handleDelete(addr.id)} color="error" sx={{ ml: 1 }} disabled={addr.is_default}><DeleteIcon /></IconButton>
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))
                    )}
                </List>
            </Paper>
        </Container>
    );
};

export default Addresses;