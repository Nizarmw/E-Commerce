import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const SnackbarManager = ({
  open,
  message,
  severity = 'success',
  autoHideDuration = 6000,
  onClose,
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
    >
      <Alert 
        onClose={onClose} 
        severity={severity}
        variant="filled"
        sx={{ width: '100%' }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default SnackbarManager;
