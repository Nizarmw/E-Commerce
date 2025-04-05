import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Typography,
  Link,
  Divider,
  IconButton,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import FacebookIcon from '@mui/icons-material/Facebook';
import TwitterIcon from '@mui/icons-material/Twitter';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PhoneIcon from '@mui/icons-material/Phone';

const Footer = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  return (
    <Box
      sx={{
        bgcolor: 'background.paper',
        pt: 6,
        pb: 3,
        borderTop: '1px solid',
        borderColor: 'divider',
      }}
      component="footer"
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              E-SHOP
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              Your one-stop shop for all your shopping needs. Quality products at affordable prices.
            </Typography>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <IconButton size="small" color="primary" aria-label="facebook">
                <FacebookIcon />
              </IconButton>
              <IconButton size="small" color="primary" aria-label="twitter">
                <TwitterIcon />
              </IconButton>
              <IconButton size="small" color="primary" aria-label="instagram">
                <InstagramIcon />
              </IconButton>
              <IconButton size="small" color="primary" aria-label="linkedin">
                <LinkedInIcon />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Quick Links
            </Typography>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/" color="inherit" underline="hover">
                  Home
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/products" color="inherit" underline="hover">
                  Products
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/about" color="inherit" underline="hover">
                  About Us
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/contact" color="inherit" underline="hover">
                  Contact
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* Customer Service */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Customer Service
            </Typography>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/faq" color="inherit" underline="hover">
                  FAQ
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/shipping" color="inherit" underline="hover">
                  Shipping & Delivery
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/returns" color="inherit" underline="hover">
                  Returns & Refunds
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1 }}>
                <Link component={RouterLink} to="/privacy" color="inherit" underline="hover">
                  Privacy Policy
                </Link>
              </Box>
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Contact Us
            </Typography>
            <Box component="ul" sx={{ p: 0, m: 0, listStyle: 'none' }}>
              <Box component="li" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <LocationOnIcon sx={{ mr: 1, fontSize: '1rem', color: 'primary.main' }} />
                <Typography variant="body2">
                  123 Shopping Street, Jakarta, Indonesia
                </Typography>
              </Box>
              <Box component="li" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <EmailIcon sx={{ mr: 1, fontSize: '1rem', color: 'primary.main' }} />
                <Link href="mailto:info@eshop.com" color="inherit" underline="hover">
                  info@eshop.com
                </Link>
              </Box>
              <Box component="li" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                <PhoneIcon sx={{ mr: 1, fontSize: '1rem', color: 'primary.main' }} />
                <Link href="tel:+6287654321" color="inherit" underline="hover">
                  +62 8765 4321
                </Link>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ mt: 4, mb: 3 }} />
        
        <Box sx={{ display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: isMobile ? 'center' : 'flex-start' }}>
          <Typography variant="body2" color="text.secondary" align={isMobile ? 'center' : 'left'}>
            © {new Date().getFullYear()} E-SHOP. All rights reserved.
          </Typography>
          {!isMobile && (
            <Typography variant="body2" color="text.secondary">
              Designed with ❤️ by DevSec Team
            </Typography>
          )}
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
