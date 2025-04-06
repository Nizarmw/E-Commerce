import React from 'react';
import { Container, Box } from '@mui/material';

const PageContainer = ({ children, maxWidth = 'lg', padding = 3 }) => {
  return (
    <Container maxWidth={maxWidth}>
      <Box sx={{ py: padding }}>
        {children}
      </Box>
    </Container>
  );
};

export default PageContainer;
