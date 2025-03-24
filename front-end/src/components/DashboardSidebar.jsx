import React from 'react';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Divider,
  Typography,
  Avatar,
  Toolbar,
  useTheme
} from '@mui/material';
import { 
  Dashboard as DashboardIcon, 
  ShoppingCart, 
  People, 
  Inventory, 
  Assessment, 
  Settings, 
  Logout,
  Person
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

const navItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Orders', icon: <ShoppingCart />, path: '/orders' },
  { text: 'Customers', icon: <People />, path: '/customers' },
  { text: 'Products', icon: <Inventory />, path: '/products' },
  { text: 'Reports', icon: <Assessment />, path: '/reports' },
];

const secondaryNavItems = [
  { text: 'Account', icon: <Person />, path: '/account' },
  { text: 'Settings', icon: <Settings />, path: '/settings' },
];

const DashboardSidebar = ({ open, onClose, variant = 'permanent' }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose && variant === 'temporary') {
      onClose();
    }
  };

  const content = (
    <Box sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      <Toolbar
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          px: [1],
          py: 2
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 'bold' }}>
          E-Commerce Admin
        </Typography>
      </Toolbar>
      <Divider />
      <Box sx={{ px: 2, py: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ width: 40, height: 40, mr: 2 }}>A</Avatar>
          <Box>
            <Typography variant="subtitle1" sx={{ fontWeight: 'medium' }}>
              Admin User
            </Typography>
            <Typography variant="body2" color="textSecondary">
              admin@example.com
            </Typography>
          </Box>
        </Box>
      </Box>
      <Divider />
      <List component="nav" sx={{ px: 2, py: 1 }}>
        {navItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 1,
                minHeight: 48,
                px: 2.5,
                backgroundColor: location.pathname === item.path ? theme.palette.action.selected : 'transparent',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 2,
                  justifyContent: 'center',
                  color: location.pathname === item.path ? theme.palette.primary.main : 'inherit'
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text} 
                primaryTypographyProps={{ 
                  fontWeight: location.pathname === item.path ? 'medium' : 'regular',
                  color: location.pathname === item.path ? theme.palette.primary.main : 'inherit'
                }} 
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ my: 2 }} />
      <List component="nav" sx={{ px: 2, py: 1, flexGrow: 0 }}>
        {secondaryNavItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: 'block', mb: 0.5 }}>
            <ListItemButton
              onClick={() => handleNavigation(item.path)}
              sx={{
                borderRadius: 1,
                minHeight: 48,
                px: 2.5,
                backgroundColor: location.pathname === item.path ? theme.palette.action.selected : 'transparent',
                '&:hover': {
                  backgroundColor: theme.palette.action.hover,
                }
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: 2,
                  justifyContent: 'center',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding sx={{ display: 'block', mb: 0.5 }}>
          <ListItemButton
            onClick={() => console.log('Logout clicked')}
            sx={{
              borderRadius: 1,
              minHeight: 48,
              px: 2.5,
              '&:hover': {
                backgroundColor: theme.palette.action.hover,
              }
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: 0,
                mr: 2,
                justifyContent: 'center',
                color: theme.palette.error.main
              }}
            >
              <Logout />
            </ListItemIcon>
            <ListItemText 
              primary="Logout" 
              primaryTypographyProps={{ color: theme.palette.error.main }} 
            />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
    >
      <Drawer
        variant={variant}
        open={open}
        onClose={onClose}
        sx={{
          display: { xs: 'block', sm: 'block' },
          '& .MuiDrawer-paper': { 
            boxSizing: 'border-box', 
            width: drawerWidth,
            borderRight: `1px solid ${theme.palette.divider}`,
            boxShadow: variant === 'temporary' ? theme.shadows[8] : 'none',
          },
        }}
      >
        {content}
      </Drawer>
    </Box>
  );
};

export default DashboardSidebar;
