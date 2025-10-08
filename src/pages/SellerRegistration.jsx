import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Paper,
  Grid,
} from '@mui/material';
import api from '../api';

const SellerRegistration = () => {
  const [formData, setFormData] = useState({
    shop_name: '',
    pan_no: '',
    bank_account_number: '',
    bank_name: '',
    ifsc: '',
    branch: '',
    gst_no: '',
  });

  const [sellerStatus, setSellerStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerStatus = async () => {
      try {
        const response = await api.get('/accounts/seller/register/');
        if (response.data.exists) {
          setSellerStatus(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch seller status:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSellerStatus();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('accounts/seller/register/', formData);
      setSellerStatus(response.data);
      alert('Seller registration submitted successfully!');
    } catch (error) {
      alert('Seller registration failed: ' + error.response?.data?.detail);
    }
  };

  if (loading) {
    return (
      <Typography variant="h6" align="center" mt={4}>
        Loading...
      </Typography>
    );
  }

  if (sellerStatus && sellerStatus.exists) {
    return (
      <Container component="main" maxWidth="md">
        <Box sx={{ mt: 4 }}>
          <Typography variant="h4" gutterBottom>
            Seller Registration Status
          </Typography>
          <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
            <Typography variant="h6">
              Your seller profile for "{sellerStatus.shop_name}" is currently{' '}
              <span
                style={{
                  color:
                    sellerStatus.status === 'approved'
                      ? 'green'
                      : sellerStatus.status === 'rejected'
                      ? 'red'
                      : 'orange',
                }}
              >
                {sellerStatus.status}
              </span>
              .
            </Typography>
            <Typography variant="body1" sx={{ mt: 2 }}>
              We will notify you once your application is reviewed.
            </Typography>
          </Paper>
        </Box>
      </Container>
    );
  }

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          mt: 8,
        }}
      >
        <Typography component="h1" variant="h5">
          Seller Registration
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                name="shop_name"
                label="Shop Name"
                value={formData.shop_name}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="pan_no"
                label="PAN Number"
                value={formData.pan_no}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="bank_account_number"
                label="Bank Account Number"
                value={formData.bank_account_number}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="bank_name"
                label="Bank Name"
                value={formData.bank_name}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="ifsc"
                label="IFSC Code"
                value={formData.ifsc}
                onChange={handleChange}
                required
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="gst_no"
                label="GST Number (Optional)"
                value={formData.gst_no}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                name="branch"
                label="Bank Branch (Optional)"
                value={formData.branch}
                onChange={handleChange}
                fullWidth
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Submit Application
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default SellerRegistration;