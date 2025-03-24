import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Button,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemText
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';

const OrderConfirmation = () => {
  const location = useLocation();
  const orderId = location.state?.orderId || 'ORD-123456';
  
  // Mock order data - in a real app, you would fetch this based on the orderId
  const orderData = {
    id: orderId,
    date: new Date().toLocaleDateString(),
    total: 542.97,
    payment: 'Credit Card (ending in 1234)',
    shipping: {
      address: '123 Main St, Apt 4B',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      country: 'United States'
    },
    items: [
      {
        id: 1,
        name: 'Premium Wireless Headphones',
        price: 129.99,
        quantity: 1
      },
      {
        id: 2,
        name: 'Smart Watch Series 5',
        price: 199.99,
        quantity: 2
      }
    ],
    estimatedDelivery: '3-5 business days'
  };

  const calculateSubtotal = () => {
    return orderData.items.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  return (
    <Container maxWidth="md" sx={{ py: 8 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <CheckCircleOutlineIcon color="success" sx={{ fontSize: 64, mb: 2 }} />
          <Typography variant="h4" component="h1" gutterBottom>
            Thank You for Your Order!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Your order has been placed and is being processed. You will receive an email confirmation shortly.
          </Typography>
        </Box>

        <Box sx={{ bgcolor: 'background.default', p: 2, borderRadius: 1, mb: 4 }}>
          <Typography variant="subtitle1" gutterBottom>
            Order Number: <strong>{orderData.id}</strong>
          </Typography>
          <Typography variant="subtitle1">
            Order Date: <strong>{orderData.date}</strong>
          </Typography>
        </Box>

        <Typography variant="h6" gutterBottom>
          Order Details
        </Typography>
        <Divider sx={{ mb: 2 }} />

        <List disablePadding>
          {orderData.items.map((item) => (
            <ListItem key={item.id} sx={{ py: 1, px: 0 }}>
              <ListItemText
                primary={item.name}
                secondary={`Quantity: ${item.quantity}`}
              />
              <Typography variant="body2">
                ${(item.price * item.quantity).toFixed(2)}
              </Typography>
            </ListItem>
          ))}
          <Divider sx={{ my: 2 }} />
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Subtotal" />
            <Typography variant="body1">
              ${calculateSubtotal().toFixed(2)}
            </Typography>
          </ListItem>
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Shipping & Handling" />
            <Typography variant="body1">
              $12.99
            </Typography>
          </ListItem>
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Tax" />
            <Typography variant="body1">
              ${(calculateSubtotal() * 0.1).toFixed(2)}
            </Typography>
          </ListItem>
          <ListItem sx={{ py: 1, px: 0 }}>
            <ListItemText primary="Total" />
            <Typography variant="h6">
              ${orderData.total.toFixed(2)}
            </Typography>
          </ListItem>
        </List>

        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Shipping Information
            </Typography>
            <Typography gutterBottom>{orderData.shipping.address}</Typography>
            <Typography gutterBottom>
              {orderData.shipping.city}, {orderData.shipping.state} {orderData.shipping.zipCode}
            </Typography>
            <Typography gutterBottom>{orderData.shipping.country}</Typography>
            <Typography variant="subtitle2" sx={{ mt: 1 }}>
              Estimated Delivery: {orderData.estimatedDelivery}
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Typography variant="h6" gutterBottom>
              Payment Information
            </Typography>
            <Typography gutterBottom>{orderData.payment}</Typography>
            <Typography gutterBottom>Billing address: Same as shipping</Typography>
          </Grid>
        </Grid>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Button 
            component={Link} 
            to="/"
            variant="contained" 
            color="primary" 
            sx={{ mx: 1 }}
          >
            Continue Shopping
          </Button>
          <Button 
            component={Link} 
            to="/account/orders"
            variant="outlined" 
            sx={{ mx: 1 }}
          >
            View My Orders
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

export default OrderConfirmation;
