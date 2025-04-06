import React from 'react';
import { Grid } from '@mui/material';

const GridLayout = ({ 
  children, 
  spacing = 3,
  columns = { xs: 12, sm: 12, md: 12 },
  containerProps = {},
  itemProps = {}
}) => {
  return (
    <Grid container spacing={spacing} {...containerProps}>
      {React.Children.map(children, (child) => (
        <Grid item {...columns} {...itemProps}>
          {child}
        </Grid>
      ))}
    </Grid>
  );
};

export default GridLayout;
