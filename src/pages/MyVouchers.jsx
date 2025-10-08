import React, { useEffect, useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  CircularProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  IconButton,
} from '@mui/material';
import { ContentCopy } from '@mui/icons-material';
import { toast } from 'react-toastify';
import api from '../api';

const MyVouchers = () => {
  const [vouchers, setVouchers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchVouchers();
  }, []);

  const fetchVouchers = async () => {
    setLoading(true);
    try {
      const response = await api.get('/catalog/vouchers/');
      const data = response.data;

      if (Array.isArray(data)) {
        setVouchers(data);
      } else if (data.results && Array.isArray(data.results)) {
        setVouchers(data.results);
      } else {
        setVouchers([]);
      }
    } catch (err) {
      console.error('Failed to fetch vouchers:', err);
      setError('Failed to load vouchers.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    toast.info('Voucher code copied to clipboard!');
  };

  if (loading) {
    return (
      <Box sx={{ textAlign: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container sx={{ mt: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        My Vouchers
      </Typography>
      {vouchers.length === 0 ? (
        <Alert severity="info">You have not purchased any vouchers yet.</Alert>
      ) : (
        <Paper elevation={3} sx={{ p: 2 }}>
          <List>
            {vouchers.map((voucher) => (
              <ListItem key={voucher.id} divider>
                <ListItemText
                  primary={`Code: ${voucher.code}`}
                  secondary={`Value: ₹${voucher.value} | ${
                    voucher.is_used ? 'Used' : 'Not Used'
                  }`}
                />
                <IconButton onClick={() => handleCopy(voucher.code)}>
                  <ContentCopy fontSize="small" />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </Paper>
      )}
    </Container>
  );
};

export default MyVouchers;
