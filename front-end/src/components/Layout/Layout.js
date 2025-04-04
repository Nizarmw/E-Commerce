import React from 'react';
import { Box, Container } from '@mui/material';
import Header from '../Navbar'; // Remove .jsx extension if file doesn't exist
import Footer from '../Footer'; // Remove .js extension if file doesn't exist

const Layout = ({ children }) => {
  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column', 
      minHeight: '100vh'
    }}>
      <Header />
      <Box component="main" sx={{ 
        flexGrow: 1, 
        py: 3,
        backgroundColor: (theme) => theme.palette.background.default
      }}>
        <Container maxWidth="lg">
          {children}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
