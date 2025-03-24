import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Paper,
  TextField,
  Button,
  Avatar,
  Divider,
  Tabs,
  Tab,
  List,
  ListItem,
  ListItemText,
  Card,
  CardContent,
  CircularProgress,
  Snackbar,
  Alert,
  IconButton
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import PersonIcon from '@mui/icons-material/Person';
import FavoriteIcon from '@mui/icons-material/Favorite';
import SecurityIcon from '@mui/icons-material/Security';
import { styled } from '@mui/material/styles';

// Mock user data - replace with your actual user data from auth state
const fetchUserData = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        id: 'user123',
        firstName: 'John',
        lastName: 'Doe',
        email: 'john.doe@example.com',
        phone: '(123) 456-7890',
        address: {
          street: '123 Main St',
          city: 'New York',
          state: 'NY',
          zipCode: '10001',
          country: 'United States'
        },
        profileImage: 'https://source.unsplash.com/random/150x150/?person',
        joinDate: '2023-01-15'
      });
    }, 1000);
  });
};

// Mock orders data - replace with your actual API call
const fetchOrders = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 'ORD-123456',
          date: '2023-05-10',
          total: 329.97,
          status: 'Delivered',
          items: 3
        },
        {
          id: 'ORD-789012',
          date: '2023-04-22',
          total: 129.99,
          status: 'Processing',
          items: 1
        },
        {
          id: 'ORD-345678',
          date: '2023-03-15',
          total: 249.98,
          status: 'Delivered',
          items: 2
        }
      ]);
    }, 800);
  });
};

// Mock wishlist data - replace with your actual API call
const fetchWishlist = () => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        {
          id: 1,
          name: 'Premium Wireless Headphones',
          price: 129.99,
          image: 'https://source.unsplash.com/random/100x100/?headphones'
        },
        {
          id: 2,
          name: 'Smart Watch Series 5',
          price: 199.99,
          image: 'https://source.unsplash.com/random/100x100/?smartwatch'
        },
        {
          id: 3,
          name: 'Bluetooth Portable Speaker',
          price: 79.99,
          image: 'https://source.unsplash.com/random/100x100/?speaker'
        }
      ]);
    }, 800);
  });
};

const Input = styled('input')({
  display: 'none',
});

const TabPanel = (props) => {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
};

const Profile = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [wishlist, setWishlist] = useState([]);
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await fetchUserData();
        setUser(userData);
        setFormData(userData);
        
        const ordersData = await fetchOrders();
        setOrders(ordersData);
        
        const wishlistData = await fetchWishlist();
        setWishlist(wishlistData);
      } catch (error) {
        console.error("Failed to load user data:", error);
        setSnackbar({
          open: true,
          message: 'Failed to load user data',
          severity: 'error'
        });
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSave = async () => {
    setLoading(true);
    
    try {
      // Simulate API call to update user
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setUser(formData);
      setEditMode(false);
      setSnackbar({
        open: true,
        message: 'Profile updated successfully!',
        severity: 'success'
      });
    } catch (error) {
      console.error("Failed to update profile:", error);
      setSnackbar({
        open: true,
        message: 'Failed to update profile',
        severity: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(user);
    setEditMode(false);
  };

  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  if (loading && !user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* Profile Information */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Box sx={{ position: 'relative', display: 'inline-block' }}>
              <Avatar
                src={user?.profileImage}
                sx={{ width: 120, height: 120, mx: 'auto', mb: 2 }}
              />
              {editMode && (
                <label htmlFor="icon-button-file">
                  <Input accept="image/*" id="icon-button-file" type="file" />
                  <IconButton
                    aria-label="upload picture"
                    component="span"
                    sx={{
                      position: 'absolute',
                      bottom: 0,
                      right: 0,
                      bgcolor: 'primary.main',
                      color: 'white',
                      '&:hover': {
                        bgcolor: 'primary.dark',
                      },
                    }}
                  >
                    <PhotoCameraIcon />
                  </IconButton>
                </label>
              )}
            </Box>
            <Typography variant="h5" gutterBottom>
              {user?.firstName} {user?.lastName}
            </Typography>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Member since {new Date(user?.joinDate).toLocaleDateString()}
            </Typography>
            
            {!editMode ? (
              <Button
                startIcon={<EditIcon />}
                variant="outlined"
                onClick={() => setEditMode(true)}
                sx={{ mt: 2 }}
              >
                Edit Profile
              </Button>
            ) : (
              <Box sx={{ mt: 2 }}>
                <Button
                  startIcon={<SaveIcon />}
                  variant="contained"
                  onClick={handleSave}
                  sx={{ mr: 1 }}
                  disabled={loading}
                >
                  Save
                </Button>
                <Button
                  startIcon={<CancelIcon />}
                  variant="outlined"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
              </Box>
            )}
          </Paper>
        </Grid>
        
        {/* Tabs for different sections */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Tabs 
              value={tabValue} 
              onChange={handleTabChange} 
              variant="scrollable"
              scrollButtons="auto"
              sx={{ borderBottom: 1, borderColor: 'divider' }}
            >
              <Tab icon={<PersonIcon />} label="Personal Info" />
              <Tab icon={<ShoppingBagIcon />} label="Orders" />
              <Tab icon={<FavoriteIcon />} label="Wishlist" />
              <Tab icon={<SecurityIcon />} label="Security" />
            </Tabs>
            
            {/* Personal Info Tab */}
            <TabPanel value={tabValue} index={0}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName || ''}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName || ''}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={formData.email || ''}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    value={formData.phone || ''}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12}>
                  <Divider sx={{ my: 2 }} />
                  <Typography variant="h6" gutterBottom>
                    Address Information
                  </Typography>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Street Address"
                    name="address.street"
                    value={formData.address?.street || ''}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="City"
                    name="address.city"
                    value={formData.address?.city || ''}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="State/Province"
                    name="address.state"
                    value={formData.address?.state || ''}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Zip/Postal Code"
                    name="address.zipCode"
                    value={formData.address?.zipCode || ''}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Country"
                    name="address.country"
                    value={formData.address?.country || ''}
                    onChange={handleInputChange}
                    disabled={!editMode}
                  />
                </Grid>
              </Grid>
            </TabPanel>
            
            {/* Orders Tab */}
            <TabPanel value={tabValue} index={1}>
              {orders.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <Typography variant="body1">You haven't placed any orders yet.</Typography>
                </Box>
              ) : (
                <List>
                  {orders.map((order) => (
                    <Paper key={order.id} sx={{ mb: 2, p: 2 }}>
                      <Grid container alignItems="center">
                        <Grid item xs={12} sm={6}>
                          <Typography variant="subtitle1">{order.id}</Typography>
                          <Typography variant="body2" color="text.secondary">
                            Placed on {new Date(order.date).toLocaleDateString()}
                          </Typography>
                          <Typography variant="body2">
                            {order.items} {order.items === 1 ? 'item' : 'items'}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3}>
                          <Typography variant="subtitle1">${order.total.toFixed(2)}</Typography>
                          <Typography 
                            variant="body2"
                            sx={{ 
                              color: order.status === 'Delivered' ? 'success.main' : 'info.main'
                            }}
                          >
                            {order.status}
                          </Typography>
                        </Grid>
                        <Grid item xs={12} sm={3} sx={{ textAlign: 'right' }}>
                          <Button variant="outlined" size="small">
                            View Details
                          </Button>
                        </Grid>
                      </Grid>
                    </Paper>
                  ))}
                </List>
              )}
            </TabPanel>
            
            {/* Wishlist Tab */}
            <TabPanel value={tabValue} index={2}>
              {wishlist.length === 0 ? (
                <Box textAlign="center" py={4}>
                  <Typography variant="body1">Your wishlist is empty.</Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {wishlist.map((item) => (
                    <Grid item xs={12} sm={6} md={4} key={item.id}>
                      <Card>
                        <Box sx={{ display: 'flex', p: 2 }}>
                          <Box sx={{ pr: 2 }}>
                            <img 
                              src={item.image} 
                              alt={item.name} 
                              style={{ width: 80, height: 80, objectFit: 'cover' }}
                            />
                          </Box>
                          <CardContent sx={{ flex: '1 0 auto', p: 0 }}>
                            <Typography variant="subtitle1" component="div" noWrap>
                              {item.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              ${item.price.toFixed(2)}
                            </Typography>
                            <Box sx={{ mt: 1 }}>
                              <Button size="small" variant="outlined">
                                Add to Cart
                              </Button>
                            </Box>
                          </CardContent>
                        </Box>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </TabPanel>
            
            {/* Security Tab */}
            <TabPanel value={tabValue} index={3}>
              <Box sx={{ maxWidth: 600, mx: 'auto' }}>
                <Typography variant="h6" gutterBottom>
                  Change Password
                </Typography>
                <TextField
                  fullWidth
                  margin="normal"
                  type="password"
                  label="Current Password"
                />
                <TextField
                  fullWidth
                  margin="normal"
                  type="password"
                  label="New Password"
                />
                <TextField
                  fullWidth
                  margin="normal"
                  type="password"
                  label="Confirm New Password"
                />
                <Button 
                  variant="contained" 
                  color="primary" 
                  sx={{ mt: 2 }}
                >
                  Update Password
                </Button>
                
                <Divider sx={{ my: 4 }} />
                
                <Typography variant="h6" gutterBottom>
                  Two-Factor Authentication
                </Typography>
                <Typography variant="body2" paragraph>
                  Add an extra layer of security to your account by enabling two-factor authentication.
                </Typography>
                <Button 
                  variant="outlined" 
                  color="primary"
                >
                  Enable 2FA
                </Button>
              </Box>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
      
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default Profile;
