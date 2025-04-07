import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Alert
} from '@mui/material';
import {
  Edit as EditIcon,
  Delete as DeleteIcon,
  Visibility as VisibilityIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { DataGrid } from '@mui/x-data-grid';
import DashboardLayout from '../../../layouts/DashboardLayout';
import { getAllProducts, deleteProduct } from '../../../services/products';
import { getAllCategories } from '../../../services/categories';
import { formatPrice } from '../../../utils/formatters';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    { 
      field: 'name', 
      headerName: 'Product Name', 
      flex: 1,
      renderCell: (params) => (
        <Tooltip title={params.value}>
          <span>{params.value}</span>
        </Tooltip>
      )
    },
    {
      field: 'price',
      headerName: 'Price',
      width: 130,
      renderCell: (params) => formatPrice(params.value),
    },
    { field: 'stock', headerName: 'Stock', width: 100 },
    { 
      field: 'category',
      headerName: 'Category',
      width: 130,
      valueGetter: (params) => params.row.category?.name || 'N/A'
    },
    {
      field: 'seller',
      headerName: 'Seller',
      width: 160,
      valueGetter: (params) => params.row.seller?.name || 'N/A'
    },
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
      sortable: false,
      renderCell: (params) => (
        <Box>
          <Tooltip title="View">
            <IconButton size="small" onClick={() => handleView(params.row)}>
              <VisibilityIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => handleEdit(params.row)}>
              <EditIcon />
            </IconButton>
          </Tooltip>
          <Tooltip title="Delete">
            <IconButton size="small" onClick={() => handleDeleteClick(params.row)}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        </Box>
      ),
    },
  ];

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    try {
      const data = await getAllProducts();
      setProducts(data);
    } catch (err) {
      setError('Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const handleView = (product) => {
    // Implement view product logic
    console.log('View product:', product);
  };

  const handleEdit = (product) => {
    // Implement edit product logic
    console.log('Edit product:', product);
  };

  const handleDeleteClick = (product) => {
    setSelectedProduct(product);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    try {
      await deleteProduct(selectedProduct.id);
      setDeleteConfirmOpen(false);
      fetchProducts(); // Refresh products list
    } catch (err) {
      setError('Failed to delete product');
      console.error('Error deleting product:', err);
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Products Management
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => handleEdit(null)}
          >
            Add Product
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Card>
          <DataGrid
            rows={products}
            columns={columns}
            pageSize={10}
            rowsPerPageOptions={[10, 25, 50]}
            checkboxSelection
            disableSelectionOnClick
            loading={loading}
            autoHeight
            sx={{
              '& .MuiDataGrid-cell': {
                whiteSpace: 'normal',
                lineHeight: 'normal',
                padding: '8px',
              },
            }}
          />
        </Card>

        {/* Delete Confirmation Dialog */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this product?
            {selectedProduct && (
              <Typography color="error" sx={{ mt: 1 }}>
                {selectedProduct.name}
              </Typography>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
            <Button onClick={handleDeleteConfirm} color="error" variant="contained">
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </DashboardLayout>
  );
};

export default AdminProducts;
