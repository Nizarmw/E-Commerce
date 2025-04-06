import React, { useState } from 'react';
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
  Select
} from '@mui/material';
import {
  Search,
  FilterList,
  Add
} from '@mui/icons-material';

const Products = () => {
  const [categories, setCategories] = useState([]);

  React.useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch('/categories/'); // Replace with your API endpoint
        const data = await response.json();
        setCategories(data);
      } catch (error) {
        console.error('Failed to fetch categories:', error);
      }
    };

    fetchCategories();
  }, []);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [page, setPage] = useState(1);
  const productsPerPage = 6;

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
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Products
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage your product inventory
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
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
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

      {/* Product list would be dynamically populated here */}
      
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <Pagination 
          count={0} 
          page={page} 
          onChange={handlePageChange} 
          color="primary" 
        />
      </Box>
    </Container>
  );
};

export default Products;
