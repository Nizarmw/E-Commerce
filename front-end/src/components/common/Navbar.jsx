import React from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton, 
  Menu, 
  MenuItem,
  InputBase,
  Badge
} from '@mui/material';
import { 
  AccountCircle, 
  Search as SearchIcon, 
  ShoppingCart,
  Notifications 
} from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';
import { isAuthenticated, getUserInfo, removeToken, clearUserInfo } from '../../utils/auth';

const Navbar = () => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const navigate = useNavigate();
  const authenticated = isAuthenticated();
  const userInfo = getUserInfo();

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    removeToken();
    clearUserInfo();
    navigate('/login');
    handleClose();
  };

  return (
    <AppBar position="sticky">
      <Toolbar>
        <Typography variant="h6" component={Link} to="/" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
          E-Commerce
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          {/* Search Box */}
          <Box sx={{ display: 'flex', alignItems: 'center', bgcolor: 'rgba(255,255,255,0.15)', borderRadius: 1, px: 1 }}>
            <InputBase
              placeholder="Search..."
              sx={{ color: 'white', ml: 1 }}
            />
            <IconButton color="inherit" size="small">
              <SearchIcon />
            </IconButton>
          </Box>

          {/* Shopping Cart */}
          <IconButton color="inherit" component={Link} to="/cart">
            <Badge badgeContent={3} color="error">
              <ShoppingCart />
            </Badge>
          </IconButton>

          {authenticated ? (
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {/* Notifications */}
              <IconButton color="inherit">
                <Badge badgeContent={2} color="error">
                  <Notifications />
                </Badge>
              </IconButton>

              <Typography sx={{ mx: 2 }}>
                Hi, {userInfo?.full_name || userInfo?.name || userInfo?.email?.split('@')[0] || 'User'}
              </Typography>
              <IconButton onClick={handleMenu} color="inherit">
                <AccountCircle />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem component={Link} to="/profile" onClick={handleClose}>Profile</MenuItem>
                <MenuItem component={Link} to="/orders" onClick={handleClose}>My Orders</MenuItem>
                <MenuItem onClick={handleLogout}>Logout</MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button color="inherit" component={Link} to="/register">Register</Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
