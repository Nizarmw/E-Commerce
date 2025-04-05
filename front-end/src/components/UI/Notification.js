import React from 'react';
import { Snackbar, Alert } from '@mui/material';

const Notification = ({ open, message, severity, onClose, autoHideDuration = 3000 }) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={onClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
    >
      <Alert onClose={onClose} severity={severity || 'info'} variant="filled">
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Notification;
