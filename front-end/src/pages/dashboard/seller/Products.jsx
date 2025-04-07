import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Card,
  IconButton,
  Tooltip,
} from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import {
  Edit,
  Delete,
  Add,
  Visibility,
} from '@mui/icons-material';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { formatPrice } from '../../../utils/formatters';

const SellerProducts = () => {
  // Mock data - replace with API call
  const [products] = useState([
    { 
      id: 1, 
      name: 'Product 1',
      price: 1500000,
      stock: 10,
      status: 'active',
      category: 'Electronics',
    },
    // Add more mock products
  ]);

  const columns = [
    { field: 'name', headerName: 'Product Name', flex: 1 },
    {
      field: 'price',
      headerName: 'Price',
      flex: 1,
      renderCell: (params) => formatPrice(params.value),
    },
    { field: 'stock', headerName: 'Stock', width: 100 },
    { field: 'category', headerName: 'Category', flex: 1 },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Box
          sx={{
            px: 2,
            py: 0.5,
            borderRadius: 1,
            bgcolor: params.value === 'active' ? 'success.light' : 'warning.light',
            color: params.value === 'active' ? 'success.dark' : 'warning.dark',
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 150,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View">
            <IconButton size="small" onClick={() => handleView(params.row.id)}>
              <Visibility />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleEdit(params.row.id)}>
              <Edit />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => handleDelete(params.row.id)}>
              <Delete />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  const handleView = (id) => {
    console.log('View product:', id);
  };

  const handleEdit = (id) => {
    console.log('Edit product:', id);
  };

  const handleDelete = (id) => {
    console.log('Delete product:', id);
  };

  const handleAdd = () => {
    console.log('Add new product');
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4">My Products</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAdd}
          >
            Add Product
          </Button>
        </Box>

        <Card>
          <DataGrid
            rows={products}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            checkboxSelection
            disableSelectionOnClick
            autoHeight
          />
        </Card>
      </Box>
    </DashboardLayout>
  );
};

export default SellerProducts;
