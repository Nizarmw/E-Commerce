import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Paper,
  Grid,
  Divider,
  IconButton,
  TextField,
  Card,
  CardMedia,
  Container,
  Snackbar,
  Alert,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Mock cart data - replace with actual state from Redux or context
const mockCartItems = [
  {
    id: 1,
    name: 'Product 1',
    image: 'https://via.placeholder.com/150',
    price: 100000,
    quantity: 2,
  },
  {
    id: 2,
    name: 'Product 2',
    image: 'https://via.placeholder.com/150',
    price: 200000,
    quantity: 1,
  },
];

const Cart = () => {
  const [cartItems, setCartItems] = React.useState(mockCartItems);
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [snackbarMessage, setSnackbarMessage] = React.useState('');
  const [snackbarSeverity, setSnackbarSeverity] = React.useState('success');
  
  const handleQuantityChange = (id, value) => {
    const newQuantity = Math.max(1, value);
    const updatedItems = cartItems.map(item => 
      item.id === id ? { ...item, quantity: newQuantity } : item
    );
    setCartItems(updatedItems);
    setSnackbarMessage('Cart updated');
    setSnackbarSeverity('success');
    setSnackbarOpen(true);
  };
  
  const handleRemoveItem = (id) => {
    const updatedItems = cartItems.filter(item => item.id !== id);
    setCartItems(updatedItems);
    setSnackbarMessage('Item removed from cart');
    setSnackbarSeverity('info');
    setSnackbarOpen(true);
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  // Calculate cart summary
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const shipping = subtotal > 0 ? 15000 : 0; // Example shipping logic
  const total = subtotal + shipping;
  
  // If cart is empty
  if (cartItems.length === 0) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
          <Box sx={{ py: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ShoppingCartIcon sx={{ fontSize: 60, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" gutterBottom>
              Your cart is empty
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Looks like you haven't added any products to your cart yet.
            </Typography>
            <Button
              variant="contained"
              component={RouterLink}
              to="/products"
              startIcon={<ArrowBackIcon />}
              sx={{ mt: 2 }}
            >
              Continue Shopping
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }
  
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Shopping Cart
      </Typography>
      
      <Grid container spacing={4}>
        {/* Cart Items */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: 2 }}>
            {cartItems.map((item) => (
              <Box key={item.id} sx={{ mb: 3 }}>
                <Grid container alignItems="center" spacing={2}>
                  {/* Product Image */}
                  <Grid item xs={3} sm={2}>
                    <Card sx={{ boxShadow: 'none' }}>
                      <CardMedia
                        component="img"
                        image={item.image}
                        alt={item.name}
                        sx={{ height: 70, objectFit: 'contain' }}
                      />
                    </Card>
                  </Grid>
                  
                  {/* Product Details */}
                  <Grid item xs={9} sm={4}>
                    <Typography variant="subtitle1" component={RouterLink} to={`/product/${item.id}`}
                      sx={{ textDecoration: 'none', color: 'inherit', fontWeight: 'medium' }}>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Rp{item.price.toLocaleString()}
                    </Typography>
                  </Grid>
                  
                  {/* Quantity Controls */}
                  <Grid item xs={6} sm={3}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <IconButton 
                        size="small" 
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <TextField
                        size="small"
                        value={item.quantity}
                        onChange={(e) => {
                          const value = parseInt(e.target.value);
                          if (!isNaN(value)) {
                            handleQuantityChange(item.id, value);
                          }
                        }}
                        inputProps={{ 
                          min: 1, 
                          style: { textAlign: 'center', width: '30px' } 
                        }}
                        sx={{ mx: 1 }}
                      />
                      <IconButton 
                        size="small" 
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </Grid>
                  
                  {/* Subtotal */}
                  <Grid item xs={4} sm={2} sx={{ textAlign: 'right' }}>
                    <Typography variant="subtitle2">
                      Rp{(item.price * item.quantity).toLocaleString()}
                    </Typography>
                  </Grid>
                  
                  {/* Remove Button */}
                  <Grid item xs={2} sm={1} sx={{ textAlign: 'right' }}>
                    <IconButton 
                      color="error" 
                      onClick={() => handleRemoveItem(item.id)}
                      size="small"
                    >
                      <DeleteOutlineIcon />
                    </IconButton>
                  </Grid>
                </Grid>
                <Divider sx={{ my: 2 }} />
              </Box>
            ))}
            
            <Box sx={{ textAlign: 'right' }}>
              <Button
                component={RouterLink}
                to="/products"
                startIcon={<ArrowBackIcon />}
                sx={{ mt: 2 }}
              >
                Continue Shopping
              </Button>
            </Box>
          </Paper>
        </Grid>
        
        {/* Order Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom>
              Order Summary
            </Typography>
            <Box sx={{ my: 2 }}>
              <Grid container spacing={1}>
                <Grid item xs={8}>
                  <Typography>Subtotal</Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'right' }}>
                  <Typography>Rp{subtotal.toLocaleString()}</Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography>Shipping</Typography>
                </Grid>
                <Grid item xs={4} sx={{ textAlign: 'right' }}>
                  <Typography>Rp{shipping.toLocaleString()}</Typography>
                </Grid>
              </Grid>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Grid container spacing={1}>
              <Grid item xs={8}>
                <Typography variant="h6">Total</Typography>
              </Grid>
              <Grid item xs={4} sx={{ textAlign: 'right' }}>
                <Typography variant="h6">Rp{total.toLocaleString()}</Typography>
              </Grid>
            </Grid>
            <Button
              variant="contained"
              fullWidth
              sx={{ mt: 3, mb: 1, py: 1.5 }}
              component={RouterLink}
              to="/checkout"
            >
              Proceed to Checkout
            </Button>
          </Paper>
        </Grid>
      </Grid>
      
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} variant="filled">
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Cart;
