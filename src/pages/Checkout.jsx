// src/pages/Checkout.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Paper, Grid, Button, CircularProgress, Radio, RadioGroup, FormControlLabel, TextField, Alert, Divider } from '@mui/material';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

const Checkout = () => {
  const [cart, setCart] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [cartRes, addressesRes] = await Promise.all([
            api.get('/catalog/cart/'),
            api.get('/catalog/addresses/'),
        ]);
        
        const fetchedCart = cartRes.data;
        if (fetchedCart.items?.length === 0) {
            alert('Your cart is empty. Redirecting to cart.');
            navigate('/cart');
            return;
        }

        const fetchedAddresses = addressesRes.data.results || addressesRes.data;

        setCart(fetchedCart);
        setAddresses(fetchedAddresses);
        
        const defaultAddress = fetchedAddresses.find(a => a.is_default) || fetchedAddresses?.[0];
        if (defaultAddress) setSelectedAddress(String(defaultAddress.id));

      } catch (err) {
        setError('Failed to load checkout data. Please log in or try again.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [navigate]);

  const handlePlaceOrder = async () => {
    if (!selectedAddress) { setError('Please select a shipping address.'); return; }
    setError('');

    try {
      const payload = { address_id: parseInt(selectedAddress), voucher_code: voucherCode || null };
      const response = await api.post('/catalog/orders/create/', payload);
      
      // Redirect to payment initiation page after successful order creation
      navigate(`/orders/${response.data.id}/payment`);
    } catch (err) {
      setError(err.response?.data?.detail || JSON.stringify(err.response?.data) || 'Failed to place order.');
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (!cart || cart.items?.length === 0) return null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">Checkout</Typography>
        {error && <Alert severity="error" sx={{mb: 2}}>{error}</Alert>}
        <Grid container spacing={4}>
            <Grid item xs={12} md={7}>
                <Paper sx={{p: 3, borderRadius: 2}}>
                    <Typography variant="h6" gutterBottom>Select Shipping Address</Typography>
                    {addresses.length > 0 ? (
                        <RadioGroup value={selectedAddress} onChange={(e) => setSelectedAddress(e.target.value)}>
                            {addresses.map(addr => (
                                <Paper key={addr.id} variant="outlined" sx={{p: 2, mb: 1, borderRadius: 2}}>
                                    <FormControlLabel 
                                      value={String(addr.id)} 
                                      control={<Radio />} 
                                      label={
                                        <Box>
                                            <Typography variant="body1">{addr.address_line_1}, {addr.city}</Typography>
                                            <Typography variant="body2" color="text.secondary">{addr.state} - {addr.pincode}</Typography>
                                        </Box>
                                      }
                                    />
                                </Paper>
                            ))}
                        </RadioGroup>
                    ) : (
                        <Typography>No addresses found. Please add one.</Typography>
                    )}
                    <Button component={Link} to="/addresses" sx={{ mt: 2 }} variant="outlined">Manage Addresses</Button>
                </Paper>
            </Grid>
            <Grid item xs={12} md={5}>
                <Paper sx={{p: 3, borderRadius: 2}}>
                    <Typography variant="h6" gutterBottom>Order Summary</Typography>
                    {cart && cart.items.map(item => (
                        <Box key={item.id} display="flex" justifyContent="space-between" sx={{mb: 0.5}}>
                            <Typography>{item.product_title} x {item.qty}</Typography>
                            <Typography>₹{item.total_with_gst}</Typography>
                        </Box>
                    ))}
                    <Divider sx={{my: 2}} />
                    <Box display="flex" justifyContent="space-between" sx={{mb: 1}}><Typography>Total (Ex. GST):</Typography><Typography>₹{cart?.total}</Typography></Box>
                    <Box display="flex" justifyContent="space-between"><Typography>Total GST:</Typography><Typography>₹{cart?.total_gst}</Typography></Box>
                    <Divider sx={{my: 2}} />
                    <Box display="flex" justifyContent="space-between"><Typography variant="h6" fontWeight="bold">Grand Total</Typography><Typography variant="h6" fontWeight="bold">₹{cart?.grand_total}</Typography></Box>
                    <Divider sx={{my: 2}} />
                    <Typography variant="h6" gutterBottom>Apply Voucher</Typography>
                    <TextField fullWidth label="Voucher Code (Optional)" value={voucherCode} onChange={e => setVoucherCode(e.target.value)} size="small" sx={{mt: 1}} />
                    <Button fullWidth variant="contained" size="large" onClick={handlePlaceOrder} sx={{mt: 2, py: 1.5}} disabled={!selectedAddress}>Confirm & Place Order</Button>
                </Paper>
            </Grid>
        </Grid>
    </Container>
  );
};

export default Checkout;