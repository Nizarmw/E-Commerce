import React from 'react';
import { Card, CardContent, CardHeader, CardActions } from '@mui/material';

const ContentCard = ({ 
  title, 
  subheader, 
  children, 
  actions,
  elevation = 1,
  sx = {} 
}) => {
  return (
    <Card elevation={elevation} sx={{ height: '100%', ...sx }}>
      {(title || subheader) && (
        <CardHeader title={title} subheader={subheader} />
      )}
      <CardContent>
        {children}
      </CardContent>
      {actions && <CardActions>{actions}</CardActions>}
    </Card>
  );
};

export default ContentCard;
