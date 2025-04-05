import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import Layout from './components/Layout/Layout';
import Home from './pages/Home.jsx';
import Products from './pages/Products.jsx';
import ProductDetail from './pages/ProductDetail.js';
import Cart from './components/Cart';
import Checkout from './pages/checkout';
import Orders from './pages/Orders.jsx';
import OrderDetail from './pages/order-detail';
import Dashboard from './pages/Dashboard.jsx';
import Search from './pages/search';
import Admin from './pages/admin';
import theme from './theme';

// 404 Page
const NotFound = () => <Box p={3}>404 - Page Not Found</Box>;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:id" element={<ProductDetail />} />
              {/* Removed redundant route for product details */}
              <Route path="/cart" element={<Cart />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/orders" element={<Orders />} />
              <Route path="/order/:id" element={<OrderDetail />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/search" element={<Search />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </Box>
      </Router>
    </ThemeProvider>
  );
}

export default App;
