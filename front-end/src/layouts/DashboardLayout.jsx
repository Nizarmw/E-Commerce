import React, { useState, useEffect } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Dashboard,
  ShoppingCart,
  People,
  Inventory,
  Settings,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/common/Navbar";
import { getUserInfo } from "../utils/auth";

const drawerWidth = 240;

const DashboardLayout = ({ children }) => {
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();
  const userInfo = getUserInfo();
  const isSeller = userInfo?.role === "seller";

  useEffect(() => {
    // Check if user is logged in and has a role
    if (!userInfo) {
      navigate("/login"); // Redirect to login if not authenticated
    } else if (userInfo.role !== "admin" && userInfo.role !== "seller") {
      navigate("/"); // Redirect to home if not an admin or seller
    }
  }, [userInfo, navigate]);

  const sellerMenuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/dashboard/seller" },
    { text: "Products", icon: <Inventory />, path: "/dashboard/products" },
    {
      text: "Orders",
      icon: <ShoppingCart />,
      path: "/dashboard/seller/orders",
    },
    {
      text: "Settings",
      icon: <Settings />,
      path: "/dashboard/seller/settings",
    },
  ];

  const adminMenuItems = [
    { text: "Dashboard", icon: <Dashboard />, path: "/admin/dashboard" },
    { text: "Orders", icon: <ShoppingCart />, path: "/admin/orders" },
    { text: "Customers", icon: <People />, path: "/admin/customers" },
    { text: "Products", icon: <Inventory />, path: "/admin/products" },
    { text: "Settings", icon: <Settings />, path: "/dashboard/settings" },
  ];

  const menuItems = isSeller ? sellerMenuItems : adminMenuItems;

  return (
    <Box>
      {/* Navbar */}
      <Navbar />

      {/* Sidebar */}
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            top: "64px", // Height of Navbar
            height: "calc(100vh - 64px)",
          },
        }}
      >
        <List>
          {menuItems.map((item) => (
            <ListItem
              button
              key={item.text}
              onClick={() => navigate(item.path)}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          // mt: "64px", // Offset for Navbar height
          ml: `${drawerWidth}px`,
        }}
      >
        {children}
      </Box>
    </Box>
  );
};

export default DashboardLayout;
