import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  Container,
  Typography,
  Grid,
  TextField,
  Button,
  Paper,
  Box,
  Divider,
  Alert
} from "@mui/material";
import PublicLayout from "../../layouts/PublicLayout";
import Loading from "../../components/common/Loading";
import { isAuthenticated } from "../../utils/auth";
import { createOrder } from "../../services/orders";

const Checkout = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    address: "",
    city: "",
    postalCode: "",
    phoneNumber: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  
  // This would come from your Redux store
  const cart = useSelector((state) => state.cart?.items || []);

  useEffect(() => {
    if (!isAuthenticated()) {
      alert("Silakan login terlebih dahulu untuk checkout");
      navigate("/login");
      return;
    }

    if (cart.length === 0) {
      alert("Keranjang belanja kosong");
      navigate("/cart");
    }
  }, [cart, navigate]);

  const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await createOrder({
        items: cart.map((item) => ({
          productId: item.id,
          quantity: 1,
          price: item.price,
        })),
        shippingDetails: formData
      });

      alert("Order berhasil dibuat! Nomor order: " + response.orderId);
      // TODO: Clear cart after successful order
      navigate("/order-confirmation");
    } catch (error) {
      console.error("Checkout failed:", error);
      setError("Checkout gagal. Coba lagi");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Checkout
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Typography variant="h5" component="h2" gutterBottom fontWeight="medium">
              Alamat Pengiriman
            </Typography>
            
            <Box component="form" onSubmit={handleSubmit}>
              <TextField
                fullWidth
                margin="normal"
                required
                label="Nama Lengkap"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
              />
              
              <TextField
                fullWidth
                margin="normal"
                required
                label="Alamat"
                name="address"
                value={formData.address}
                onChange={handleChange}
                multiline
                rows={3}
              />
              
              <TextField
                fullWidth
                margin="normal"
                required
                label="Kota"
                name="city"
                value={formData.city}
                onChange={handleChange}
              />
              
              <TextField
                fullWidth
                margin="normal"
                required
                label="Kode Pos"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
              />
              
              <TextField
                fullWidth
                margin="normal"
                required
                label="Nomor Telepon"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
              
              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                color="primary"
                sx={{ mt: 3 }}
                size="large"
              >
                {loading ? "Memproses..." : "Selesaikan Pesanan"}
              </Button>
            </Box>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Typography variant="h5" component="h2" gutterBottom fontWeight="medium">
              Ringkasan Pesanan
            </Typography>
            
            <Paper elevation={1} sx={{ p: 3, bgcolor: "grey.50" }}>
              {cart.map((item) => (
                <Box key={item.id} sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  mb: 2, 
                  pb: 1, 
                  borderBottom: 1,
                  borderColor: 'divider'
                }}>
                  <Typography>{item.name}</Typography>
                  <Typography>Rp {item.price.toLocaleString('id-ID')}</Typography>
                </Box>
              ))}
              
              <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                mt: 3,
                pt: 2,
                borderTop: 1,
                borderColor: 'divider',
                fontWeight: 'bold'
              }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6">
                  Rp {calculateTotal().toLocaleString('id-ID')}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      
      {loading && <Loading overlay text="Memproses pesanan Anda..." />}
    </PublicLayout>
  );
};

export default Checkout;
