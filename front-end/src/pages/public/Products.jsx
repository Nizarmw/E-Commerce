import React from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardMedia, 
  CardContent, 
  CardActions,
  Button,
  Rating,
  Box,
  Chip,
} from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import PublicLayout from '../../layouts/PublicLayout';
import product1 from '../../assets/images/headphone.jpg';
import product2 from '../../assets/images/earbuds.jpg';
import product3 from '../../assets/images/smartwatch.jpg';
import { useSearchParams } from 'react-router-dom';

const Products = () => {
  const [searchParams] = useSearchParams();
  const category = searchParams.get('category');

  const products = [
    {
      id: 1,
      name: 'Premium Headphones',
      price: 'Rp 1.500.000',
      rating: 4.5,
      image: product1,
      isNew: true,
      discount: '20%'
    },
    {
      id: 2,
      name: 'Wireless Earbuds',
      price: 'Rp 800.000',
      rating: 4.2,
      image: product2,
      isNew: false,
      discount: null
    },
    {
      id: 3,
      name: 'Smart Watch',
      price: 'Rp 2.000.000',
      rating: 4.8,
      image: product3,
      isNew: true,
      discount: '15%'
    },
    // Add more products as needed
  ];

  // Filter products based on category if specified
  const filteredProducts = category 
    ? products.filter(product => product.category?.toLowerCase() === category)
    : products;

  return (
    <PublicLayout>
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
          {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Products` : 'All Products'}
        </Typography>
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
            <Grid item xs={12} sm={6} md={4} key={product.id}>
              <Card 
                sx={{ 
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 3,
                    transition: 'transform 0.3s ease-in-out'
                  }
                }}
              >
                {product.isNew && (
                  <Chip
                    label="NEW"
                    color="secondary"
                    size="small"
                    sx={{ 
                      position: 'absolute',
                      top: 16,
                      left: 16,
                      zIndex: 1
                    }}
                  />
                )}
                {product.discount && (
                  <Chip
                    label={`-${product.discount}`}
                    color="error"
                    size="small"
                    sx={{ 
                      position: 'absolute',
                      top: 16,
                      right: 16,
                      zIndex: 1
                    }}
                  />
                )}
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h2">
                    {product.name}
                  </Typography>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <Rating value={product.rating} precision={0.5} size="small" readOnly />
                    <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                      ({product.rating})
                    </Typography>
                  </Box>
                  <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                    {product.price}
                  </Typography>
                </CardContent>
                <CardActions sx={{ p: 2 }}>
                  <Button 
                    variant="contained" 
                    fullWidth 
                    startIcon={<ShoppingCartIcon />}
                    sx={{ mr: 1 }}
                  >
                    Add to Cart
                  </Button>
                  <Button 
                    variant="outlined"
                    sx={{ minWidth: 'auto' }}
                  >
                    <FavoriteIcon />
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </PublicLayout>
  );
};

export default Products;
