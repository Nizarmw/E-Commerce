import React, { useState } from 'react';
import {
  Box,
  Grid,
  List,
  ListItem,
  ToggleButtonGroup,
  ToggleButton,
  FormControl,
  Select,
  MenuItem,
  InputLabel,
  Pagination,
  Stack,
} from '@mui/material';
import { GridView, ViewList } from '@mui/icons-material';
import ProductCard from './ProductCard';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Rating' },
];

const ProductList = ({ products = [], loading = false }) => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('newest');
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;

  const handleViewChange = (event, newView) => {
    if (newView !== null) {
      setViewMode(newView);
    }
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // Calculate pagination
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const displayedProducts = products.slice(startIndex, endIndex);
  const totalPages = Math.ceil(products.length / itemsPerPage);

  const renderGridView = () => (
    <Grid container spacing={3}>
      {displayedProducts.map((product) => (
        <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
          <ProductCard {...product} />
        </Grid>
      ))}
    </Grid>
  );

  const renderListView = () => (
    <List sx={{ width: '100%' }}>
      {displayedProducts.map((product) => (
        <ListItem key={product.id} sx={{ py: 2 }}>
          <Box sx={{ width: '100%' }}>
            <ProductCard {...product} variant="horizontal" />
          </Box>
        </ListItem>
      ))}
    </List>
  );

  return (
    <Stack spacing={3}>
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        mb: 2 
      }}>
        <ToggleButtonGroup
          value={viewMode}
          exclusive
          onChange={handleViewChange}
          aria-label="view mode"
        >
          <ToggleButton value="grid" aria-label="grid view">
            <GridView />
          </ToggleButton>
          <ToggleButton value="list" aria-label="list view">
            <ViewList />
          </ToggleButton>
        </ToggleButtonGroup>

        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="sort-select-label">Sort By</InputLabel>
          <Select
            labelId="sort-select-label"
            value={sortBy}
            label="Sort By"
            onChange={handleSortChange}
          >
            {sortOptions.map((option) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      {viewMode === 'grid' ? renderGridView() : renderListView()}

      {totalPages > 1 && (
        <Box sx={{ 
          display: 'flex',
          justifyContent: 'center',
          mt: 4 
        }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={handlePageChange}
            color="primary"
            size="large"
          />
        </Box>
      )}
    </Stack>
  );
};

export default ProductList;
