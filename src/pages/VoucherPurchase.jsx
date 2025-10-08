import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Paper,
  Alert,
  IconButton,
} from '@mui/material';
import { toast } from 'react-toastify';
import api from '../api';
import { ContentCopy } from '@mui/icons-material';

const VoucherPurchase = () => {
  const [voucherValue, setVoucherValue] = useState(100);
  const [loading, setLoading] = useState(false);
  const [purchasedVoucher, setPurchasedVoucher] = useState(null);

  const handlePurchase = async () => {
    if (!voucherValue) {
      toast.error('Please select a voucher value.');
      return;
    }

    setLoading(true);
    try {
      const response = await api.post('/catalog/vouchers/purchase/', { value: voucherValue });
      setPurchasedVoucher(response.data);
      toast.success(`Successfully purchased a voucher worth ₹${response.data.value}`);
    } catch (err) {
      console.error('Voucher purchase failed:', err);
      toast.error('Failed to purchase voucher. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (purchasedVoucher?.code) {
      navigator.clipboard.writeText(purchasedVoucher.code);
      toast.info('Voucher code copied to clipboard!');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Purchase a Gift Voucher
      </Typography>
      <Paper elevation={4} sx={{ p: 4, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          Select Voucher Value
        </Typography>
        <FormControl fullWidth sx={{ mb: 3 }}>
          <InputLabel>Value</InputLabel>
          <Select
            value={voucherValue}
            label="Value"
            onChange={(e) => setVoucherValue(e.target.value)}
            disabled={loading}
          >
            <MenuItem value={100}>₹100</MenuItem>
            <MenuItem value={500}>₹500</MenuItem>
            <MenuItem value={1000}>₹1000</MenuItem>
            <MenuItem value={2000}>₹2000</MenuItem>
          </Select>
        </FormControl>
        <Button
          variant="contained"
          color="primary"
          fullWidth
          onClick={handlePurchase}
          disabled={loading}
          startIcon={loading ? <CircularProgress size={20} color="inherit" /> : null}
          sx={{ py: 1.5 }}
        >
          {loading ? 'Processing...' : 'Purchase Voucher'}
        </Button>

        {purchasedVoucher && (
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Alert severity="success" sx={{ p: 3, borderRadius: 2 }}>
              <Typography variant="h6" sx={{ mb: 1 }}>
                Voucher Purchased Successfully!
              </Typography>
              <Typography variant="body1" sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Your voucher code:
                <strong style={{ margin: '0 8px' }}>{purchasedVoucher.code}</strong>
                <IconButton size="small" onClick={handleCopyCode}>
                  <ContentCopy fontSize="small" />
                </IconButton>
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                Value: ₹{purchasedVoucher.value}
              </Typography>
            </Alert>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default VoucherPurchase;
