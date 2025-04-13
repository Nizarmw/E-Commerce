import React, { useEffect, useState } from "react";
import {
  Container,
  Grid,
  Box,
  Typography,
  Card,
  CardContent,
  IconButton,
  Button,
  Divider,
  Avatar,
  TextField,
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { Link, useNavigate } from "react-router-dom";
import PublicLayout from "../../layouts/PublicLayout"; // Fix this import
import { getCart, updateItemQuantity } from "../../services/cart";
import axios from "axios";
import { getUserInfo, isAuthenticated } from "../../utils/auth";
import api from "../../services/api";

const Cart = () => {
  // Mock data - replace with Redux state
  const [cartItems, setCartItems] = React.useState([]);
  const [subTotal, setSubTotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const navigate = useNavigate();

  // Create Core API instance

  const calculateTax = (subtotal) => subtotal * 0.11; // 11% tax
  const calculateTotal = (subtotal, tax) => subtotal + tax;

  const getCartItems = async () => {
    const res = await getCart();
    setCartItems(res);

    const sub = res.reduce(
      (total, item) => total + item.product.price * item.quantity,
      0
    );
    const taxHasil = calculateTax(sub);
    setSubTotal(sub);
    console.log();
    setTax(calculateTax(sub));
    setTotal(sub);
  };

  useEffect(() => {
    getCartItems();
  }, []);

  const handleQuantityChange = async (itemId, quantity) => {
    try {
      await updateItemQuantity(itemId, quantity); // Update quantity in the backend
      await getCartItems(); // Fetch updated cart items
    } catch (error) {
      console.error("Error updating item quantity:", error);
    }
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
  };

  const handleOrderSubmit = async () => {
    const token = localStorage.getItem("token");
    const orderBody = {
      order_items: cartItems.map((item) => ({
        product_id: item.product_id,
        quantity: item.quantity,
      })),
    };

    try {
      const order = await axios.post(
        `${import.meta.env.VITE_API_URL}/orders/`,
        orderBody,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      const payment = await axios.post(
        `${import.meta.env.VITE_API_URL}/payment/`,
        {
          order_id: order.data.order_id,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      window.snap.pay(payment.data.snap_token);

      console.log("Payment response:", payment.data);
    } catch (error) {
      console.error("Failed to submit order:", error);
    }
  };

  const handleDeleteItem = async (itemId) => {
    try {
      const userInfo = getUserInfo();
      const res = await api.delete(`/cart/users/${userInfo.user_id}/${itemId}`);
      await getCartItems();

      console.log("Item deleted:", res);
    } catch (error) {
      alert("Failed to delete item from cart");
      console.error("Error deleting item:", error);
    }
  };

  useEffect(() => {
    const snapSrcUrl = "https://app.sandbox.midtrans.com/snap/snap.js";
    const myMidtransClientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;

    const script = document.createElement("script");
    script.src = snapSrcUrl;
    script.setAttribute("data-client-key", myMidtransClientKey);
    script.async = true;

    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      alert("Please login to view your cart");
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
  }, [navigate]);

  return (
    <>
      <PublicLayout>
        <Container maxWidth="lg" sx={{ my: 4 }}>
          <Typography variant="h4" gutterBottom>
            Shopping Cart
          </Typography>

          {cartItems.length === 0 ? (
            <Box sx={{ textAlign: "center", py: 8 }}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                Your cart is empty
              </Typography>
              <Button
                component={Link}
                to="/" // Change this from "/products" to "/"
                variant="contained"
                sx={{ mt: 2 }}
              >
                Continue Shopping
              </Button>
            </Box>
          ) : (
            <Grid container spacing={4}>
              {/* Cart Items */}
              <Grid item xs={12} md={8}>
                <Card>
                  {cartItems.map((item, index) => (
                    <React.Fragment key={item.id}>
                      {index > 0 && <Divider />}
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item>
                            <Avatar
                              src={item.product.image_url}
                              alt={item.product.name}
                              variant="rounded"
                              sx={{ width: 80, height: 80 }}
                            />
                          </Grid>
                          <Grid item xs>
                            <Typography variant="subtitle1">
                              {item.product.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Price: {formatPrice(item.product.price)}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                              }}
                            >
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity - 1
                                  )
                                }
                                disabled={item.quantity <= 1}
                              >
                                <RemoveIcon />
                              </IconButton>
                              <TextField
                                size="small"
                                value={item.quantity}
                                inputProps={{
                                  readOnly: true,
                                  style: { textAlign: "center", width: "40px" },
                                }}
                              />
                              <IconButton
                                size="small"
                                onClick={() =>
                                  handleQuantityChange(
                                    item.id,
                                    item.quantity + 1
                                  )
                                }
                              >
                                <AddIcon />
                              </IconButton>
                            </Box>
                          </Grid>
                          <Grid item xs={12} sm="auto">
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: "bold" }}
                            >
                              {formatPrice(item.product.price * item.quantity)}
                            </Typography>
                          </Grid>
                          <Grid item>
                            <IconButton
                              color="error"
                              onClick={() => handleDeleteItem(item.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      </CardContent>
                    </React.Fragment>
                  ))}
                </Card>
              </Grid>

              {/* Order Summary */}
              <Grid item xs={12} md={4}>
                <Card>
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      Order Summary
                    </Typography>
                    <Box sx={{ my: 2 }}>
                      {cartItems.map((item) => (
                        <Box
                          key={item.id}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography variant="body2">
                            {item.name} x {item.quantity}
                          </Typography>
                          <Typography variant="body2">
                            {formatPrice(item.product.price * item.quantity)}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                    <Divider sx={{ my: 2 }} />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography>Subtotal</Typography>
                      <Typography>{formatPrice(subTotal)}</Typography>
                    </Box>
                    {/* <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Typography>Tax (11%)</Typography>
                      <Typography>{formatPrice(tax)}</Typography>
                    </Box> */}
                    <Divider sx={{ my: 2 }} />
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 2,
                      }}
                    >
                      <Typography variant="h6">Total</Typography>
                      <Typography variant="h6">{formatPrice(total)}</Typography>
                    </Box>
                    <Button
                      variant="contained"
                      fullWidth
                      onClick={handleOrderSubmit}
                    >
                      Proceed to Checkout
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          )}
        </Container>
      </PublicLayout>
    </>
  );
};

export default Cart;
