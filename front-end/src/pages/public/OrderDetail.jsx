import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PublicLayout from '../../layouts/PublicLayout';
import { isAuthenticated } from '../../utils/auth';
import { 
  getOrderById, 
  processOrderPayment, 
  cancelOrder, 
  completeOrder 
} from '../../services/orders';

const OrderDetail = () => {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      alert('Please login to view order details');
      navigate('/login', { state: { from: `/order/${id}` } });
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getOrderById(id);
        setOrder(data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return 'warning';
      case 'paid': return 'info';
      case 'shipped': return 'secondary';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  // Function to handle payment
  const handlePayment = async () => {
    try {
      const response = await processOrderPayment(id);
      
      // Redirect to payment gateway if provided
      if (response.paymentUrl) {
        window.location.href = response.paymentUrl;
      } else {
        // Otherwise refresh the order
        const updatedOrder = await getOrderById(id);
        setOrder(updatedOrder);
        alert('Payment process initiated. Please check your order status.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment processing failed. Please try again later.');
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }
    
    try {
      await cancelOrder(id);
      
      // Refresh order data
      const updatedOrder = await getOrderById(id);
      setOrder(updatedOrder);
      alert('Order has been cancelled.');
    } catch (err) {
      console.error('Cancel order error:', err);
      alert('Failed to cancel order. Please try again later.');
    }
  };

  const handleCompleteOrder = async () => {
    try {
      await completeOrder(id);
      
      // Refresh order data
      const updatedOrder = await getOrderById(id);
      setOrder(updatedOrder);
    } catch (err) {
      console.error('Complete order error:', err);
      alert('Failed to mark order as completed.');
    }
  };

  if (loading) {
    return (
      <PublicLayout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        </Container>
      </PublicLayout>
    );
  }

  if (error || !order) {
    return (
      <PublicLayout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Alert severity="error" sx={{ mb: 3 }}>
            {error || 'Order not found'}
          </Alert>
          <Button 
            component={Link} 
            to="/orders" 
            startIcon={<ArrowBackIcon />}
            variant="text"
            color="primary"
          >
            Back to Orders
          </Button>
        </Container>
      </PublicLayout>
    );
  }

  return (
    <PublicLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 3 }}>
          <Button 
            component={Link} 
            to="/orders" 
            startIcon={<ArrowBackIcon />}
            variant="text"
            color="primary"
          >
            Back to Orders
          </Button>
        </Box>
        
        <Paper variant="outlined" sx={{ overflow: 'hidden' }}>
          {/* Order Header */}
          <Box sx={{ p: 3, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
            <Grid container justifyContent="space-between" alignItems="center">
              <Grid item>
                <Typography variant="h4" gutterBottom>Order Details</Typography>
                <Typography variant="body2" color="textSecondary">
                  Order ID: <Box component="span" sx={{ fontFamily: 'monospace' }}>{order.id}</Box>
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  Date: {new Date(order.createdAt).toLocaleString()}
                </Typography>
              </Grid>
              <Grid item>
                <Chip 
                  label={order.status} 
                  color={getStatusColor(order.status)}
                  size="medium"
                />
              </Grid>
            </Grid>
          </Box>
          
          {/* Order Content */}
          <Box sx={{ p: 3 }}>
            {/* Order Items */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h6" gutterBottom>Items</Typography>
              <Divider sx={{ mb: 2 }} />
              
              {order.orderItems.map((item) => (
                <Box 
                  key={item.id}
                  sx={{ 
                    py: 2,
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    alignItems: { xs: 'flex-start', sm: 'center' },
                    borderBottom: 1,
                    borderColor: 'divider',
                    '&:last-child': { borderBottom: 0 }
                  }}
                >
                  <Box 
                    sx={{ 
                      width: { xs: '100%', sm: 96 },
                      height: 96,
                      flexShrink: 0,
                      bgcolor: 'grey.200',
                      borderRadius: 1,
                      mb: { xs: 2, sm: 0 },
                      overflow: 'hidden'
                    }}
                  >
                    {item.product?.imageUrl ? (
                      <Box 
                        component="img"
                        src={item.product.imageUrl}
                        alt={item.product.name}
                        sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                    ) : (
                      <Box sx={{ 
                        width: '100%', 
                        height: '100%', 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'center',
                        color: 'text.disabled'
                      }}>
                        No image
                      </Box>
                    )}
                  </Box>
                  
                  <Box sx={{ ml: { xs: 0, sm: 3 }, flexGrow: 1 }}>
                    <Button 
                      component={Link}
                      to={`/product/${item.productId}`}
                      variant="text"
                      color="primary"
                      sx={{ 
                        p: 0, 
                        textTransform: 'none',
                        justifyContent: 'flex-start',
                        fontWeight: 'medium',
                        fontSize: '1rem'
                      }}
                    >
                      {item.product?.name || 'Product Unavailable'}
                    </Button>
                    <Typography variant="body2" color="textSecondary">Qty: {item.quantity}</Typography>
                    <Typography variant="body2" color="textSecondary">
                      Price: Rp {item.price.toLocaleString('id-ID')}
                    </Typography>
                    <Typography variant="subtitle2" sx={{ mt: 1 }}>
                      Subtotal: Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            
            {/* Order Summary */}
            <Grid container spacing={4}>
              {/* Shipping Information */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Shipping Information</Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Typography variant="subtitle2">{order.shippingDetails?.fullName}</Typography>
                  <Typography variant="body2">{order.shippingDetails?.address}</Typography>
                  <Typography variant="body2">
                    {order.shippingDetails?.city}, {order.shippingDetails?.postalCode}
                  </Typography>
                  <Typography variant="body2">Phone: {order.shippingDetails?.phoneNumber}</Typography>
                </Paper>
              </Grid>
              
              {/* Payment Summary */}
              <Grid item xs={12} md={6}>
                <Typography variant="h6" gutterBottom>Order Summary</Typography>
                <Paper variant="outlined" sx={{ p: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Subtotal</Typography>
                    <Typography variant="body2">
                      Rp {(order.totalPrice * 0.9).toLocaleString('id-ID')}
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">Tax (10%)</Typography>
                    <Typography variant="body2">
                      Rp {(order.totalPrice * 0.1).toLocaleString('id-ID')}
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 1 }} />
                  <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1" fontWeight="bold">Total</Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Rp {order.totalPrice.toLocaleString('id-ID')}
                    </Typography>
                  </Box>
                </Paper>
                
                {/* Payment Actions */}
                <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
                  {order.status === 'pending' && (
                    <>
                      <Button
                        variant="contained"
                        color="success"
                        fullWidth
                        onClick={handlePayment}
                      >
                        Pay Now
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        fullWidth
                        onClick={handleCancelOrder}
                      >
                        Cancel Order
                      </Button>
                    </>
                  )}
                  
                  {order.status === 'shipped' && (
                    <Button
                      variant="contained"
                      color="primary"
                      fullWidth
                      onClick={handleCompleteOrder}
                    >
                      Mark as Received
                    </Button>
                  )}
                  
                  {(order.status === 'completed' || order.status === 'delivered') && (
                    <Button
                      variant="contained"
                      color="secondary"
                      fullWidth
                      component={Link}
                      to={`/review?orderId=${order.id}`}
                    >
                      Write a Review
                    </Button>
                  )}
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Paper>
      </Container>
    </PublicLayout>
  );
};

export default OrderDetail;
