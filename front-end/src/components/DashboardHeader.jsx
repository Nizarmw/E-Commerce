import React, { useState } from 'react';
import {
  AppBar,
  Badge,
  Box,
  IconButton,
  Toolbar,
  Tooltip,
  Avatar,
  Menu,
  MenuItem,
  Typography,
  InputBase,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  Menu as MenuIcon,
  Notifications,
  Search as SearchIcon,
  Settings,
  Person,
  Logout,
  Mail
} from '@mui/icons-material';
import { alpha } from '@mui/material/styles';

const DashboardHeader = ({ onSidebarOpen }) => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('lg'));
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  
  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };
  
  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  
  const handleNotificationsOpen = (event) => {
    setNotificationsAnchorEl(event.currentTarget);
  };
  
  const handleNotificationsClose = () => {
    setNotificationsAnchorEl(null);
  };

  return (
    <AppBar 
      position="fixed" 
      elevation={0}
      sx={{ 
        zIndex: (theme) => theme.zIndex.drawer + 1,
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
        borderBottom: `1px solid ${theme.palette.divider}`
      }}
    >
      <Toolbar>
        <IconButton
          color="inherit"
          onClick={onSidebarOpen}
          edge="start"
          sx={{ mr: 2, display: { sm: 'none' } }}
        >
          <MenuIcon />
        </IconButton>
        
        {/* Search Bar */}
        <Box 
          sx={{ 
            position: 'relative',
            borderRadius: theme.shape.borderRadius,
            backgroundColor: alpha(theme.palette.common.black, 0.05),
            '&:hover': {
              backgroundColor: alpha(theme.palette.common.black, 0.08),
            },
            marginRight: 2,
            marginLeft: 0,
            width: isDesktop ? '40%' : '100%',
            [theme.breakpoints.up('sm')]: {
              marginLeft: 3,
              width: 'auto',
            },
          }}
        >
          <Box sx={{ 
            padding: theme.spacing(0, 2), 
            height: '100%', 
            position: 'absolute', 
            pointerEvents: 'none', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
          }}>
            <SearchIcon />
          </Box>
          <InputBase
            placeholder="Search…"
            sx={{
              color: 'inherit',
              padding: theme.spacing(1, 1, 1, 0),
              paddingLeft: `calc(1em + ${theme.spacing(4)})`,
              transition: theme.transitions.create('width'),
              width: '100%',
              [theme.breakpoints.up('md')]: {
                width: '20ch',
              },
            }}
          />
        </Box>
        
        <Box sx={{ flexGrow: 1 }} />
        
        {/* Notification Button */}
        <Box sx={{ display: 'flex' }}>
          <IconButton
            color="inherit"
            onClick={handleNotificationsOpen}
          >
            <Badge badgeContent={4} color="primary">
              <Notifications />
            </Badge>
          </IconButton>
          
          {/* Messages Button */}
          <IconButton color="inherit">
            <Badge badgeContent={3} color="primary">
              <Mail />
            </Badge>
          </IconButton>
          
          {/* Settings Button */}
          <IconButton color="inherit">
            <Settings />
          </IconButton>
          
          {/* Profile Button */}
          <Tooltip title="Account settings">
            <IconButton
              onClick={handleProfileMenuOpen}
              size="small"
              sx={{ ml: 2 }}
              aria-controls={Boolean(anchorEl) ? 'account-menu' : undefined}
              aria-haspopup="true"
              aria-expanded={Boolean(anchorEl) ? 'true' : undefined}
            >
              <Avatar sx={{ width: 32, height: 32 }}>A</Avatar>
            </IconButton>
          </Tooltip>
        </Box>
      </Toolbar>
      
      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
      >
        <Box sx={{ py: 1, px: 2 }}>
          <Typography variant="subtitle1">Admin User</Typography>
          <Typography variant="body2" color="textSecondary">admin@example.com</Typography>
        </Box>
        <MenuItem onClick={handleMenuClose}>
          <Person sx={{ mr: 2 }} /> Profile
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Settings sx={{ mr: 2 }} /> Settings
        </MenuItem>
        <MenuItem onClick={handleMenuClose}>
          <Logout sx={{ mr: 2 }} /> Logout
        </MenuItem>
      </Menu>
      
      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchorEl}
        id="notifications-menu"
        open={Boolean(notificationsAnchorEl)}
        onClose={handleNotificationsClose}
        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: 'visible',
            filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
            mt: 1.5,
            width: 320,
            '& .MuiAvatar-root': {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
          },
        }}
      >
        <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="subtitle1">Notifications</Typography>
        </Box>
        <MenuItem>
          <Avatar sx={{ bgcolor: 'primary.main' }}>N</Avatar>
          <Box>
            <Typography variant="body1">New order received</Typography>
            <Typography variant="body2" color="textSecondary">5 minutes ago</Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Avatar sx={{ bgcolor: 'success.main' }}>P</Avatar>
          <Box>
            <Typography variant="body1">Payment confirmed</Typography>
            <Typography variant="body2" color="textSecondary">2 hours ago</Typography>
          </Box>
        </MenuItem>
        <MenuItem>
          <Avatar sx={{ bgcolor: 'warning.main' }}>S</Avatar>
          <Box>
            <Typography variant="body1">Stock alert: iPhone 13</Typography>
            <Typography variant="body2" color="textSecondary">1 day ago</Typography>
          </Box>
        </MenuItem>
        <Box sx={{ p: 1, display: 'flex', justifyContent: 'center', borderTop: `1px solid ${theme.palette.divider}` }}>
          <Typography variant="body2" color="primary" sx={{ cursor: 'pointer' }}>
            View all notifications
          </Typography>
        </Box>
      </Menu>
    </AppBar>
  );
};

export default DashboardHeader;
