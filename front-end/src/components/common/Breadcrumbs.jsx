import React from 'react';
import { Breadcrumbs as MuiBreadcrumbs, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const Breadcrumbs = ({ items }) => {
  return (
    <MuiBreadcrumbs 
      separator={<NavigateNextIcon fontSize="small" />}
      sx={{ my: 2 }}
    >
      <Link 
        component={RouterLink} 
        to="/"
        underline="hover"
        color="inherit"
      >
        Home
      </Link>
      {items?.map((item, index) => {
        const isLast = index === items.length - 1;
        return isLast ? (
          <Typography key={item.label} color="text.primary">
            {item.label}
          </Typography>
        ) : (
          <Link
            key={item.label}
            component={RouterLink}
            to={item.path}
            underline="hover"
            color="inherit"
          >
            {item.label}
          </Link>
        );
      })}
    </MuiBreadcrumbs>
  );
};

export default Breadcrumbs;
