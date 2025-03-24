import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Button, 
  Box, 
  Paper, 
  Rating, 
  Divider,
  Chip,
  CircularProgress,
  Snackbar,
  Alert 
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

// Mock data - replace with actual API call
const fetchProductDetails = (id) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id,
        name: "Premium Wireless Headphones",
        price: 129.99,
        description: "Immerse yourself in stunning sound quality with these premium wireless headphones. Featuring active noise cancellation, 30-hour battery life, and ultra-comfortable design.",
        rating: 4.5,
        reviews: 128,
        images: [
          "https://source.unsplash.com/random/800x600/?headphones",
          "https://source.unsplash.com/random/800x600/?headphones-side",
          "https://source.unsplash.com/random/800x600/?headphones-case",
        ],
        stock: 15,
        categories: ["Electronics", "Audio", "Wireless"]
      });
    }, 1000);
  });
};

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isFavorite, setIsFavorite] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const getProductDetails = async () => {
      try {
        const data = await fetchProductDetails(id);
        setProduct(data);
      } catch (error) {
        console.error("Failed to fetch product details:", error);
        setSnackbar({
          open: true,
          message: 'Failed to load product details',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    getProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    // Add to cart logic here
    setSnackbar({
      open: true,
      message: `Added ${quantity} item(s) to cart`,
      severity: 'success'
    });
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Container sx={{ py: 8 }}>
        <Typography variant="h4" component="h1">
          Product not found
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Product Images */}
        <Grid item xs={12} md={6}>
          <Paper elevation={2} sx={{ overflow: 'hidden', borderRadius: 2 }}>
            <Box sx={{ position: 'relative', paddingTop: '75%' }}>
              <img 
                src={product.images[selectedImage]}
                alt={product.name}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover'
                }}
              />
            </Box>
          </Paper>
          <Box sx={{ display: 'flex', gap: 2, mt: 2, justifyContent: 'center' }}>
            {product.images.map((image, index) => (
              <Box 
                key={index}
                component="img"
                src={image}
                alt={`${product.name} thumbnail ${index}`}
                sx={{
                  width: 80,
                  height: 80,
                  objectFit: 'cover',
                  cursor: 'pointer',
                  borderRadius: 1,
                  border: index === selectedImage ? '2px solid #1976d2' : '2px solid transparent'
                }}
                onClick={() => setSelectedImage(index)}
              />
            ))}
          </Box>
        </Grid>

        {/* Product Info */}
        <Grid item xs={12} md={6}>
          <Box sx={{ pl: { md: 4 } }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="h4" component="h1" gutterBottom>
                {product.name}
              </Typography>
              <Button 
                onClick={() => setIsFavorite(!isFavorite)}
                color="error"
                sx={{ minWidth: 'auto', p: 1 }}
              >
                {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
              </Button>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={product.rating} precision={0.5} readOnly />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({product.reviews} reviews)
              </Typography>
            </Box>

            <Typography variant="h5" color="primary" gutterBottom>
              ${product.price.toFixed(2)}
            </Typography>

            <Divider sx={{ my: 2 }} />

            <Typography variant="body1" paragraph>
              {product.description}
            </Typography>

            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2" gutterBottom>
                Categories:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {product.categories.map((category, index) => (
                  <Chip key={index} label={category} size="small" />
                ))}
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
              <Typography variant="body2" sx={{ mr: 2 }}>
                Quantity:
              </Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => quantity > 1 && setQuantity(quantity - 1)}
              >
                -
              </Button>
              <Typography sx={{ mx: 2 }}>{quantity}</Typography>
              <Button 
                variant="outlined" 
                size="small"
                onClick={() => quantity < product.stock && setQuantity(quantity + 1)}
              >
                +
              </Button>
              <Typography variant="body2" color="text.secondary" sx={{ ml: 2 }}>
                {product.stock} available
              </Typography>
            </Box>

            <Button 
              variant="contained" 
              color="primary" 
              size="large" 
              startIcon={<ShoppingCartIcon />}
              fullWidth
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              Add to Cart
            </Button>
          </Box>
        </Grid>
      </Grid>

      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={6000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetail;
