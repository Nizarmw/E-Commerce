import React, { useState } from 'react';
import {
  AppBar as MuiAppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  MenuItem,
  Container,
  Button,
  Tooltip,
  Avatar,
} from '@mui/material';
import {
  AccountCircle,
  ShoppingCart,
  KeyboardArrowDown,
} from '@mui/icons-material';
import { Link } from 'react-router-dom';
import ThemeToggle from './ThemeToggle';

const pages = ['Products', 'Categories', 'About'];
const settings = ['Profile', 'Orders', 'Dashboard', 'Logout'];

const AppBar = () => {
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [anchorElNav, setAnchorElNav] = useState(null);

  const handleOpenUserMenu = (event) => setAnchorElUser(event.currentTarget);
  const handleCloseUserMenu = () => setAnchorElUser(null);
  const handleOpenNavMenu = (event) => setAnchorElNav(event.currentTarget);
  const handleCloseNavMenu = () => setAnchorElNav(null);

  return (
    <MuiAppBar position="sticky" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ justifyContent: 'space-between' }}>
          {/* Logo */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              fontFamily: 'Poppins',
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
            }}
          >
            E-COMMERCE
          </Typography>

          {/* Navigation Menu */}
          <Box sx={{ display: 'flex', gap: 2 }}>
            {pages.map((page) => (
              <Box key={page}>
                <Button
                  onClick={handleOpenNavMenu}
                  endIcon={<KeyboardArrowDown />}
                  sx={{ color: 'white' }}
                >
                  {page}
                </Button>
                <Menu
                  anchorEl={anchorElNav}
                  open={Boolean(anchorElNav)}
                  onClose={handleCloseNavMenu}
                >
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography>Submenu 1</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseNavMenu}>
                    <Typography>Submenu 2</Typography>
                  </MenuItem>
                </Menu>
              </Box>
            ))}
          </Box>

          {/* Right Section */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <ThemeToggle />
            
            <IconButton color="inherit" component={Link} to="/cart">
              <ShoppingCart />
            </IconButton>

            <Tooltip title="Account settings">
              <IconButton onClick={handleOpenUserMenu}>
                <Avatar>
                  <AccountCircle />
                </Avatar>
              </IconButton>
            </Tooltip>
            <Menu
              anchorEl={anchorElUser}
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
            >
              {settings.map((setting) => (
                <MenuItem key={setting} onClick={handleCloseUserMenu}>
                  <Typography textAlign="center">{setting}</Typography>
                </MenuItem>
              ))}
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </MuiAppBar>
  );
};

export default AppBar;
