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
  Grid,
  Chip,
  CardMedia,
  CardContent,
  Rating
} from '@mui/material';
import {
  Search,
  FilterList,
  Add
} from '@mui/icons-material';
import PublicLayout from '../../layouts/PublicLayout';
import { getAllProducts, searchProducts } from '../../services/products';
import { getAllCategories } from '../../services/categories';
import { Stack } from '@mui/system';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import FavoriteIcon from '@mui/icons-material/Favorite';

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

  // useEffect(() => {
  //   const fetchProducts = async () => {
  //     setLoading(true);
  //     try {
  //       const params = {
  //         page,
  //         limit: productsPerPage,
  //         search: searchQuery || undefined,
  //         category: categoryFilter !== 'All' ? categoryFilter : undefined
  //       };
        
  //       const response = await searchProducts(params);
  //       setProducts(response.products);
  //       setTotalPages(response.totalPages);
  //     } catch (error) {
  //       console.error('Failed to fetch products:', error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };

  //   fetchProducts();
  // }, [page, searchQuery, categoryFilter]);

    useEffect(() => {
      const fetchProducts = async () => {
        try {
          // Use the product service
          const response = await getAllProducts();
          setProducts(response);
        } catch (error) {
          console.error('Error fetching products:', error);
          // Use mock data as fallback if API fails
          setProducts([
            { 
              id: 1, 
              name: 'Premium Headphones', 
              price: 99.99, 
              rating: 4.5, 
              image: product1,
              isNew: true,
              discount: '20%'
            },
            { 
              id: 2, 
              name: 'Smart Watch Series X', 
              price: 149.99, 
              rating: 4.8,
              image: product2,
              isNew: false,
              discount: null
            },
            { 
              id: 3, 
              name: 'Wireless Earbuds Pro', 
              price: 199.99, 
              rating: 4.2,
              image: product3,
              isNew: true,
              discount: '15%'
            },
          ]);
        } finally {
          setLoading(false);
        }
      };
      
      fetchProducts();
    }, []);

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
            products.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    transition: 'transform 0.3s, box-shadow 0.3s',
                    '&:hover': {
                      transform: 'translateY(-8px)',
                      boxShadow: 6
                    },
                    borderRadius: 3,
                    overflow: 'hidden',
                    position: 'relative'
                  }}
                >
                  {/* ...existing product card content... */}
                  {product.isNew && (
                    <Chip 
                      label="NEW" 
                      color="secondary" 
                      size="small"
                      sx={{ 
                        position: 'absolute', 
                        top: 16, 
                        left: 16,
                        fontWeight: 'bold'
                      }} 
                    />
                  )}
                  {product.discount && (
                    <Chip 
                      label={`-${product.discount}`} 
                      color="error" 
                      size="small"
                      sx={{ 
                        position: 'absolute', 
                        top: 16, 
                        right: 16,
                        fontWeight: 'bold'
                      }} 
                    />
                  )}
                  <Box sx={{ position: 'relative' }}>
                    <CardMedia
                      component="img"
                      height="220"
                      image={product.image_url || `https://via.placeholder.com/300x200?text=${product.name}`}
                      alt={product.name}
                      sx={{
                        transition: 'transform 0.5s',
                        '&:hover': {
                          transform: 'scale(1.05)'
                        }
                      }}
                    />
                    <Box 
                      sx={{
                        position: 'absolute',
                        bottom: 0,
                        right: 0,
                        bgcolor: 'rgba(0,0,0,0.6)',
                        borderTopLeftRadius: 12,
                        p: 1
                      }}
                    >
                      {/* <Button 
                        size="small" 
                        sx={{ minWidth: 0, color: 'white' }}
                      >
                        <FavoriteIcon />
                      </Button> */}
                    </Box>
                  </Box>
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography gutterBottom variant="h6" component="div" fontWeight="medium">
                      {product.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Rating value={product.rating || 0} precision={0.5} size="small" readOnly />
                      <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                        ({product.rating || 0})
                      </Typography>
                    </Box>
                    <Typography variant="h6" color="primary" fontWeight="bold" sx={{ mb: 2 }}>
                      ${product.price?.toFixed(2) || '0.00'}
                    </Typography>
                    <Stack direction="row" spacing={1}>
                      <Button 
                        variant="contained" 
                        color="primary" 
                        fullWidth
                        startIcon={<ShoppingCartIcon />}
                        onClick={() => navigate('/cart')}  // Add this
                        sx={{ 
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 'medium'
                        }}
                      >
                        Add to Cart
                      </Button>
                      <Button 
                        variant="outlined" 
                        sx={{ 
                          borderRadius: 2,
                          textTransform: 'none'
                        }}
                        onClick={() => navigate(`/product/${product.id}`)}
                      >
                        Details
                      </Button>
                    </Stack>
                  </CardContent>
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
