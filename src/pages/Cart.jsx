// src/pages/Cart.jsx
import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, CircularProgress, Paper, List, ListItem, Button, IconButton, TextField, Divider, Avatar, ListItemAvatar, ListItemText, Alert } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import api from '../api';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await api.get('/catalog/cart/');
      setCart(response.data);
    } catch (err) { 
        console.error('Failed to fetch cart:', err); 
    } finally { 
        setLoading(false); 
    }
  };

  useEffect(() => { fetchCart(); }, []);

  const handleUpdateQty = async (itemId, newQty) => {
    const qty = parseInt(newQty) || 0;
    if (qty < 0) return;

    try {
      await api.patch('/catalog/cart/update-item/', { item_id: itemId, qty: qty });
      fetchCart();
    } catch (err) { 
        alert(err.response?.data?.detail || 'Failed to update cart quantity.'); 
    }
  };

  const handleClearCart = async () => {
    if (window.confirm('Are you sure you want to clear your cart?')) {
      try {
        await api.post('/catalog/cart/clear/');
        fetchCart();
      } catch (err) { alert('Failed to clear cart.'); }
    }
  };
  
  const handleProceedToCheckout = () => { navigate('/checkout'); };
  
  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (!cart || cart.items?.length === 0) return (
    <Container sx={{ textAlign: 'center', mt: 4 }}>
      <Typography variant="h4" gutterBottom>Your Cart is Empty</Typography>
      <Button variant="contained" onClick={() => navigate('/products')}>Continue Shopping</Button>
    </Container>
  );

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">Shopping Cart</Typography>
      <Paper elevation={3} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2 }}>
        <List>
          {cart.items.map((item) => (
            <ListItem key={item.id} divider
              secondaryAction={
                <IconButton edge="end" aria-label="delete" onClick={() => handleUpdateQty(item.id, 0)} color="error">
                  <DeleteIcon />
                </IconButton>
              }
            >
              <ListItemAvatar>
                <Avatar variant="rounded" src={item.image} sx={{ width: 60, height: 60, mr: 2 }} />
              </ListItemAvatar>
              <ListItemText
                primary={<Typography variant="h6">{item.product_title}</Typography>}
                secondary={`Price: ₹${item.price_snapshot} (GST: ₹${item.gst_amount})`}
              />
              <TextField 
                type="number" 
                value={item.qty} 
                onChange={(e) => handleUpdateQty(item.id, e.target.value)} 
                size="small" 
                sx={{ width: 80 }} 
                inputProps={{min: 0}}
              />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
        <Box sx={{ p: 2, textAlign: 'right' }}>
            <Typography variant="body1">Subtotal (Ex. GST): ₹{cart.total}</Typography>
            <Typography variant="body1">Total GST: ₹{cart.total_gst}</Typography>
            <Typography variant="h6" fontWeight="bold" mt={1}>Grand Total: ₹{cart.grand_total}</Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 2 }}>
          <Button variant="outlined" color="error" onClick={handleClearCart}>Clear Cart</Button>
          <Button variant="contained" size="large" onClick={handleProceedToCheckout} disabled={!cart.items?.length}>Proceed to Checkout</Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default Cart;