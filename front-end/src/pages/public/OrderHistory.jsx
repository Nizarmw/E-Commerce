import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Box,
  Tab,
  Tabs,
  Paper,
  Grid,
  Chip,
  Button,
  Divider,
  CircularProgress,
  Alert,
} from "@mui/material";
import PublicLayout from "../../layouts/PublicLayout";
import { isAuthenticated } from "../../utils/auth";
import { getUserOrders } from "../../services/orders";
import axios from "axios";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      alert("Please login to view your orders");
      navigate("/login", { state: { from: "/orders" } });
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);

      try {
        const data = await getUserOrders();
        setOrders(data);
      } catch (err) {
        console.error("Error fetching orders:", err);
        setError("Failed to load your orders. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  useEffect(() => {
    const fetchOrder = async () => {
      const order = await getUserOrders();
      console.log(order);
      setOrders(order);
      setFilteredOrders(order);
    };

    fetchOrder();
  }, []);

  useEffect(() => {
    setFilteredOrders(
      orders.filter((order) => {
        if (activeTab === "all") return true;
        return order.status.toLowerCase() === activeTab;
      })
    );
  }, [activeTab]);

  // Get status color based on status
  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "warning";
      case "paid":
        return "info";
      case "shipped":
        return "secondary";
      case "completed":
        return "success";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const handleTabChange = (_, newValue) => {
    setActiveTab(newValue);
  };

  const handleOrderSubmit = async (order_id) => {
    const token = localStorage.getItem("token");

    try {
      const payment = await axios.get(
        `${import.meta.env.VITE_API_URL}/payment/${order_id}`,
        {
          order_id,
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

  const formatPrice = (price) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
    }).format(price);
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

  return (
    <PublicLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          My Orders
        </Typography>

        {/* Status tabs */}
        <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 3 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All Orders" value="all" />
            <Tab label="Pending" value="pending" />
            <Tab label="Paid" value="paid" />
            <Tab label="Shipped" value="shipped" />
            <Tab label="Completed" value="completed" />
            <Tab label="Cancelled" value="cancelled" />
          </Tabs>
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        ) : filteredOrders.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center", bgcolor: "grey.50" }}>
            <Typography variant="h6" gutterBottom>
              No orders found
            </Typography>
            <Typography color="textSecondary" paragraph>
              {activeTab === "all"
                ? "You haven't placed any orders yet."
                : `You don't have any ${activeTab} orders.`}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate("/")}
              sx={{ mt: 2 }}
            >
              Start Shopping
            </Button>
          </Paper>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {filteredOrders.map((order) => (
              <Paper
                key={order.id}
                variant="outlined"
                sx={{ overflow: "hidden" }}
              >
                <Box
                  sx={{
                    p: 2,
                    bgcolor: "grey.50",
                    borderBottom: 1,
                    borderColor: "divider",
                  }}
                >
                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Grid item>
                      <Typography variant="body2" color="textSecondary">
                        Order ID:{" "}
                        <Box component="span" sx={{ fontFamily: "monospace" }}>
                          {order.id}
                        </Box>
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        Date: {new Date(order.created_at).toLocaleDateString()}
                      </Typography>
                    </Grid>
                    <Grid
                      item
                      sx={{ display: "flex", alignItems: "center", gap: 2 }}
                    >
                      <Chip
                        label={order.status}
                        color={getStatusColor(order.status)}
                        size="small"
                      />

                      {order.status === "pending" && (
                        <Button
                          variant="text"
                          color="primary"
                          size="small"
                          onClick={() => handleOrderSubmit(order.id)}
                        >
                          Pay Now
                        </Button>
                      )}
                      {/* <Button
                        variant="text"
                        color="primary"
                        size="small"
                        // onClick={() => navigate(`/order/${order.id}`)}
                      >
                        View Details
                      </Button> */}
                    </Grid>
                  </Grid>
                </Box>

                <Box sx={{ p: 2 }}>
                  {order.order_items.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        py: 1.5,
                        display: "flex",
                        alignItems: "center",
                        gap: 2,
                        borderBottom: 1,
                        borderColor: "divider",
                        "&:last-child": {
                          borderBottom: 0,
                        },
                      }}
                    >
                      <Box
                        sx={{
                          width: 64,
                          height: 64,
                          flexShrink: 0,
                          bgcolor: "grey.200",
                          borderRadius: 1,
                          overflow: "hidden",
                        }}
                      >
                        {item.product?.image_url ? (
                          <Box
                            component="img"
                            src={item.product.image_url}
                            alt={item.product.name}
                            sx={{
                              width: "100%",
                              height: "100%",
                              objectFit: "cover",
                            }}
                          />
                        ) : (
                          <Box
                            sx={{
                              width: "100%",
                              height: "100%",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "text.disabled",
                            }}
                          >
                            No img
                          </Box>
                        )}
                      </Box>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="subtitle2">
                          {item.product?.name || "Product Unavailable"}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          Qty: {item.quantity} ×{" "}
                          {formatPrice(item.product.price)}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 3,
                          alignItems: "flex-end",
                        }}
                      >
                        <Typography variant="subtitle2">
                          {formatPrice(item.price)}
                        </Typography>
                        <Chip
                          label={item.status}
                          color={getStatusColor(item.status)}
                          size="small"
                        />
                      </Box>
                    </Box>
                  ))}

                  <Box
                    sx={{
                      mt: 2,
                      pt: 2,
                      borderTop: 1,
                      borderColor: "divider",
                      display: "flex",
                      justifyContent: "space-between",
                    }}
                  >
                    <Typography variant="subtitle1">Total</Typography>
                    <Typography variant="subtitle1" fontWeight="bold">
                      {formatPrice(order.total_price)}
                    </Typography>
                  </Box>
                </Box>
              </Paper>
            ))}
          </Box>
        )}
      </Container>
    </PublicLayout>
  );
};

export default OrderHistory;
