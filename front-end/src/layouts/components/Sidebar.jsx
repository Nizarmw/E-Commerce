import React from 'react';
import {
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemButton,
  Box,
  Divider,
  Typography,
} from '@mui/material';
import {
  Dashboard,
  ShoppingCart,
  People,
  Inventory,
  Settings,
  BarChart,
  Store,
  ExitToApp,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const Sidebar = ({ open, width = 240 }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Orders', icon: <ShoppingCart />, path: '/dashboard/orders' },
    { text: 'Customers', icon: <People />, path: '/dashboard/customers' },
    { text: 'Products', icon: <Inventory />, path: '/dashboard/products' },
    { text: 'Analytics', icon: <BarChart />, path: '/dashboard/analytics' },
  ];

  const secondaryMenuItems = [
    { text: 'Store Settings', icon: <Store />, path: '/dashboard/store' },
    { text: 'Settings', icon: <Settings />, path: '/dashboard/settings' },
    { text: 'Logout', icon: <ExitToApp />, path: '/logout' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        width: width,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: width,
          boxSizing: 'border-box',
          overflowX: 'hidden',
          transition: 'width 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms',
        },
      }}
    >
      <Box sx={{ overflow: 'auto' }}>
        <Box sx={{ p: 2 }}>
          <Typography variant="h6" noWrap>
            Seller Dashboard
          </Typography>
        </Box>
        <Divider />
        <List>
          {menuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {secondaryMenuItems.map((item) => (
            <ListItem key={item.text} disablePadding>
              <ListItemButton
                selected={location.pathname === item.path}
                onClick={() => navigate(item.path)}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.text} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>
    </Drawer>
  );
};

export default Sidebar;
