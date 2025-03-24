import React from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Card,
  CardContent,
  Link
} from '@mui/material';
import { styled } from '@mui/material/styles';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import EmailIcon from '@mui/icons-material/Email';
import HomeIcon from '@mui/icons-material/Home';
import PrintIcon from '@mui/icons-material/Print';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';

const OrderItemList = styled(List)(({ theme }) => ({
  '& .MuiListItem-root': {
    padding: theme.spacing(1, 0),
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
  '& .MuiListItem-root:last-child': {
    borderBottom: 'none',
  },
}));

const InfoCard = styled(Card)(({ theme }) => ({
  height: '100%',
  transition: 'transform 0.2s ease-in-out',
  '&:hover': {
    transform: 'translateY(-5px)',
    boxShadow: theme.shadows[4],
  },
}));

// Sample order data
const order = {
  id: 'ORD-24680',
  date: 'May 15, 2023',
  estimatedDelivery: 'May 19-21, 2023',
  status: 'Processing',
  items: [
    {
      id: 1,
      name: 'Wireless Noise-Cancelling Headphones XM5',
      price: 349.99,
      quantity: 1,
    },
    {
      id: 2,
      name: 'Wireless Earbuds Pro',
      price: 179.99,
      quantity: 1,
    },
  ],
  shipping: {
    method: 'Standard Shipping (3-5 business days)',
    address: {
      name: 'John Doe',
      street: '123 Main St',
      city: 'Anytown',
      state: 'CA',
      zip: '12345',
      country: 'United States',
    },
  },
  payment: {
    method: 'Credit Card',
    last4: '1234',
  },
  subtotal: 529.98,
  shipping: 0,
  tax: 37.10,
  total: 567.08,
};

const OrderConfirmationPage = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* Order Confirmation Header */}
      <Box textAlign="center" mb={5}>
        <CheckCircleIcon 
          color="success" 
          sx={{ fontSize: 80, mb: 2 }} 
        />
        <Typography variant="h3" component="h1" gutterBottom>
          Thank You For Your Order!
        </Typography>
        <Typography variant="h6" color="text.secondary" mb={3}>
          Your order has been received and is being processed.
        </Typography>
        <Typography variant="body1">
          An email confirmation has been sent to <strong>your-email@example.com</strong>
        </Typography>
        <Chip 
          label={`Order #${order.id}`} 
          variant="outlined" 
          color="primary" 
          sx={{ mt: 2, fontWeight: 'bold' }} 
        />
      </Box>

      <Paper variant="outlined" sx={{ p: { xs: 2, md: 4 }, mb: 4 }}>
        <Grid container spacing={4}>
          {/* Order Details */}
          <Grid item xs={12} md={8}>
            <Typography variant="h5" component="h2" gutterBottom>
              Order Details
            </Typography>
            
            <Grid container spacing={3} sx={{ mb: 3 }}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Order Number
                </Typography>
                <Typography variant="body1" fontWeight="medium">
                  {order.id}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Order Date
                </Typography>
                <Typography variant="body1">
                  {order.date}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Payment Method
                </Typography>
                <Typography variant="body1">
                  {order.payment.method} (**** {order.payment.last4})
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                  Shipping Method
                </Typography>
                <Typography variant="body1">
                  {order.shipping.method}
                </Typography>
              </Grid>
            </Grid>

            <Divider sx={{ mb: 3 }} />

            <Typography variant="h6" gutterBottom>
              Items Ordered
            </Typography>
            <OrderItemList>
              {order.items.map((item) => (
                <ListItem key={item.id} disableGutters>
                  <Grid container spacing={2}>
                    <Grid item xs={8}>
                      <ListItemText
                        primary={item.name}
                        secondary={`Quantity: ${item.quantity}`}
                        primaryTypographyProps={{ fontWeight: 'medium' }}
                      />
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: 'right' }}>
                      <Typography variant="body1" fontWeight="medium">
                        ${(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Grid>
                  </Grid>
                </ListItem>
              ))}
            </OrderItemList>

            <Box bgcolor="action.hover" p={2} borderRadius={1} mt={3}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Shipping Address
                  </Typography>
                  <Typography variant="body2">
                    {order.shipping.address.name}<br />
                    {order.shipping.address.street}<br />
                    {order.shipping.address.city}, {order.shipping.address.state} {order.shipping.address.zip}<br />
                    {order.shipping.address.country}
                  </Typography>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    Estimated Delivery
                  </Typography>
                  <Typography variant="body2" fontWeight="medium">
                    {order.estimatedDelivery}
                  </Typography>
                  <Box display="flex" alignItems="center" mt={1}>
                    <LocalShippingIcon color="primary" fontSize="small" sx={{ mr: 1 }} />
                    <Typography variant="body2" color="text.secondary">
                      <Chip 
                        label={order.status} 
                        size="small" 
                        color="primary" 
                        variant="outlined" 
                      />
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <List disablePadding>
                <ListItem disableGutters sx={{ py: 1 }}>
                  <ListItemText primary="Subtotal" />
                  <Typography variant="body1">
                    ${order.subtotal.toFixed(2)}
                  </Typography>
                </ListItem>
                <ListItem disableGutters sx={{ py: 1 }}>
                  <ListItemText primary="Shipping" />
                  <Typography variant="body1">
                    {order.shipping === 0 ? 'Free' : `$${order.shipping.toFixed(2)}`}
                  </Typography>
                </ListItem>
                <ListItem disableGutters sx={{ py: 1 }}>
                  <ListItemText primary="Tax" />
                  <Typography variant="body1">
                    ${order.tax.toFixed(2)}
                  </Typography>
                </ListItem>
                <Divider sx={{ my: 1 }} />
                <ListItem disableGutters sx={{ py: 1 }}>
                  <ListItemText 
                    primary={<Typography variant="subtitle1" fontWeight="bold">Total</Typography>} 
                  />
                  <Typography variant="subtitle1" fontWeight="bold">
                    ${order.total.toFixed(2)}
                  </Typography>
                </ListItem>
              </List>

              <Button 
                variant="contained" 
                startIcon={<PrintIcon />} 
                fullWidth 
                sx={{ mt: 3 }}
              >
                Print Receipt
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Paper>

      {/* What's Next Section */}
      <Typography variant="h5" component="h2" gutterBottom>
        What's Next?
      </Typography>
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} md={4}>
          <InfoCard variant="outlined">
            <CardContent>
              <EmailIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Check Your Email
              </Typography>
              <Typography variant="body2" color="text.secondary">
                We've sent a confirmation email with all the details of your order. 
                You'll also receive updates about shipping and delivery.
              </Typography>
            </CardContent>
          </InfoCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <InfoCard variant="outlined">
            <CardContent>
              <ShoppingBagIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Track Your Order
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                You can track the status of your order at any time in your account dashboard.
              </Typography>
              <Link href="/account/orders" underline="always">
                View Order History
              </Link>
            </CardContent>
          </InfoCard>
        </Grid>
        <Grid item xs={12} md={4}>
          <InfoCard variant="outlined">
            <CardContent>
              <HomeIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h6" gutterBottom>
                Continue Shopping
              </Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                Explore more products in our store and discover special offers.
              </Typography>
              <Button 
                variant="outlined" 
                color="primary" 
                href="/" 
                sx={{ mt: 1 }}
              >
                Return to Homepage
              </Button>
            </CardContent>
          </InfoCard>
        </Grid>
      </Grid>

      {/* Customer Service */}
      <Paper 
        variant="outlined" 
        sx={{ 
          p: 3, 
          textAlign: 'center',
          bgcolor: 'primary.light',
          color: 'primary.contrastText'
        }}
      >
        <Typography variant="h6" gutterBottom>
          Need Help With Your Order?
        </Typography>
        <Typography variant="body1" mb={2}>
          Our customer service team is here to help 24/7.
        </Typography>
        <Button 
          variant="contained" 
          color="secondary" 
          href="/contact" 
          sx={{ mr: 2 }}
        >
          Contact Support
        </Button>
        <Button 
          variant="outlined" 
          color="inherit" 
          href="/faq"
        >
          View FAQs
        </Button>
      </Paper>
    </Container>
  );
};

export default OrderConfirmationPage;
