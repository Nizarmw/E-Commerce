import React, { useState, useEffect } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Paper,
  Skeleton,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import ProductCard from '../components/ProductCard';
import axios from 'axios';

// Styled Hero Section
const HeroSection = styled(Paper)(({ theme }) => ({
  position: 'relative',
  backgroundColor: theme.palette.primary.main,
  color: theme.palette.primary.contrastText,
  padding: theme.spacing(8, 0),
  backgroundSize: 'cover',
  backgroundPosition: 'center',
  marginBottom: theme.spacing(4),
  borderRadius: 0,
  overflow: 'hidden',
  '&::before': {
    content: '""',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 1,
  },
}));

const HeroContent = styled(Box)(({ theme }) => ({
  position: 'relative',
  zIndex: 2,
}));

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Replace with your actual API endpoint
        const response = await axios.get(process.env.REACT_APP_API_URL + '/api/products');
        setProducts(response.data || []); // Use empty array as fallback
        setLoading(false);
      } catch (error) {
        console.error('Error fetching products:', error);
        setProducts([]); // Set empty array on error
        setLoading(false);
      }
    };
    
    fetchProducts();
    
    // Simulate loading for demo if needed
    // setTimeout(() => setLoading(false), 2000);
  }, []);
  
  // Featured products (first 8)
  const featuredProducts = products.slice(0, 8);
  
  return (
    <Box>
      {/* Hero Section */}
      <HeroSection
        sx={{
          backgroundImage: `url(https://source.unsplash.com/random/1600x900/?shopping)`,
        }}
      >
        <Container maxWidth="md">
          <HeroContent>
            <Typography
              component="h1"
              variant={isMobile ? 'h3' : 'h2'}
              align="center"
              color="inherit"
              gutterBottom
            >
              Shop the Latest Trends
            </Typography>
            <Typography variant={isMobile ? 'body1' : 'h5'} align="center" color="inherit" paragraph>
              Discover our collection of high-quality products at affordable prices
            </Typography>
            <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center' }}>
              <Button 
                variant="contained" 
                color="secondary" 
                size="large" 
                component={RouterLink} 
                to="/products"
                sx={{ px: 4, py: 1 }}
              >
                Shop Now
              </Button>
            </Box>
          </HeroContent>
        </Container>
      </HeroSection>
      
      <Container>
        {/* Featured Products Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Featured Products
          </Typography>
          <Grid container spacing={3}>
            {loading
              ? Array.from(new Array(8)).map((_, index) => (
                  <Grid item key={index} xs={12} sm={6} md={3}>
                    <ProductCard loading={true} />
                  </Grid>
                ))
              : featuredProducts.map((product) => (
                  <Grid item key={product.id} xs={12} sm={6} md={3}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
          </Grid>
          
          {!loading && featuredProducts.length === 0 && (
            <Box sx={{ py: 4, textAlign: 'center' }}>
              <Typography variant="h6" color="text.secondary">
                No products available at the moment.
              </Typography>
            </Box>
          )}
        </Box>
        
        <Divider sx={{ my: 6 }} />
        
        {/* Why Choose Us Section */}
        <Box sx={{ mb: 6 }}>
          <Typography variant="h4" component="h2" gutterBottom>
            Why Choose Us
          </Typography>
          <Grid container spacing={4} sx={{ mt: 2 }}>
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Fast Delivery
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  We deliver nationwide with reliable shipping partners to ensure your products arrive quickly and safely.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Secure Payment
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Multiple secure payment options including credit cards, bank transfers, and e-wallets.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper elevation={0} sx={{ p: 3, textAlign: 'center', height: '100%' }}>
                <Typography variant="h6" gutterBottom>
                  Quality Guarantee
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  All our products are quality checked and come with a satisfaction guarantee policy.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Home;
