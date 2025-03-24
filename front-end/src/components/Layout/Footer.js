import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Stack,
  IconButton,
  Button,
  Divider,
  TextField,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Facebook,
  Twitter,
  Instagram,
  YouTube,
  LinkedIn,
  Email
} from '@mui/icons-material';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const footerLinks = {
    'Shop': ['Products', 'Categories', 'Deals', 'New Arrivals', 'Popular Items'],
    'Customer Service': ['Contact Us', 'FAQs', 'Shipping Policy', 'Returns & Refunds', 'Track Order'],
    'Information': ['About Us', 'Blog', 'Privacy Policy', 'Terms & Conditions', 'Careers']
  };

  const socialIcons = [
    { icon: <Facebook />, name: 'Facebook', url: '#' },
    { icon: <Twitter />, name: 'Twitter', url: '#' },
    { icon: <Instagram />, name: 'Instagram', url: '#' },
    { icon: <YouTube />, name: 'YouTube', url: '#' },
    { icon: <LinkedIn />, name: 'LinkedIn', url: '#' }
  ];

  return (
    <Box
      component="footer"
      sx={{
        py: 6,
        px: 2,
        mt: 'auto',
        backgroundColor: theme.palette.grey[900],
        color: theme.palette.common.white
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Newsletter Subscription */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Subscribe to Our Newsletter
            </Typography>
            <Typography variant="body2" sx={{ mb: 2 }}>
              Stay updated with our latest offers and promotions.
            </Typography>
            <Stack direction="row" spacing={1}>
              <TextField
                variant="outlined"
                placeholder="Your Email"
                size="small"
                fullWidth
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.15)',
                    },
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                    },
                  },
                  '& .MuiInputBase-input': {
                    color: 'white',
                  },
                }}
              />
              <Button variant="contained" color="primary" endIcon={<Email />}>
                {isMobile ? '' : 'Subscribe'}
              </Button>
            </Stack>
          </Grid>

          {/* Footer Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <Grid item xs={12} sm={6} md={2.5} key={category}>
              <Typography variant="h6" gutterBottom>
                {category}
              </Typography>
              <Stack spacing={1}>
                {links.map(link => (
                  <Link
                    key={link}
                    component={RouterLink}
                    to={`/${link.toLowerCase().replace(/\s+/g, '-')}`}
                    color="inherit"
                    underline="hover"
                    sx={{ opacity: 0.8, '&:hover': { opacity: 1 } }}
                  >
                    {link}
                  </Link>
                ))}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4, backgroundColor: 'rgba(255, 255, 255, 0.2)' }} />

        <Grid container justifyContent="space-between" alignItems="center">
          <Grid item>
            <Typography variant="body2" sx={{ opacity: 0.7 }}>
              © {new Date().getFullYear()} E-Commerce. All rights reserved.
            </Typography>
          </Grid>
          <Grid item>
            <Stack direction="row" spacing={1}>
              {socialIcons.map((item) => (
                <IconButton
                  key={item.name}
                  component="a"
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${item.name} link`}
                  size="small"
                  sx={{ 
                    color: theme.palette.common.white,
                    '&:hover': { 
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                      transform: 'translateY(-2px)'
                    },
                    transition: 'transform 0.2s'
                  }}
                >
                  {item.icon}
                </IconButton>
              ))}
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default Footer;
