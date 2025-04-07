import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  Container,
  Typography,
  TextField,
  InputAdornment,
  Pagination,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid
} from '@mui/material';
import {
  Search,
  FilterList,
  Add
} from '@mui/icons-material';
import PublicLayout from '../../layouts/PublicLayout';
import { searchProducts } from '../../services/products';
import { getAllCategories } from '../../services/categories';

const Products = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [page, setPage] = useState(1);
  const productsPerPage = 6;

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getAllCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = {
          page,
          limit: productsPerPage,
          search: searchQuery || undefined,
          category: categoryFilter !== 'All' ? categoryFilter : undefined
        };
        
        const response = await searchProducts(params);
        setProducts(response.products);
        setTotalPages(response.totalPages);
      } catch (error) {
        console.error('Failed to fetch products:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, searchQuery, categoryFilter]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
    setPage(1);
  };

  const handleCategoryChange = (event) => {
    setCategoryFilter(event.target.value);
    setPage(1);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  return (
    <PublicLayout>
      <Container maxWidth="xl">
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Products
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Explore our collection of products
          </Typography>
        </Box>

        <Card sx={{ mb: 4 }}>
          <Box sx={{ p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 2 }}>
            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', flex: 1 }}>
              <TextField
                size="small"
                placeholder="Search products"
                value={searchQuery}
                onChange={handleSearchChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search fontSize="small" />
                    </InputAdornment>
                  ),
                }}
                sx={{ width: { xs: '100%', sm: '300px' } }}
              />
              
              <FormControl sx={{ minWidth: 150 }} size="small">
                <InputLabel id="category-filter-label">Category</InputLabel>
                <Select
                  labelId="category-filter-label"
                  value={categoryFilter}
                  label="Category"
                  onChange={handleCategoryChange}
                >
                  <MenuItem value="All">All Categories</MenuItem>
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.name}>
                      {category.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button 
                variant="outlined" 
                startIcon={<FilterList />}
                size="small"
              >
                More Filters
              </Button>
              <Button 
                variant="contained" 
                startIcon={<Add />}
                size="small"
              >
                Add Product
              </Button>
            </Box>
          </Box>
        </Card>

        {/* Product List */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {loading ? (
            // Add loading skeleton here if needed
            <Typography>Loading...</Typography>
          ) : products.length > 0 ? (
            products.map(product => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                {/* ProductCard component would go here */}
                <Card>
                  <Typography>{product.name}</Typography>
                </Card>
              </Grid>
            ))
          ) : (
            <Box sx={{ width: '100%', textAlign: 'center', py: 4 }}>
              <Typography variant="h6" color="textSecondary">
                No products found
              </Typography>
            </Box>
          )}
        </Grid>
        
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination 
            count={totalPages} 
            page={page} 
            onChange={handlePageChange} 
            color="primary" 
          />
        </Box>
      </Container>
    </PublicLayout>
  );
};

export default Products;
