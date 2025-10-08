import React, { useState, useEffect } from "react";
import axios from "../../api"; // your API instance with auth
import { toast } from "react-toastify";
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Typography,
  Grid,
  Switch,
  FormControlLabel,
  Card,
  CardMedia,
  IconButton,
  Alert
} from "@mui/material";
import { AddAPhoto as AddAPhotoIcon, Delete as DeleteIcon } from "@mui/icons-material";

const SellerProductForm = ({ onSuccess, product, onCancel }) => {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryError, setCategoryError] = useState("");

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    mrp: "",
    stock: "",
    brand: "",
    category: "",
    is_active: true,
  });

  const [images, setImages] = useState([]); // new images
  const [existingImages, setExistingImages] = useState([]); // existing images from backend
  const [submitting, setSubmitting] = useState(false);

  // Fetch categories & set product data if editing
  useEffect(() => {
    axios
      .get("/catalog/categories/")
      .then((response) => {
        if (Array.isArray(response.data)) {
          setCategories(response.data);
        } else if (response.data.results) {
          setCategories(response.data.results);
        } else {
          setCategoryError("Invalid response from categories API.");
        }
      })
      .catch((err) => {
        console.error("Failed to fetch categories:", err);
        setCategoryError("Failed to load categories.");
      })
      .finally(() => setLoadingCategories(false));

    if (product) {
      setForm({
        title: product.title || "",
        description: product.description || "",
        price: product.price || "",
        mrp: product.mrp || "",
        stock: product.stock || "",
        brand: product.brand || "",
        category: product.category?.id || "",
        is_active: product.is_active,
      });
      setExistingImages(product.images || []);
    }
  }, [product]);

  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setForm((prevForm) => ({
      ...prevForm,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const newImages = Array.from(e.target.files);
      setImages((prev) => [...prev, ...newImages]);
    }
  };

  const removeNewImage = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = async (imageId) => {
    // OPTIONAL: If you implement a delete image API
    toast.info("Delete image feature coming soon.");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      let response;
      if (product) {
        // ✅ Update product details
        response = await axios.patch(`/catalog/seller/products/${product.id}/`, form);
        toast.success("Product updated successfully!");
      } else {
        // ✅ Create new product
        response = await axios.post("/catalog/seller/products/", form);
        toast.success("Product added successfully!");
      }

      const productId = response.data.id;

      // ✅ Upload images if any
      if (images.length > 0) {
        const imgData = new FormData();
        imgData.append("product", productId);
        images.forEach((img) => imgData.append("images", img));

        await axios.post("/catalog/seller/upload-image/", imgData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      if (onSuccess) onSuccess(response.data);

      if (!product) {
        setForm({
          title: "",
          description: "",
          price: "",
          mrp: "",
          stock: "",
          brand: "",
          category: "",
          is_active: true,
        });
        setImages([]);
      }
    } catch (err) {
      console.error("Failed to submit product:", err);
      toast.error("Failed to submit product. Check your fields and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Card sx={{ p: 4 }}>
      <Typography variant="h5" gutterBottom>
        {product ? "Update Product" : "Add New Product"}
      </Typography>
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Title */}
          <Grid item xs={12}>
            <TextField
              name="title"
              label="Product Title"
              value={form.title}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>

          {/* Description */}
          <Grid item xs={12}>
            <TextField
              name="description"
              label="Description"
              value={form.description}
              onChange={handleChange}
              multiline
              rows={4}
              fullWidth
            />
          </Grid>

          {/* Price & MRP */}
          <Grid item xs={6}>
            <TextField
              name="price"
              label="Price"
              type="number"
              value={form.price}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="mrp"
              label="MRP (Optional)"
              type="number"
              value={form.mrp}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          {/* Stock & Brand */}
          <Grid item xs={6}>
            <TextField
              name="stock"
              label="Stock"
              type="number"
              value={form.stock}
              onChange={handleChange}
              fullWidth
              required
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              name="brand"
              label="Brand"
              value={form.brand}
              onChange={handleChange}
              fullWidth
            />
          </Grid>

          {/* Category */}
          <Grid item xs={12}>
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              {loadingCategories ? (
                <CircularProgress size={24} sx={{ my: 2 }} />
              ) : categoryError ? (
                <Alert severity="error">{categoryError}</Alert>
              ) : (
                <Select
                  name="category"
                  label="Category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <MenuItem value="">
                    <em>None</em>
                  </MenuItem>
                  {categories.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.name}
                    </MenuItem>
                  ))}
                </Select>
              )}
            </FormControl>
          </Grid>

          {/* Upload Images */}
          <Grid item xs={12}>
            <Button
              variant="outlined"
              component="label"
              startIcon={<AddAPhotoIcon />}
              fullWidth
            >
              Upload Images
              <input type="file" multiple hidden onChange={handleImageChange} />
            </Button>

            {/* Show existing images if editing */}
            {existingImages.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
                {existingImages.map((img) => (
                  <Card key={img.id} sx={{ width: 100, height: 100, position: "relative" }}>
                    <CardMedia
                      component="img"
                      image={img.image}
                      alt={img.alt || "Existing Image"}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <IconButton
                      size="small"
                      sx={{ position: "absolute", top: 0, right: 0, color: "white" }}
                      onClick={() => removeExistingImage(img.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Card>
                ))}
              </Box>
            )}

            {/* Show previews of new images */}
            {images.length > 0 && (
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 2, mt: 2 }}>
                {images.map((img, idx) => (
                  <Card key={idx} sx={{ width: 100, height: 100, position: "relative" }}>
                    <CardMedia
                      component="img"
                      image={URL.createObjectURL(img)}
                      alt={`Preview ${idx}`}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                    <IconButton
                      size="small"
                      sx={{ position: "absolute", top: 0, right: 0, color: "white" }}
                      onClick={() => removeNewImage(idx)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Card>
                ))}
              </Box>
            )}
          </Grid>

          {/* Is Active */}
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Switch
                  checked={form.is_active}
                  onChange={handleChange}
                  name="is_active"
                />
              }
              label="Product is active"
            />
          </Grid>

          {/* Submit */}
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={submitting}
            >
              {submitting ? <CircularProgress size={24} /> : product ? "Update Product" : "Add Product"}
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Card>
  );
};

export default SellerProductForm;
