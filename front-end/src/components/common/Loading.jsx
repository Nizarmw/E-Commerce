import React from 'react';
import { Box, CircularProgress, LinearProgress, Typography } from '@mui/material';

const Loading = ({ 
  type = 'circular', 
  text = 'Loading...', 
  overlay = false,
  height = '100%'
}) => {
  const LoadingComponent = type === 'circular' ? CircularProgress : LinearProgress;

  const content = (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: height,
        width: '100%'
      }}
    >
      <LoadingComponent 
        color="primary"
        sx={{ mb: text ? 2 : 0 }}
      />
      {text && (
        <Typography 
          variant="body2" 
          color="text.secondary"
        >
          {text}
        </Typography>
      )}
    </Box>
  );

  if (overlay) {
    return (
      <Box
        sx={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          bgcolor: 'rgba(255, 255, 255, 0.8)',
          zIndex: (theme) => theme.zIndex.drawer + 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {content}
      </Box>
    );
  }

  return content;
};

export default Loading;
