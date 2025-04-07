import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, CircularProgress, Grid } from '@mui/material';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { getUserInfo, refreshToken, isAuthenticated } from '../../../utils/auth';

const SellerDashboard = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check if user is authenticated
        if (!isAuthenticated()) {
          navigate('/login', { state: { from: '/dashboard/seller' } });
          return;
        }

        // Get user info and verify role
        const userInfo = getUserInfo();
        if (!userInfo || (userInfo.role !== 'seller' && userInfo.role !== 'admin')) {
          setError('Access denied. Seller privileges required.');
          navigate('/');
          return;
        }

        // Optional: Refresh token to ensure it's valid
        await refreshToken();
        
        setLoading(false);
      } catch (error) {
        console.error('Auth error:', error);
        navigate('/login', { state: { from: '/dashboard/seller' } });
      }
    };

    checkAuth();
  }, [navigate]);

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <Box sx={{ p: 3 }}>
          <Typography color="error">{error}</Typography>
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Seller Dashboard
        </Typography>
        <Grid container spacing={3}>
          {/* Add your seller dashboard content here */}
        </Grid>
      </Box>
    </DashboardLayout>
  );
};

export default SellerDashboard;
