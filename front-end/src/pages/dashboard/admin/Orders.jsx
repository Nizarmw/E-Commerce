import React from 'react';
import { Box, Typography } from '@mui/material';
import DashboardLayout from '../../../layouts/DashboardLayout';

const AdminOrders = () => {
  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Manage Orders
        </Typography>
        {/* Add order management functionality here */}
      </Box>
    </DashboardLayout>
  );
};

export default AdminOrders;
