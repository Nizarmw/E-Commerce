import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/public/Home";
import Cart from "./pages/public/Cart"; // Add this import
import Products from "./pages/public/Products"; // Add this import
import Login from "./pages/auth/Login"; // Add this import
import Register from "./pages/auth/Register"; // Add this import
import ForgotPassword from "./pages/auth/ForgotPassword"; // Add this import
import SearchResults from "./pages/public/Search"; // Add this import
import OrderHistory from "./pages/public/OrderHistory";
import OrderDetail from "./pages/public/OrderDetail";
import Dashboard from "./pages/dashboard/Dashboard";
import Seller from "./pages/dashboard/Seller";
import SellerProducts from "./pages/dashboard/seller/Products"; // Updated path
import SellerOrders from "./pages/dashboard/seller/Orders"; // Updated path
import Settings from "./pages/dashboard/Settings";
import SellerDashboard from "./pages/dashboard/seller/Dashboard";
import SellerSettings from "./pages/dashboard/seller/Settings";
import AdminOrders from "./pages/dashboard/admin/Orders";
import AdminCustomers from "./pages/dashboard/admin/Customers";
import AdminProducts from "./pages/dashboard/admin/Products";
import AdminSettings from "./pages/dashboard/admin/Settings";
import { ThemeProvider, createTheme } from "@mui/material";
import "./styles/fonts.css"; // Add this import
import ProductDetail from "./pages/public/ProductDetail";
import Profile from "./pages/public/Profile";
import CategoriesPage from "./pages/dashboard/admin/Categories";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1A237E", // Navy Blue
    },
    secondary: {
      main: "#FFCA28", // Soft Gold/Mustard
    },
    background: {
      default: "#fff",
      paper: "#fff",
    },
  },
  typography: {
    fontFamily: "Open Sans, sans-serif",
    h1: {
      fontFamily: "Poppins, sans-serif",
    },
    h2: {
      fontFamily: "Poppins, sans-serif",
    },
    h3: {
      fontFamily: "Poppins, sans-serif",
    },
    h4: {
      fontFamily: "Poppins, sans-serif",
    },
    h5: {
      fontFamily: "Poppins, sans-serif",
    },
    h6: {
      fontFamily: "Poppins, sans-serif",
    },
    subtitle1: {
      fontFamily: "Poppins, sans-serif",
    },
    subtitle2: {
      fontFamily: "Poppins, sans-serif",
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: "none",
        },
        containedPrimary: {
          "&:hover": {
            backgroundColor: "#151875", // Slightly darker navy
          },
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: "0 2px 8px rgba(26, 35, 126, 0.1)",
        },
      },
    },
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/cart" element={<Cart />} /> {/* Add this route */}
        <Route path="/products" element={<Products />} /> {/* Add this route */}
        <Route path="/products/:id" element={<ProductDetail />} />{" "}
        {/* Add this route */}
        <Route path="/login" element={<Login />} /> {/* Add this route */}
        <Route path="/register" element={<Register />} /> {/* Add this route */}
        <Route path="/forgot-password" element={<ForgotPassword />} />{" "}
        {/* Add this route */}
        <Route path="/search" element={<SearchResults />} />{" "}
        {/* Add this route */}
        <Route path="/orders" element={<OrderHistory />} />
        {/* <Route path="/order/:id" element={<OrderDetail />} /> */}
        {/* Seller Dashboard Routes */}
        <Route path="/dashboard/seller" element={<SellerDashboard />} />
        <Route path="/dashboard/products" element={<SellerProducts />} />{" "}
        {/* Changed this route */}
        <Route path="/dashboard/orders" element={<SellerOrders />} />
        <Route path="/dashboard/settings" element={<SellerSettings />} />
        {/* Admin Dashboard Routes - prepend with /admin to differentiate */}
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/customers" element={<AdminCustomers />} />
        <Route path="/admin/categories" element={<CategoriesPage />} />
        <Route path="/admin/products" element={<AdminProducts />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Routes>
    </ThemeProvider>
  );
};

export default App;
