import React from 'react';
import { Skeleton, Card, CardContent, Box } from '@mui/material';

export const TextRowSkeleton = ({ width = '100%', height = 20 }) => (
  <Skeleton variant="text" width={width} height={height} />
);

export const ProductCardSkeleton = () => (
  <Card>
    <Skeleton variant="rectangular" height={200} />
    <CardContent>
      <Skeleton variant="text" width="80%" />
      <Skeleton variant="text" width="60%" />
      <Skeleton variant="text" width="40%" />
    </CardContent>
  </Card>
);

export const TableRowSkeleton = ({ columns = 4 }) => (
  <Box sx={{ display: 'flex', gap: 2, my: 1 }}>
    {Array(columns).fill(0).map((_, index) => (
      <Skeleton 
        key={index} 
        variant="text" 
        width={`${100/columns}%`} 
      />
    ))}
  </Box>
);
