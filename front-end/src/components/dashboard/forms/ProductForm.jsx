import React, { useState } from 'react';
import {
  Box,
  Paper,
  TextField,
  Button,
  Grid,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { CloudUpload, Clear } from '@mui/icons-material';

const ProductForm = ({ initialData = {}, onSubmit, loading = false }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    images: [],
    ...initialData
  });
  const [errors, setErrors] = useState({});

  const handleChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    if (errors[field]) {
      setErrors({ ...errors, [field]: '' });
    }
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files);
    const newImages = files.map(file => ({
      preview: URL.createObjectURL(file),
      file
    }));
    setFormData({ ...formData, images: [...formData.images, ...newImages] });
  };

  const removeImage = (index) => {
    const newImages = formData.images.filter((_, i) => i !== index);
    setFormData({ ...formData, images: newImages });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.price) newErrors.price = 'Price is required';
    if (!formData.category) newErrors.category = 'Category is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (validateForm()) {
      onSubmit?.(formData);
    }
  };

  return (
    <Paper sx={{ p: 3 }}>
      <Typography variant="h6" gutterBottom>
        {initialData.id ? 'Edit Product' : 'Create New Product'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Product Name"
              value={formData.name}
              onChange={handleChange('name')}
              error={Boolean(errors.name)}
              helperText={errors.name}
              required
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={formData.description}
              onChange={handleChange('description')}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Price"
              type="number"
              value={formData.price}
              onChange={handleChange('price')}
              error={Boolean(errors.price)}
              helperText={errors.price}
              InputProps={{
                startAdornment: <InputAdornment position="start">Rp</InputAdornment>,
              }}
              required
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Stock"
              type="number"
              value={formData.stock}
              onChange={handleChange('stock')}
            />
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth error={Boolean(errors.category)}>
              <InputLabel>Category</InputLabel>
              <Select
                value={formData.category}
                onChange={handleChange('category')}
                label="Category"
                required
              >
                <MenuItem value="electronics">Electronics</MenuItem>
                <MenuItem value="clothing">Clothing</MenuItem>
                <MenuItem value="books">Books</MenuItem>
                <MenuItem value="home">Home & Living</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ mb: 2 }}>
              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUpload />}
                sx={{ mr: 2 }}
              >
                Upload Images
                <input
                  type="file"
                  hidden
                  multiple
                  accept="image/*"
                  onChange={handleImageUpload}
                />
              </Button>
            </Box>
            <Grid container spacing={2}>
              {formData.images.map((image, index) => (
                <Grid item xs={6} sm={4} md={3} key={index}>
                  <Box sx={{ position: 'relative' }}>
                    <img
                      src={image.preview}
                      alt={`Preview ${index + 1}`}
                      style={{
                        width: '100%',
                        height: '100px',
                        objectFit: 'cover',
                        borderRadius: '4px'
                      }}
                    />
                    <IconButton
                      size="small"
                      onClick={() => removeImage(index)}
                      sx={{
                        position: 'absolute',
                        top: 4,
                        right: 4,
                        bgcolor: 'background.paper'
                      }}
                    >
                      <Clear />
                    </IconButton>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <LoadingButton
              type="submit"
              variant="contained"
              loading={loading}
              sx={{ mr: 2 }}
            >
              {initialData.id ? 'Update Product' : 'Create Product'}
            </LoadingButton>
            <Button variant="outlined" onClick={() => window.history.back()}>
              Cancel
            </Button>
          </Grid>
        </Grid>
      </form>
    </Paper>
  );
};

export default ProductForm;
