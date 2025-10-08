// src/pages/seller/SellerProducts.jsx
import React, { useEffect, useState } from "react";
import {
  Box, Typography, Button, Grid, Paper, CircularProgress, Alert, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, IconButton, Dialog, DialogTitle, DialogContent, DialogActions
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import api from "../../api";
import SellerProductForm from "./SellerProductForm";
import { toast } from 'react-toastify';

export default function SellerProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [openForm, setOpenForm] = useState(false);

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/catalog/seller/products/");
      const list = Array.isArray(res.data) ? res.data : (res.data.results ?? []);
      setProducts(list);
    } catch (err) {
      console.error("Failed to load seller products", err);
      if (err.response?.status === 403) setError("You are not allowed. Ensure your seller account is approved.");
      else if (err.response?.status === 401) setError("Not authenticated. Please login.");
      else setError("Failed to load products.");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await api.delete(`/catalog/seller/products/${productId}/`);
      toast.success("Product deleted successfully!");
      load();
    } catch (err) {
      console.error("Failed to delete product", err);
      toast.error("Failed to delete product.");
    }
  };

  useEffect(() => { load(); }, []);

  if (loading) return <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Box>
      <Box sx={{ display: "flex", justifyContent: "flex-end", mb: 2 }}>
        <Button variant="contained" onClick={() => setOpenForm(true)}>Add New Product</Button>
      </Box>
      
      {!products.length ? (
        <Typography color="text.secondary">You have no products yet. Add your first one!</Typography>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Title</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Stock</TableCell>
                <TableCell>Active</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>{p.title}</TableCell>
                  <TableCell>{p.category?.name ?? (p.category || "-")}</TableCell>
                  <TableCell align="right">₹{p.price}</TableCell>
                  <TableCell align="right">{p.stock}</TableCell>
                  <TableCell>{p.is_active ? "Yes" : "No"}</TableCell>
                  <TableCell align="center">
                    <IconButton color="error" onClick={() => handleDelete(p.id)}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      <Dialog open={openForm} onClose={() => setOpenForm(false)} maxWidth="md" fullWidth>
        <DialogTitle>Add Product</DialogTitle>
        <DialogContent dividers>
          <SellerProductForm
            onCreated={() => { setOpenForm(false); load(); }}
            onCancel={() => setOpenForm(false)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenForm(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}