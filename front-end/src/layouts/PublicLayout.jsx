import React from 'react';
import { Box } from '@mui/material';
import Navbar from '../components/common/Navbar';
import Footer from '../components/layout/Footer';

const PublicLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navbar />
      <Box component="main" sx={{ flex: 1, py: 3 }}>
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default PublicLayout;
