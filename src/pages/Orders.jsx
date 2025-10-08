// src/pages/Orders.jsx
import React, { useState, useEffect }from 'react';
import { Container, Typography, Box, CircularProgress, Paper, Accordion, AccordionSummary, AccordionDetails, List, ListItem, ListItemText, Divider, Alert } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import api from '../api';

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await api.get('/catalog/orders/');
        setOrders(response.data.results || response.data);
      } catch (err) {
        console.error('Failed to fetch orders:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}><CircularProgress /></Box>;
  if (orders.length === 0) return <Typography variant="h5" align="center" mt={4}>You have not placed any orders yet.</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">My Orders</Typography>
      {orders.map((order) => (
        <Paper key={order.id} elevation={2} sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}>
          <Accordion>
            <AccordionSummary expandIcon={<ExpandMoreIcon />} sx={{ bgcolor: 'grey.100' }}>
              <Box sx={{ flexGrow: 1 }}>
                <Typography variant="h6">Order #{order.id}</Typography>
                <Typography variant="body2" color="text.secondary">
                  Status: <strong>{order.status.toUpperCase()}</strong> | Total: ₹{order.total} | Date: {new Date(order.created_at).toLocaleDateString()}
                </Typography>
              </Box>
            </AccordionSummary>
            <AccordionDetails>
              {order.shipping_address && (
                <>
                  <Typography variant="subtitle2" fontWeight="bold">Shipping Address:</Typography>
                  <Typography variant="body2" color="text.secondary" gutterBottom>
                    {order.shipping_address.address_line_1}, {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.pincode}
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                </>
              )}
              <Typography variant="subtitle1" fontWeight="bold">Items:</Typography>
              <List dense>
                {order.items.map((item) => (
                  <ListItem key={item.id}>
                    <ListItemText primary={`${item.title_snapshot} x ${item.qty}`} secondary={`Price at purchase: ₹${item.price_snapshot}`} />
                  </ListItem>
                ))}
              </List>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight="bold">Financials:</Typography>
              <Box sx={{ p: 1 }}>
                <Typography variant="body2">Subtotal: ₹{order.subtotal}</Typography>
                <Typography variant="body2">GST Amount: ₹{order.gst_amount}</Typography>
                <Typography variant="body2">Discount: - ₹{order.discount_amount}</Typography>
                <Typography variant="body1" fontWeight="bold">Final Total: ₹{order.total}</Typography>
              </Box>
            </AccordionDetails>
          </Accordion>
        </Paper>
      ))}
    </Container>
  );
};

export default Orders;