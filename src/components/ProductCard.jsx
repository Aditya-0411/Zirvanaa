// src/components/ProductCard.jsx
import React from 'react';
import { Card, CardContent, CardMedia, Typography, Button, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { toast } from 'react-toastify';
import api from '../api';

const ProductCard = ({ product }) => {
    const isOutOfStock = product.stock === 0;

    const handleAddToCart = async (e) => {
        e.stopPropagation(); 
        e.preventDefault(); 
        
        try {
            await api.post("/catalog/cart/add/", { product: product.id, qty: 1 });
            toast.success("Added to cart!");
        } catch (err) {
            toast.error(err.response?.data?.detail || "Failed to add to cart. Please log in.");
        }
    };

    return (
        <Card 
            component={Link} 
            to={`/products/${product.slug}`} 
            sx={{ maxWidth: 345, height: '100%', display: 'flex', flexDirection: 'column', textDecoration: 'none' }}
        >
            <CardMedia
                component="img"
                height="180"
                image={product.thumbnail || '/placeholder-product.png'}
                alt={product.title}
                sx={{ objectFit: 'contain', p: 1 }}
            />
            <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div" noWrap>
                    {product.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Category: {product.category?.name || 'N/A'}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 1 }}>
                    <Typography variant="h5" color="primary">
                        ₹{product.price_with_gst}
                    </Typography>
                    <Typography variant="body2" sx={{ textDecoration: 'line-through' }}>
                        MRP: ₹{product.mrp}
                    </Typography>
                </Box>
            </CardContent>
            <Box sx={{ p: 2, display: 'flex', gap: 1 }}>
                <Button 
                    variant="contained" 
                    color="primary" 
                    size="small"
                    startIcon={<AddShoppingCartIcon />}
                    onClick={handleAddToCart}
                    disabled={isOutOfStock}
                >
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </Button>
            </Box>
        </Card>
    );
};

export default ProductCard;