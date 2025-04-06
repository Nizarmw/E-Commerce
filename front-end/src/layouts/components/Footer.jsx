import React from 'react';
import { Box, Container, Grid, Typography, Link, Divider } from '@mui/material';

const Footer = () => {
  const footerLinks = {
    'About Us': ['Company', 'Team', 'Career'],
    'Customer Service': ['Help Center', 'Returns', 'Shipping'],
    'Legal': ['Terms of Service', 'Privacy Policy', 'Security'],
  };

  return (
    <Box component="footer" sx={{ bgcolor: 'background.paper', py: { xs: 4, md: 6 } }}>
      <Container maxWidth="lg">
        <Grid container spacing={{ xs: 2, md: 4 }} justifyContent="space-between">
          {Object.entries(footerLinks).map(([category, links]) => (
            <Grid item xs={12} sm={6} md={4} key={category}>
              <Typography 
                variant="h6" 
                color="text.primary" 
                gutterBottom
                sx={{ fontSize: { xs: '1rem', sm: '1.25rem' } }}
              >
                {category}
              </Typography>
              {links.map((link) => (
                <Link
                  key={link}
                  href="#"
                  color="text.secondary"
                  display="block"
                  sx={{ mb: 1 }}
                >
                  {link}
                </Link>
              ))}
            </Grid>
          ))}
        </Grid>
        <Divider sx={{ my: 4 }} />
        <Typography variant="body2" color="text.secondary" align="center">
          © {new Date().getFullYear()} E-Commerce. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;
