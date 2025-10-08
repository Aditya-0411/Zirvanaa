// src/pages/seller/SellerOrders.jsx
import React, { useEffect, useState } from "react";
import {
  Box, Typography, CircularProgress, Alert, Paper, Table, TableHead, TableRow, TableCell, TableBody, TableContainer
} from "@mui/material";
import api from "../../api";

export default function SellerOrders() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/catalog/seller/orders/");
      const data = Array.isArray(res.data) ? res.data : (res.data.results ?? res.data);
      setRows(data);
    } catch (err) {
      console.error("Failed to load seller orders", err);
      if (err.response?.status === 403) setError("You do not have permission to view seller orders.");
      else setError("Failed to load orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  if (!rows.length) return <Typography color="text.secondary">No orders for your products yet.</Typography>;

  return (
    <TableContainer component={Paper}>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Order Item ID</TableCell>
            <TableCell>Product</TableCell>
            <TableCell align="right">Qty</TableCell>
            <TableCell align="right">Price</TableCell>
            <TableCell>Order #</TableCell>
            <TableCell>Order Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map(item => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell>{item.title_snapshot}</TableCell>
              <TableCell align="right">{item.qty}</TableCell>
              <TableCell align="right">₹{item.price_snapshot}</TableCell>
              <TableCell>{item.order?.id ?? "-"}</TableCell>
              <TableCell>{item.order_status ?? item.order?.status ?? "-"}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}