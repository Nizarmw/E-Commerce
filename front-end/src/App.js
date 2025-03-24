import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';
import Layout from './components/Layout/Layout';
import Home from './pages/Home.js';

// Placeholder Pages (To be replaced with actual implementations)
const Products = () => <Box p={3}>Products Page</Box>;
const ProductDetails = () => <Box p={3}>Product Details Page</Box>;
const Cart = () => <Box p={3}>Cart Page</Box>;
const Checkout = () => <Box p={3}>Checkout Page</Box>;
const Profile = () => <Box p={3}>Profile Page</Box>;
const NotFound = () => <Box p={3}>404 - Page Not Found</Box>;

function App() {
  return (
    <Router>
      <CssBaseline />
      <Box sx={{ backgroundColor: 'background.default', minHeight: '100vh' }}>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/products" element={<Products />} />
            <Route path="/products/:id" element={<ProductDetails />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </Box>
    </Router>
  );
}

export default App;
