import React from 'react';
import { CircularProgress, LinearProgress, Box } from '@mui/material';

export const CircularLoading = ({ size = 40, color = 'primary', sx = {} }) => (
  <Box display="flex" justifyContent="center" alignItems="center" sx={sx}>
    <CircularProgress size={size} color={color} />
  </Box>
);

export const LinearLoading = ({ color = 'primary', sx = {} }) => (
  <Box sx={{ width: '100%', ...sx }}>
    <LinearProgress color={color} />
  </Box>
);

export const LoadingOverlay = () => (
  <Box
    sx={{
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      zIndex: 1000,
    }}
  >
    <CircularProgress />
  </Box>
);
