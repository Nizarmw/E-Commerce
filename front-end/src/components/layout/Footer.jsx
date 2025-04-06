import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';

const Footer = () => {
  return (
    <Box component="footer" sx={{ bgcolor: 'primary.main', color: 'white', py: 3, mt: 'auto' }}>
      <Container maxWidth="lg">
        <Typography variant="body2" align="center">
          © 2024 E-Commerce. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
