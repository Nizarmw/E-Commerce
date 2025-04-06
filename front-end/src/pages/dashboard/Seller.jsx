import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Paper, 
  TextField, 
  Button, 
  Box, 
  Card, 
  CardContent, 
  Select, 
  MenuItem, 
  FormControl, 
  InputLabel, 
  FormHelperText,
  Divider,
  CircularProgress,
  Alert
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import AddCircleIcon from '@mui/icons-material/AddCircle';

import DashboardLayout from '../../layouts/DashboardLayout';
import { isAuthenticated, getUserRole } from '../../services/users';
import { getAllCategories } from '../../services/categories';
import { 
  getSellerProducts, 
  createProduct, 
  updateProduct, 
  deleteProduct 
} from '../../services/products';

const Seller = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    stock: '',
    categoryId: '',
  });
  const [categories, setCategories] = useState([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProductId, setCurrentProductId] = useState(null);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated()) {
        // Gunakan dialog atau toast notification di sini daripada alert
        navigate('/login', { state: { message: 'Silakan login terlebih dahulu' } });
        return;
      }

      try {
        // Verifikasi role seller
        const userData = await getUserRole();
        
        if (userData.role !== 'seller' && userData.role !== 'admin') {
          navigate('/', { state: { message: 'Anda tidak memiliki hak akses seller' } });
          return;
        }
        
        // Ambil produk seller dan kategori
        fetchProducts();
        fetchCategories();
      } catch (error) {
        console.error('Error:', error);
        setError('Gagal memverifikasi pengguna');
        navigate('/login');
      }
    };
    
    checkAuth();
  }, [navigate]);

  const fetchProducts = async () => {
    try {
      const data = await getSellerProducts();
      setProducts(data);
    } catch (error) {
      console.error('Error mengambil produk:', error);
      setError('Gagal memuat produk');
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const data = await getAllCategories();
      setCategories(data);
    } catch (error) {
      console.error('Error mengambil kategori:', error);
      setError('Gagal memuat kategori');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'price' || name === 'stock' ? parseFloat(value) : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      if (isEditing) {
        // Update produk yang ada
        await updateProduct(currentProductId, formData);
        // Gunakan toast notification daripada alert
      } else {
        // Buat produk baru
        await createProduct(formData);
        // Gunakan toast notification daripada alert
      }
      
      // Reset form dan refresh products
      resetForm();
      fetchProducts();
    } catch (error) {
      console.error('Error menyimpan produk:', error);
      setError('Gagal menyimpan produk');
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      stock: '',
      categoryId: '',
    });
    setIsEditing(false);
    setCurrentProductId(null);
  };

  const handleEdit = (product) => {
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price,
      stock: product.stock,
      categoryId: product.categoryId,
    });
    setIsEditing(true);
    setCurrentProductId(product.id);
  };

  const handleDelete = async (productId) => {
    // Gunakan dialog konfirmasi MUI daripada window.confirm
    try {
      await deleteProduct(productId);
      // Gunakan toast notification daripada alert
      fetchProducts();
    } catch (error) {
      console.error('Error menghapus produk:', error);
      setError('Gagal menghapus produk');
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
          <CircularProgress />
        </Box>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
          Kelola Produk
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}
        
        <Grid container spacing={4}>
          {/* Form Produk */}
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight="medium" gutterBottom>
                {isEditing ? 'Edit Produk' : 'Tambah Produk Baru'}
              </Typography>
              
              <Divider sx={{ mb: 3 }} />
              
              <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Nama Produk"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Deskripsi"
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      required
                      multiline
                      rows={3}
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Harga (Rp)"
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                      inputProps={{ min: 0, step: "0.01" }}
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={6}>
                    <TextField
                      fullWidth
                      label="Stok"
                      name="stock"
                      type="number"
                      value={formData.stock}
                      onChange={handleInputChange}
                      required
                      inputProps={{ min: 0 }}
                      variant="outlined"
                    />
                  </Grid>
                  
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Kategori</InputLabel>
                      <Select
                        name="categoryId"
                        value={formData.categoryId}
                        onChange={handleInputChange}
                        label="Kategori"
                      >
                        <MenuItem value="">
                          <em>Pilih Kategori</em>
                        </MenuItem>
                        {categories.map((category) => (
                          <MenuItem key={category.id} value={category.id}>
                            {category.name}
                          </MenuItem>
                        ))}
                      </Select>
                      <FormHelperText>Pilih kategori produk</FormHelperText>
                    </FormControl>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        startIcon={isEditing ? <SaveIcon /> : <AddCircleIcon />}
                        fullWidth
                      >
                        {isEditing ? 'Perbarui Produk' : 'Tambah Produk'}
                      </Button>
                      
                      {isEditing && (
                        <Button
                          type="button"
                          variant="outlined"
                          color="secondary"
                          startIcon={<CancelIcon />}
                          onClick={resetForm}
                        >
                          Batal
                        </Button>
                      )}
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </Paper>
          </Grid>
          
          {/* Daftar Produk */}
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight="medium" gutterBottom>
                Produk Anda
              </Typography>
              
              <Divider sx={{ mb: 3 }} />
              
              {products.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                  <Typography color="text.secondary">
                    Anda belum memiliki produk. Silakan tambahkan produk baru.
                  </Typography>
                </Box>
              ) : (
                <Grid container spacing={2}>
                  {products.map((product) => (
                    <Grid item xs={12} key={product.id}>
                      <Card variant="outlined">
                        <CardContent>
                          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Box>
                              <Typography variant="h6" component="h3">
                                {product.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {product.description}
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 3, mt: 2 }}>
                                <Typography variant="body2">
                                  <strong>Harga:</strong> Rp {product.price.toLocaleString('id-ID')}
                                </Typography>
                                <Typography variant="body2">
                                  <strong>Stok:</strong> {product.stock}
                                </Typography>
                              </Box>
                            </Box>
                            <Box>
                              <Button
                                startIcon={<EditIcon />}
                                onClick={() => handleEdit(product)}
                                color="primary"
                                sx={{ mr: 1 }}
                              >
                                Edit
                              </Button>
                              <Button
                                startIcon={<DeleteIcon />}
                                onClick={() => handleDelete(product.id)}
                                color="error"
                              >
                                Hapus
                              </Button>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </DashboardLayout>
  );
};

export default Seller;
