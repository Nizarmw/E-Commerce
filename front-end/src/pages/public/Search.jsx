import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Container, 
  Typography, 
  Grid, 
  Box, 
  Alert, 
  CircularProgress,
  Paper
} from '@mui/material';
import PublicLayout from '../../layouts/PublicLayout';
import ProductCard from '../../components/product/ProductCard';
import ProductFilter from '../../components/product/ProductFilter';
import { searchProducts, getAllProducts } from '../../services/products';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('min') || '';
  const maxPrice = searchParams.get('max') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Menggunakan fungsi searchProducts dari service
        const searchResults = await searchProducts({
          query,
          category,
          minPrice,
          maxPrice
        });
        setProducts(searchResults);
      } catch (error) {
        console.error('Error saat mencari produk:', error);
        setError('Gagal memuat produk. Silakan coba lagi nanti.');
        
        // Fallback ke semua produk jika pencarian gagal
        try {
          const allProducts = await getAllProducts();
          setProducts(allProducts);
        } catch (fallbackError) {
          console.error('Error saat memuat semua produk:', fallbackError);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [query, category, minPrice, maxPrice]);

  // Membuat teks rangkuman pencarian
  const buildSearchSummary = () => {
    let summary = 'Semua Produk';
    
    if (query) {
      summary = `Hasil pencarian untuk "${query}"`;
    }
    
    const filters = [];
    if (category) filters.push(`Kategori: ${category}`);
    if (minPrice && maxPrice) {
      filters.push(`Harga: Rp ${minPrice} - Rp ${maxPrice}`);
    } else if (minPrice) {
      filters.push(`Harga: Min Rp ${minPrice}`);
    } else if (maxPrice) {
      filters.push(`Harga: Max Rp ${maxPrice}`);
    }
    
    if (filters.length > 0) {
      summary += ` (${filters.join(', ')})`;
    }
    
    return summary;
  };

  return (
    <PublicLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 3 }}>
          Cari Produk
        </Typography>
        
        <ProductFilter />
        
        <Box sx={{ my: 4 }}>
          <Typography variant="h5" component="h2" gutterBottom>
            {buildSearchSummary()}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            {products.length} produk ditemukan
          </Typography>
        </Box>
        
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
            <CircularProgress />
          </Box>
        ) : error ? (
          <Alert severity="error" sx={{ my: 2 }}>
            {error}
          </Alert>
        ) : products.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.paper' }}>
            <Typography variant="h6" gutterBottom>
              Tidak ada produk yang ditemukan
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Coba sesuaikan kriteria pencarian atau filter Anda
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {products.map((product) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                <ProductCard product={product} />
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </PublicLayout>
  );
};

export default SearchPage;
