import React from 'react';
import { Box, Typography, Divider, useTheme } from '@mui/material';

const SectionTitle = ({ title, subtitle, centered = false }) => {
  const theme = useTheme();
  
  return (
    <Box 
      sx={{ 
        mb: 4, 
        textAlign: centered ? 'center' : 'left',
        position: 'relative'
      }}
    >
      <Typography
        variant="h4"
        component="h2"
        gutterBottom
        sx={{ 
          fontWeight: 600,
          position: 'relative',
          display: 'inline-block',
          '&::after': !centered ? {
            content: '""',
            position: 'absolute',
            bottom: -5,
            left: 0,
            width: '40px',
            height: '4px',
            backgroundColor: theme.palette.primary.main,
            borderRadius: '2px'
          } : undefined
        }}
      >
        {title}
      </Typography>
      
      {centered && (
        <Divider 
          sx={{ 
            width: '60px', 
            margin: '8px auto 16px', 
            borderColor: theme.palette.primary.main,
            borderWidth: 2
          }} 
        />
      )}
      
      {subtitle && (
        <Typography 
          variant="body1" 
          color="text.secondary"
          sx={{ 
            maxWidth: centered ? '600px' : undefined,
            mx: centered ? 'auto' : undefined
          }}
        >
          {subtitle}
        </Typography>
      )}
    </Box>
  );
};

export default SectionTitle;
