import React from 'react';
import { Box, Typography } from '@mui/material';
import DashboardLayout from '../../../layouts/DashboardLayout';

const SellerSettings = () => {
  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Seller Settings
        </Typography>
        {/* Add your settings content here */}
      </Box>
    </DashboardLayout>
  );
};

export default SellerSettings;
