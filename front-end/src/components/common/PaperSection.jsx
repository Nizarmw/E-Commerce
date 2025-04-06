import React from 'react';
import { Paper, Box, Typography } from '@mui/material';

const PaperSection = ({ 
  title, 
  children, 
  elevation = 0,
  padding = 3,
  sx = {} 
}) => {
  return (
    <Paper 
      elevation={elevation}
      sx={{ 
        p: padding,
        backgroundColor: (theme) => 
          theme.palette.mode === 'dark' ? 'background.paper' : 'background.default',
        ...sx
      }}
    >
      {title && (
        <Box mb={3}>
          <Typography variant="h6">{title}</Typography>
        </Box>
      )}
      {children}
    </Paper>
  );
};

export default PaperSection;
