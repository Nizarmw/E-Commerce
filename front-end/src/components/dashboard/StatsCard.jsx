import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const StatsCard = ({ 
  title, 
  value, 
  icon, 
  color = 'primary',
  trend,
  trendLabel,
  onClick 
}) => {
  return (
    <Card 
      sx={{ 
        cursor: onClick ? 'pointer' : 'default',
        transition: 'transform 0.2s',
        '&:hover': onClick ? { transform: 'translateY(-4px)' } : {}
      }}
      onClick={onClick}
    >
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography color="text.secondary" gutterBottom>
              {title}
            </Typography>
            <Typography variant="h4" component="div">
              {value}
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: `${color}.light`,
              borderRadius: 2,
              p: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {icon}
          </Box>
        </Box>
        {trend && (
          <Typography variant="body2" color={trend >= 0 ? 'success.main' : 'error.main'}>
            {trend > 0 ? '+' : ''}{trend}% {trendLabel}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default StatsCard;
