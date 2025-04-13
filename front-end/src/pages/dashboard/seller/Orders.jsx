import React, { useEffect, useState } from "react";
import {
  Box,
  Paper,
  Tabs,
  Tab,
  Chip,
  IconButton,
  Tooltip,
  TextField,
  InputAdornment,
} from "@mui/material";
import { Search, Visibility, LocalShipping } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import DashboardLayout from "../../../layouts/DashboardLayout";
import { formatPrice } from "../../../utils/formatters";
import api from "../../../services/api";

const Orders = () => {
  const [tab, setTab] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);

  const statusColors = {
    pending: "warning",
    processing: "info",
    shipped: "secondary",
    delivered: "success",
    cancelled: "error",
  };

  const columns = [
    {
      field: "order_id",
      headerName: "Order #",
      width: 130,
    },
    {
      field: "created_at",
      headerName: "Date",
      width: 130,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: "customer",
      headerName: "Customer",
      flex: 1,
    },
    {
      field: "price",
      headerName: "Total",
      width: 130,
      renderCell: (params) => formatPrice(params.value),
    },
    {
      field: "status",
      headerName: "Status",
      width: 130,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={statusColors[params.value]}
          size="small"
        />
      ),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 100,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View Details">
            <IconButton
              size="small"
              onClick={() => handleViewOrder(params.row.id)}
            >
              <Visibility />
            </IconButton>
          </Tooltip>
          {params.row.status === "processing" && (
            <Tooltip title="Mark as Shipped">
              <IconButton
                size="small"
                onClick={() => handleShipOrder(params.row.id)}
              >
                <LocalShipping />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  // // Mock data - replace with API call
  // const orders = [
  //   {
  //     id: 1,
  //     orderNumber: 'ORD-001',
  //     date: '2024-03-20',
  //     customer: 'John Doe',
  //     total: 1500000,
  //     status: 'pending',
  //   },
  //   // Add more mock orders...
  // ];
  const getOrders = async () => {
    try {
      const response = await api.get("/seller/order-items");

      console.log("Orders data:", response.data);

      setOrders(response.data.data);
      setFilteredOrders(response.data.data);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleViewOrder = (orderId) => {
    console.log("View order:", orderId);
  };

  const handleShipOrder = (orderId) => {
    console.log("Ship order:", orderId);
  };

  useEffect(() => {
    setFilteredOrders(
      orders.filter((order) => {
        if (tab === "all") return true;
        return order.status.toLowerCase() === tab;
      })
    );
  }, [tab]);

  // const filteredOrders = orders.filter((order) => {
  //   if (!searchTerm) return true;
  //   return (
  //     order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     order.customer.toLowerCase().includes(searchTerm.toLowerCase())
  //   );
  // });

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Paper sx={{ width: "100%", mb: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs value={tab} onChange={handleTabChange}>
              <Tab label="All Orders" value="all" />
              <Tab label="Paid" value="paid" />
              <Tab label="Processing" value="processing" />
              <Tab label="Shipped" value="shipped" />
              <Tab label="Delivered" value="completed" />
              <Tab label="Cancelled" value="cancelled" />
            </Tabs>
          </Box>
        </Paper>

        <Paper sx={{ width: "100%", mb: 2 }}>
          <Box sx={{ p: 2 }}>
            <TextField
              fullWidth
              placeholder="Search orders..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
          <DataGrid
            rows={filteredOrders}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            autoHeight
            disableSelectionOnClick
          />
        </Paper>
      </Box>
    </DashboardLayout>
  );
};

export default Orders;
