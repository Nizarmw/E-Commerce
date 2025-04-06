import React from 'react';
import { AppBar, Toolbar, Typography, Button, IconButton, Box, InputBase } from '@mui/material';
import { Search as SearchIcon, ShoppingCart } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <AppBar position="static">
      <Toolbar>
        <Typography
          variant="h6"
          component={Link}
          to="/"
          sx={{ textDecoration: 'none', color: 'white', flexGrow: 1 }}
        >
          E-Commerce
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: 1, px: 1, mr: 2 }}>
          <InputBase
            placeholder="Search..."
            sx={{ color: 'white', ml: 1 }}
          />
          <IconButton color="inherit" size="small">
            <SearchIcon />
          </IconButton>
        </Box>

        <IconButton color="inherit" component={Link} to="/cart">
          <ShoppingCart />
        </IconButton>
        <Button color="inherit" component={Link} to="/login">Login</Button>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
