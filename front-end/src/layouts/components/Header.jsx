import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  Box,
  Container,
} from '@mui/material';
import {
  ShoppingCart,
  Person,
  Notifications,
  Search,
} from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { ThemeToggle } from '../../components/common';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const cartItemCount = 3;
  const notificationCount = 2;

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" color="default" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar 
          disableGutters 
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            py: { xs: 1, sm: 0 },
            gap: { xs: 1, sm: 0 }
          }}
        >
          <Box sx={{ 
            display: 'flex', 
            width: { xs: '100%', sm: 'auto' },
            justifyContent: { xs: 'space-between', sm: 'flex-start' },
            alignItems: 'center'
          }}>
            <Typography
              variant="h6"
              component={RouterLink}
              to="/"
              sx={{
                flexGrow: { sm: 1 },
                textDecoration: 'none',
                color: 'inherit',
                fontWeight: 700,
              }}
            >
              E-COMMERCE
            </Typography>
          </Box>

          <Box sx={{ 
            display: 'flex',
            width: { xs: '100%', sm: 'auto' },
            justifyContent: { xs: 'space-between', sm: 'flex-end' },
            alignItems: 'center',
            gap: 2 
          }}>
            <IconButton 
              color="inherit"
              aria-label="Search products"
              onClick={() => setSearchOpen(true)}
            >
              <Search />
            </IconButton>

            <IconButton
              component={RouterLink}
              to="/cart"
              color="inherit"
              aria-label={`Shopping cart with ${cartItemCount} items`}
            >
              <Badge badgeContent={cartItemCount} color="primary">
                <ShoppingCart />
              </Badge>
            </IconButton>

            <IconButton 
              color="inherit"
              aria-label={`${notificationCount} unread notifications`}
            >
              <Badge badgeContent={notificationCount} color="error">
                <Notifications />
              </Badge>
            </IconButton>

            <ThemeToggle />

            <IconButton
              onClick={handleMenu}
              color="inherit"
              aria-label="Account menu"
              aria-controls="user-menu"
              aria-haspopup="true"
              aria-expanded={Boolean(anchorEl)}
            >
              <Person />
            </IconButton>
            <Menu
              id="user-menu"
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'user-menu-button',
                role: 'menu'
              }}
            >
              <MenuItem component={RouterLink} to="/profile">Profile</MenuItem>
              <MenuItem component={RouterLink} to="/orders">Orders</MenuItem>
              <MenuItem component={RouterLink} to="/settings">Settings</MenuItem>
              <MenuItem onClick={handleClose}>Logout</MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;
