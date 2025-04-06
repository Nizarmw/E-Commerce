import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Box, 
  Tab, 
  Tabs, 
  Paper, 
  Grid, 
  Chip, 
  Button, 
  Divider, 
  CircularProgress,
  Alert
} from '@mui/material';
import PublicLayout from '../../layouts/PublicLayout';
import { isAuthenticated } from '../../utils/auth';
import { getUserOrders } from '../../services/orders';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      alert('Please login to view your orders');
      navigate('/login', { state: { from: '/orders' } });
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const data = await getUserOrders();
        setOrders(data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status.toLowerCase() === activeTab;
  });

  // Get status color based on status
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'warning';
      case 'paid': return 'info';
      case 'shipped': return 'secondary';
      case 'completed': return 'success';
      case 'cancelled': return 'error';
      default: return 'default';
    }
  };

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  return (
    <PublicLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          My Orders
        </Typography>

        {/* Status tabs */}
        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs 
            value={activeTab} 
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All Orders" value="all" />
            <Tab label="Pending" value="pending" />
            <Tab label="Paid" value="paid" />
            <Tab label="Shipped" value="shipped" />
            <Tab label="Completed" value="completed" />
            <Tab label="Cancelled" value="cancelled" />
          </Tabs>
        </Box>

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        ) : filteredOrders.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'grey.50' }}>
            <Typography variant="h6" gutterBottom>
              No orders found
            </Typography>
            <Typography color="textSecondary" paragraph>
              {activeTab === 'all'
                ? "You haven't placed any orders yet."
                : `You don't have any ${activeTab} orders.`}
            </Typography>
            <Button 
              variant="contained" 
              color="primary"
              onClick={() => navigate('/')}
              sx={{ mt: 2 }}
            >
              Start Shopping
            </Button>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {filteredOrders.map((order) => (
              <Paper key={order.id} variant="outlined" sx={{ overflow: 'hidden' }}>
                <Box sx={{ p: 2, bgcolor: 'grey.50', borderBottom: 1, borderColor: 'divider' }}>
                  <Grid container justifyContent="space-between" alignItems="center">
                    <Grid item>
                      <Typography variant="body2" color="textSecondary">
                        Order ID: <Box component="span" sx={{ fontFamily: 'monospace' }}>{order.id}</Box>
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Date: {new Date(order.createdAt).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid item sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip 
                        label={order.status} 
                        color={getStatusColor(order.status)}
                        size="small"
                      />
                      <Button 
                        variant="text" 
                        color="primary"
                        size="small"
                        onClick={() => navigate(`/order/${order.id}`)}
                      >
                        View Details
                      </Button>
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ p: 2 }}>
                  {order.orderItems.map((item) => (
                    <Box 
                      key={item.id} 
                      sx={{ 
                        py: 1.5, 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: 2,
                        borderBottom: 1,
                        borderColor: 'divider',
                        '&:last-child': {
                          borderBottom: 0
                        }
                      }}
                    >
                      <Box 
                        sx={{ 
                          width: 64, 
                          height: 64, 
                          flexShrink: 0, 
                          bgcolor: 'grey.200', 
                          borderRadius: 1,
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
                            No img
                          </Box>
                        )}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2">
                          {item.product?.name || 'Product Unavailable'}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Qty: {item.quantity} × Rp {item.price.toLocaleString('id-ID')}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle2">
                          Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                        </Typography>
                      </Box>
                    </Box>
                  ))}

                  <Box sx={{ mt: 2, pt: 2, borderTop: 1, borderColor: 'divider', display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="subtitle1">Total</Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                      Rp {order.totalPrice.toLocaleString('id-ID')}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Container>
    </PublicLayout>
  );
};

export default OrderHistory;
