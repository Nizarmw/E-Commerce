import React from 'react';
import { Box, Container, useMediaQuery, useTheme } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <Box component="main" sx={{ flexGrow: 1, py: { xs: 2, sm: 4 } }}>
        <Container maxWidth={isMobile ? 'sm' : 'lg'}>
          {children}
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
