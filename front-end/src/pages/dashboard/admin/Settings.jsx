import React from 'react';
import { Box, Typography } from '@mui/material';
import DashboardLayout from '../../../layouts/DashboardLayout';

const AdminSettings = () => {
  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Admin Settings
        </Typography>
        {/* Add settings functionality here */}
      </Box>
    </DashboardLayout>
  );
};

export default AdminSettings;
