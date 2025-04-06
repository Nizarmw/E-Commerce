import React from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Button,
  Divider,
  Avatar,
  TextField,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';  // Fix this import

const Cart = () => {
  // Mock data - replace with Redux state
  const [cartItems, setCartItems] = React.useState([
    {
      id: 1,
      name: 'Product 1',
      price: 1500000,
      quantity: 2,
      image: '/path/to/image1.jpg',
    },
    // Add more mock items as needed
  ]);

  const handleQuantityChange = (itemId, change) => {
    setCartItems(items =>
      items.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.max(1, item.quantity + change) }
          : item
      )
    );
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(items => items.filter(item => item.id !== itemId));
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const calculateTax = (subtotal) => subtotal * 0.11; // 11% tax
  const calculateTotal = (subtotal, tax) => subtotal + tax;

  const formatPrice = (price) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
    }).format(price);
  };

  return (
    <PublicLayout>
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Typography variant="h4" gutterBottom>
          Shopping Cart
        </Typography>

        {cartItems.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Your cart is empty
            </Typography>
            <Button
              component={Link}
              to="/"  // Change this from "/products" to "/"
              variant="contained"
              sx={{ mt: 2 }}
            >
              Continue Shopping
            </Button>
          </Box>
        ) : (
          <Grid container spacing={4}>
            {/* Cart Items */}
            <Grid item xs={12} md={8}>
              <Card>
                {cartItems.map((item, index) => (
                  <React.Fragment key={item.id}>
                    {index > 0 && <Divider />}
                    <CardContent>
                      <Grid container spacing={2} alignItems="center">
                        <Grid item>
                          <Avatar
                            src={item.image}
                            alt={item.name}
                            variant="rounded"
                            sx={{ width: 80, height: 80 }}
                          />
                        </Grid>
                        <Grid item xs>
                          <Typography variant="subtitle1">{item.name}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Price: {formatPrice(item.price)}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item.id, -1)}
                              disabled={item.quantity <= 1}
                            >
                              <RemoveIcon />
                            </IconButton>
                            <TextField
                              size="small"
                              value={item.quantity}
                              inputProps={{
                                readOnly: true,
                                style: { textAlign: 'center', width: '40px' }
                              }}
                            />
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(item.id, 1)}
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                        </Grid>
                        <Grid item xs={12} sm="auto">
                          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                            {formatPrice(item.price * item.quantity)}
                          </Typography>
                        </Grid>
                        <Grid item>
                          <IconButton
                            color="error"
                            onClick={() => handleRemoveItem(item.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </React.Fragment>
                ))}
              </Card>
            </Grid>

            {/* Order Summary */}
            <Grid item xs={12} md={4}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    Order Summary
                  </Typography>
                  <Box sx={{ my: 2 }}>
                    {cartItems.map(item => (
                      <Box
                        key={item.id}
                        sx={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          mb: 1
                        }}
                      >
                        <Typography variant="body2">
                          {item.name} x {item.quantity}
                        </Typography>
                        <Typography variant="body2">
                          {formatPrice(item.price * item.quantity)}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Subtotal</Typography>
                    <Typography>{formatPrice(calculateSubtotal())}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography>Tax (11%)</Typography>
                    <Typography>{formatPrice(calculateTax(calculateSubtotal()))}</Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography variant="h6">Total</Typography>
                    <Typography variant="h6">
                      {formatPrice(calculateTotal(
                        calculateSubtotal(),
                        calculateTax(calculateSubtotal())
                      ))}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    fullWidth
                    component={Link}
                    to="/checkout"
                  >
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </PublicLayout>
  );
};

export default Cart;
