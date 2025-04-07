import React, { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  Box, 
  Rating, 
  Stack,
  Chip,
  Divider,
  Paper,
  useTheme,
  alpha,
  Skeleton
} from '@mui/material';
import { useNavigate, Link } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import SecurityIcon from '@mui/icons-material/Security';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import { getAllProducts } from '../../services/products';
import { getUserInfo } from '../../utils/auth';

// Import images from assets folder
import product1 from '../../assets/images/headphone.jpg';
import product2 from '../../assets/images/smartwatch.jpg';
import product3 from '../../assets/images/earbuds.jpg';
import heroImage from '../../assets/images/shoes.jpg';

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const userInfo = getUserInfo();
  const isSeller = userInfo?.role === 'seller';
  
  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Use the product service
        const response = await getAllProducts();
        setProducts(response);
      } catch (error) {
        console.error('Error fetching products:', error);
        // Use mock data as fallback if API fails
        setProducts([
          { 
            id: 1, 
            name: 'Premium Headphones', 
            price: 99.99, 
            rating: 4.5, 
            image: product1,
            isNew: true,
            discount: '20%'
          },
          { 
            id: 2, 
            name: 'Smart Watch Series X', 
            price: 149.99, 
            rating: 4.8,
            image: product2,
            isNew: false,
            discount: null
          },
          { 
            id: 3, 
            name: 'Wireless Earbuds Pro', 
            price: 199.99, 
            rating: 4.2,
            image: product3,
            isNew: true,
            discount: '15%'
          },
        ]);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, []);
  
  // Use existing categories
  const categories = [
    { id: 1, name: 'Electronics', icon: '🖥️' },
    { id: 2, name: 'Clothing', icon: '👕' },
    { id: 3, name: 'Home & Garden', icon: '🏡' },
    { id: 4, name: 'Sports', icon: '⚽' },
  ];

  const handleShopNow = () => {
    navigate('/products');
  };

  const handleCategoryClick = (categoryName) => {
    navigate(`/products?category=${categoryName.toLowerCase()}`);
  };

  // Either use API data or fallback to mock data
  const featuredProducts = products.slice(0, 3);

  return (
    <PublicLayout>
      <Container maxWidth="lg">
        {isSeller && (
          <Paper sx={{ p: 3, mb: 4, mt: 2, bgcolor: 'primary.light' }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={8}>
                <Typography variant="h5" component="h2" gutterBottom>
                  Welcome back, {userInfo.full_name || userInfo.name || 'Seller'}!
                </Typography>
                <Typography variant="body1" paragraph>
                  Manage your products and orders through your seller dashboard.
                </Typography>
              </Grid>
              <Grid item xs={12} md={4} sx={{ textAlign: { md: 'right' } }}>
                <Button
                  component={Link}
                  to="/dashboard/seller"
                  variant="contained"
                  color="primary"
                  size="large"
                >
                  Go to Seller Dashboard
                </Button>
              </Grid>
            </Grid>
          </Paper>
        )}

        {/* Hero Section */}
        <Box 
          sx={{ 
            backgroundImage: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            py: 8,
            mb: 6
          }}
        >
          {/* ...existing Hero section code... */}
          <Container maxWidth="lg">
            <Grid container spacing={4} alignItems="center">
              <Grid item xs={12} md={6}>
                <Typography variant="h2" component="h1" gutterBottom fontWeight="bold">
                  Welcome to E-Commerce
                </Typography>
                <Typography variant="h5" sx={{ mb: 4, opacity: 0.8 }}>
                  Discover amazing products at unbeatable prices
                </Typography>
                <Button 
                  variant="contained" 
                  size="large"
                  onClick={handleShopNow}
                  sx={{ 
                    bgcolor: 'white', 
                    color: 'primary.main',
                    '&:hover': { bgcolor: alpha('#ffffff', 0.9) },
                    px: 4,
                    py: 1.5,
                    borderRadius: 2,
                    boxShadow: 3
                  }}
                >
                  Shop Now
                </Button>
              </Grid>
              <Grid item xs={12} md={6}>
                <Paper 
                  elevation={6} 
                  sx={{ 
                    p: 2, 
                    bgcolor: alpha('#ffffff', 0.1),
                    borderRadius: 4,
                    overflow: 'hidden'
                  }}
                >
                  <Box 
                    component="img" 
                    src={heroImage} 
                    alt="New Arrivals"
                    sx={{ 
                      width: '100%', 
                      height: 'auto',
                      borderRadius: 3,
                      transition: 'transform 0.3s',
                      '&:hover': {
                        transform: 'scale(1.02)'
                      }
                    }}
                  />
                </Paper>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Categories */}
        <Container maxWidth="lg">
          {/* ...existing Categories section code... */}
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            align="center" 
            fontWeight="medium"
            sx={{ mb: 4 }}
          >
            Shop by Category
          </Typography>
          <Grid container spacing={3} justifyContent="center" sx={{ mb: 8 }}>
            {categories.map((category) => (
              <Grid item xs={6} sm={3} key={category.id}>
                <Paper 
                  elevation={2} 
                  onClick={() => handleCategoryClick(category.name)}
                  sx={{ 
                    p: 3, 
                    textAlign: 'center',
                    borderRadius: 3,
                    transition: 'all 0.3s',
                    '&:hover': {
                      transform: 'translateY(-5px)',
                      boxShadow: 8,
                      cursor: 'pointer'
                    }
                  }}
                >
                  <Typography variant="h3" sx={{ mb: 1 }}>
                    {category.icon}
                  </Typography>
                  <Typography variant="h6">
                    {category.name}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>

          {/* Featured Products */}
          <Typography 
            variant="h4" 
            component="h2" 
            gutterBottom 
            sx={{ 
              mb: 1,
              fontWeight: 'medium',
              position: 'relative',
              display: 'inline-block'
            }}
          >
            Featured Products
            <Box 
              sx={{ 
                position: 'absolute',
                bottom: 0,
                left: 0,
                width: '60%',
                height: '4px',
                bgcolor: 'primary.main',
                borderRadius: 2
              }} 
            />
          </Typography>

          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ mb: 4 }}
          >
            Explore our selection of top products
          </Typography>

          <Grid container spacing={4} sx={{ mb: 8 }}>
            {loading ? (
              // Show skeletons while loading
              Array(3).fill().map((_, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column'
                    }}
                  >
                    <Skeleton variant="rectangular" height={220} />
                    <CardContent>
                      <Skeleton variant="text" height={30} width="80%" />
                      <Skeleton variant="text" height={20} width="50%" />
                      <Skeleton variant="text" height={40} width="40%" />
                      <Box sx={{ mt: 2 }}>
                        <Skeleton variant="rectangular" height={40} />
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              // Show actual products
              featuredProducts.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product.id}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      transition: 'transform 0.3s, box-shadow 0.3s',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: 6
                      },
                      borderRadius: 3,
                      overflow: 'hidden',
                      position: 'relative'
                    }}
                  >
                    {/* ...existing product card content... */}
                    {product.isNew && (
                      <Chip 
                        label="NEW" 
                        color="secondary" 
                        size="small"
                        sx={{ 
                          position: 'absolute', 
                          top: 16, 
                          left: 16,
                          fontWeight: 'bold'
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
                          fontWeight: 'bold'
                        }} 
                      />
                    )}
                    <Box sx={{ position: 'relative' }}>
                      <CardMedia
                        component="img"
                        height="220"
                        image={product.image_url || `https://via.placeholder.com/300x200?text=${product.name}`}
                        alt={product.name}
                        sx={{
                          transition: 'transform 0.5s',
                          '&:hover': {
                            transform: 'scale(1.05)'
                          }
                        }}
                      />
                      <Box 
                        sx={{
                          position: 'absolute',
                          bottom: 0,
                          right: 0,
                          bgcolor: 'rgba(0,0,0,0.6)',
                          borderTopLeftRadius: 12,
                          p: 1
                        }}
                      >
                        <Button 
                          size="small" 
                          sx={{ minWidth: 0, color: 'white' }}
                        >
                          <FavoriteIcon />
                        </Button>
                      </Box>
                    </Box>
                    <CardContent sx={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h6" component="div" fontWeight="medium">
                        {product.name}
                      </Typography>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Rating value={product.rating || 0} precision={0.5} size="small" readOnly />
                        <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                          ({product.rating || 0})
                        </Typography>
                      </Box>
                      <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                        ${product.price?.toFixed(2) || '0.00'}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Button 
                          variant="contained" 
                          color="primary" 
                          fullWidth
                          startIcon={<ShoppingCartIcon />}
                          onClick={() => navigate('/cart')}  // Add this
                          sx={{ 
                            borderRadius: 2,
                            textTransform: 'none',
                            fontWeight: 'medium'
                          }}
                        >
                          Add to Cart
                        </Button>
                        <Button 
                          variant="outlined" 
                          sx={{ 
                            borderRadius: 2,
                            textTransform: 'none'
                          }}
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          Details
                        </Button>
                      </Stack>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            )}
          </Grid>

          {/* Benefits Section */}
          <Box sx={{ my: 8 }}>
            {/* ...existing Benefits section code... */}
            <Divider sx={{ mb: 8 }} />
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Stack alignItems="center" spacing={2}>
                  <LocalShippingIcon color="primary" sx={{ fontSize: 48 }} />
                  <Typography variant="h6" fontWeight="medium">Free Shipping</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    On all orders above $50
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack alignItems="center" spacing={2}>
                  <SecurityIcon color="primary" sx={{ fontSize: 48 }} />
                  <Typography variant="h6" fontWeight="medium">Secure Payment</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    100% secure payment methods
                  </Typography>
                </Stack>
              </Grid>
              <Grid item xs={12} md={4}>
                <Stack alignItems="center" spacing={2}>
                  <SupportAgentIcon color="primary" sx={{ fontSize: 48 }} />
                  <Typography variant="h6" fontWeight="medium">24/7 Support</Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    Dedicated support team
                  </Typography>
                </Stack>
              </Grid>
            </Grid>
            <Divider sx={{ mt: 8 }} />
          </Box>
        </Container>
      </Container>
    </PublicLayout>
  );
};

export default Home;