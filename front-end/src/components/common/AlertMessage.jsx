import React from 'react';
import { Alert, AlertTitle, Collapse } from '@mui/material';

const AlertMessage = ({
  open,
  severity = 'info',
  title,
  message,
  onClose,
  sx = {},
}) => {
  return (
    <Collapse in={open}>
      <Alert 
        severity={severity} 
        onClose={onClose}
        sx={{ mb: 2, ...sx }}
      >
        {title && <AlertTitle>{title}</AlertTitle>}
        {message}
      </Alert>
    </Collapse>
  );
};

export default AlertMessage;
