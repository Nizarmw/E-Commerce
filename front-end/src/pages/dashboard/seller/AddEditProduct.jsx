import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Breadcrumbs,
  Link,
  Typography,
} from '@mui/material';
import { NavigateNext } from '@mui/icons-material';
import { DashboardLayout } from '../../../layouts';
import { ProductForm } from '../../../components/dashboard/forms';

const AddEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState(null);

  useEffect(() => {
    if (id) {
      // Fetch product data for editing
      fetchProductData();
    }
  }, [id]);

  const fetchProductData = async () => {
    try {
      // Replace with actual API call
      const response = await fetch(`/api/products/${id}`);
      const data = await response.json();
      setInitialData(data);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  };

  const handleSubmit = async (formData) => {
    setLoading(true);
    try {
      // Replace with actual API call
      const method = id ? 'PUT' : 'POST';
      const url = id ? `/api/products/${id}` : '/api/products';
      
      await fetch(url, {
        method,
        body: JSON.stringify(formData),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      navigate('/dashboard/seller/products');
    } catch (error) {
      console.error('Error saving product:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashboardLayout>
      <Box sx={{ p: 3 }}>
        <Breadcrumbs 
          separator={<NavigateNext fontSize="small" />}
          sx={{ mb: 3 }}
        >
          <Link 
            color="inherit" 
            href="/dashboard/seller"
            underline="hover"
          >
            Dashboard
          </Link>
          <Link
            color="inherit"
            href="/dashboard/seller/products"
            underline="hover"
          >
            Products
          </Link>
          <Typography color="text.primary">
            {id ? 'Edit Product' : 'Add Product'}
          </Typography>
        </Breadcrumbs>

        <ProductForm
          initialData={initialData}
          onSubmit={handleSubmit}
          loading={loading}
        />
      </Box>
    </DashboardLayout>
  );
};

export default AddEditProduct;
