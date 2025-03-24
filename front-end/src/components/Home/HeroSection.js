import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { 
  Box, 
  Container, 
  Typography, 
  Button, 
  Paper,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material';
import { ArrowForward } from '@mui/icons-material';

const HeroSection = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isMedium = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <Paper 
      elevation={0}
      sx={{
        position: 'relative',
        backgroundColor: 'grey.800',
        color: '#fff',
        mb: 4,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'center',
        backgroundImage: 'url(https://source.unsplash.com/random/1600x900/?shopping)',
        borderRadius: 2,
        overflow: 'hidden'
      }}
    >
      {/* Increase the priority of the hero background image */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          bottom: 0,
          right: 0,
          left: 0,
          backgroundColor: 'rgba(0,0,0,.5)',
        }}
      />
      <Grid container>
        <Grid item xs={12} md={6}>
          <Box
            sx={{
              position: 'relative',
              p: { xs: 3, md: 6 },
              pr: { md: 0 },
              height: { xs: '400px', md: '500px' },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center'
            }}
          >
            <Typography 
              component="h1" 
              variant={isMobile ? 'h4' : 'h3'} 
              color="inherit" 
              gutterBottom
              sx={{ 
                fontWeight: 700,
                textShadow: '1px 1px 4px rgba(0,0,0,0.5)'
              }}
            >
              Summer Collection 2023
            </Typography>
            <Typography 
              variant={isMobile ? 'body1' : 'h6'} 
              color="inherit" 
              paragraph
              sx={{ 
                maxWidth: 500,
                mb: 4,
                textShadow: '1px 1px 4px rgba(0,0,0,0.5)'
              }}
            >
              Discover the hottest trends for the summer season. Find exclusive deals on our latest collections.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
              <Button 
                variant="contained" 
                color="primary" 
                component={RouterLink} 
                to="/products"
                endIcon={<ArrowForward />}
                size={isMobile ? 'medium' : 'large'}
                sx={{ 
                  fontWeight: 'bold',
                  minWidth: '160px',
                  borderRadius: '50px',
                  py: { xs: 1, md: 1.5 }
                }}
              >
                Shop Now
              </Button>
              <Button 
                variant="outlined"
                component={RouterLink} 
                to="/categories"
                size={isMobile ? 'medium' : 'large'}
                sx={{ 
                  color: 'white', 
                  borderColor: 'white',
                  '&:hover': {
                    borderColor: 'white',
                    backgroundColor: 'rgba(255,255,255,0.1)'
                  },
                  borderRadius: '50px',
                  py: { xs: 1, md: 1.5 }
                }}
              >
                View Categories
              </Button>
            </Box>
          </Box>
        </Grid>
      </Grid>
    </Paper>
  );
};

export default HeroSection;
