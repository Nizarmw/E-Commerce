import React, { useState } from 'react';
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
} from '@mui/material';
import {
  Search,
  Visibility,
  LocalShipping,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { formatPrice } from '../../../utils/formatters';

const Orders = () => {
  const [tab, setTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');

  const statusColors = {
    pending: 'warning',
    processing: 'info',
    shipped: 'secondary',
    delivered: 'success',
    cancelled: 'error',
  };

  const columns = [
    {
      field: 'orderNumber',
      headerName: 'Order #',
      width: 130,
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 130,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'customer',
      headerName: 'Customer',
      flex: 1,
    },
    {
      field: 'total',
      headerName: 'Total',
      width: 130,
      renderCell: (params) => formatPrice(params.value),
    },
    {
      field: 'status',
      headerName: 'Status',
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
      field: 'actions',
      headerName: 'Actions',
      width: 100,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View Details">
            <IconButton size="small" onClick={() => handleViewOrder(params.row.id)}>
              <Visibility />
            </IconButton>
          </Tooltip>
          {params.row.status === 'processing' && (
            <Tooltip title="Mark as Shipped">
              <IconButton size="small" onClick={() => handleShipOrder(params.row.id)}>
                <LocalShipping />
              </IconButton>
            </Tooltip>
          )}
        </Box>
      ),
    },
  ];

  // Mock data - replace with API call
  const orders = [
    {
      id: 1,
      orderNumber: 'ORD-001',
      date: '2024-03-20',
      customer: 'John Doe',
      total: 1500000,
      status: 'pending',
    },
    // Add more mock orders...
  ];

  const handleTabChange = (event, newValue) => {
    setTab(newValue);
  };

  const handleViewOrder = (orderId) => {
    console.log('View order:', orderId);
  };

  const handleShipOrder = (orderId) => {
    console.log('Ship order:', orderId);
  };

  const filteredOrders = orders.filter((order) => {
    if (!searchTerm) return true;
    return (
      order.orderNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Paper sx={{ width: '100%', mb: 2 }}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <Tabs value={tab} onChange={handleTabChange}>
              <Tab label="All Orders" />
              <Tab label="Pending" />
              <Tab label="Processing" />
              <Tab label="Shipped" />
              <Tab label="Delivered" />
              <Tab label="Cancelled" />
            </Tabs>
          </Box>
        </Paper>

        <Paper sx={{ width: '100%', mb: 2 }}>
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
