import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Button,
  Paper,
  Divider,
  useTheme,
  useMediaQuery
} from '@mui/material';
import Carousel from 'react-material-ui-carousel';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PaymentIcon from '@mui/icons-material/Payment';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AssignmentReturnIcon from '@mui/icons-material/AssignmentReturn';
import { useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';

const Home = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Mock data for featured products
  const featuredProducts = [
    {
      id: 1,
      name: 'Smartphone X',
      price: 799.99,
      image: 'https://via.placeholder.com/300',
      rating: 4.5,
      discount: 10,
      category: 'Electronics'
    },
    {
      id: 2,
      name: 'Wireless Headphones',
      price: 149.99,
      image: 'https://via.placeholder.com/300',
      rating: 4.2,
      discount: 0,
      category: 'Electronics'
    },
    {
      id: 3,
      name: 'Smart Watch',
      price: 299.99,
      image: 'https://via.placeholder.com/300',
      rating: 4.7,
      discount: 15,
      category: 'Electronics'
    },
    {
      id: 4,
      name: 'Laptop Pro',
      price: 1299.99,
      image: 'https://via.placeholder.com/300',
      rating: 4.8,
      discount: 5,
      category: 'Electronics'
    },
  ];

  // Slider items
  const carouselItems = [
    {
      image: 'https://via.placeholder.com/1200x400',
      title: 'Summer Collection',
      description: 'Discover our new summer collection with amazing discounts',
      buttonText: 'Shop Now',
      path: '/products'
    },
    {
      image: 'https://via.placeholder.com/1200x400',
      title: 'New Electronics',
      description: 'Check out the latest tech gadgets with special offers',
      buttonText: 'View Products',
      path: '/products'
    },
    {
      image: 'https://via.placeholder.com/1200x400',
      title: 'Limited Time Offer',
      description: 'Get up to 50% off on selected items',
      buttonText: 'Get Deals',
      path: '/products'
    }
  ];

  // Service features
  const features = [
    { icon: <LocalShippingIcon fontSize="large" />, title: 'Free Shipping', description: 'On orders over $50' },
    { icon: <PaymentIcon fontSize="large" />, title: 'Secure Payment', description: 'Safe & secured checkout' },
    { icon: <SupportAgentIcon fontSize="large" />, title: '24/7 Support', description: 'Dedicated support' },
    { icon: <AssignmentReturnIcon fontSize="large" />, title: 'Easy Returns', description: '30 days return policy' }
  ];

  return (
    <Box>
      {/* Hero Carousel */}
      <Carousel>
        {carouselItems.map((item, index) => (
          <Paper
            key={index}
            sx={{
              backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(${item.image})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              height: isMobile ? '50vh' : '70vh',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 0
            }}
          >
            <Box sx={{ textAlign: 'center', color: 'white', p: 3, maxWidth: '800px' }}>
              <Typography variant={isMobile ? 'h4' : 'h2'} component="h1" gutterBottom>
                {item.title}
              </Typography>
              <Typography variant="h6" sx={{ mb: 4 }}>
                {item.description}
              </Typography>
              <Button 
                variant="contained" 
                size="large" 
                onClick={() => navigate(item.path)}
                sx={{ minWidth: '150px' }}
              >
                {item.buttonText}
              </Button>
            </Box>
          </Paper>
        ))}
      </Carousel>

      {/* Service Features */}
      <Box sx={{ bgcolor: 'background.paper', py: 5 }}>
        <Container maxWidth="lg">
          <Grid container spacing={3}>
            {features.map((feature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Box sx={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center', 
                  textAlign: 'center',
                  p: 2
                }}>
                  <Box sx={{ color: 'primary.main', mb: 1 }}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom>{feature.title}</Typography>
                  <Typography variant="body2" color="text.secondary">{feature.description}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Featured Products */}
      <Container sx={{ py: 8 }} maxWidth="lg">
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Typography variant="h4" component="h2">
            Featured Products
          </Typography>
          <Button 
            endIcon={<ArrowForwardIcon />} 
            onClick={() => navigate('/products')}
          >
            View All
          </Button>
        </Box>
        
        <Grid container spacing={4}>
          {featuredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={3}>
              <ProductCard product={product} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Banner */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center'
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h4" gutterBottom>
            Special Discount For New Customers
          </Typography>
          <Typography variant="h6" sx={{ mb: 4 }}>
            Use code NEW10 to get 10% off your first order
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large"
            onClick={() => navigate('/products')}
          >
            Shop Now
          </Button>
        </Container>
      </Box>
    </Box>
  );
};

export default Home;
