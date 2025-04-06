import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Slider,
  Chip,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
} from '@mui/material';
import { ExpandMore } from '@mui/icons-material';

const categories = [
  { id: 'electronics', label: 'Electronics' },
  { id: 'clothing', label: 'Clothing' },
  { id: 'books', label: 'Books' },
  { id: 'home', label: 'Home & Living' },
];

const ProductFilter = ({ onFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [expanded, setExpanded] = useState(['categories', 'price']);

  const handleCategoryChange = (categoryId) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter(id => id !== categoryId)
      : [...selectedCategories, categoryId];
    
    setSelectedCategories(newCategories);
    onFilterChange?.({ categories: newCategories, priceRange });
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
    onFilterChange?.({ categories: selectedCategories, priceRange: newValue });
  };

  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpanded(isExpanded 
      ? [...expanded, panel]
      : expanded.filter(item => item !== panel)
    );
  };

  const handleChipDelete = (categoryId) => {
    handleCategoryChange(categoryId);
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setPriceRange([0, 10000000]);
    onFilterChange?.({ categories: [], priceRange: [0, 10000000] });
  };

  const formatPrice = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <Paper sx={{ p: 2 }}>
      <Box sx={{ mb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h6">Filters</Typography>
        <Button 
          size="small" 
          onClick={clearFilters}
          disabled={selectedCategories.length === 0 && priceRange[0] === 0 && priceRange[1] === 10000000}
        >
          Clear All
        </Button>
      </Box>

      {selectedCategories.length > 0 && (
        <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 1 }}>
          {selectedCategories.map(categoryId => (
            <Chip
              key={categoryId}
              label={categories.find(cat => cat.id === categoryId)?.label}
              onDelete={() => handleChipDelete(categoryId)}
              color="primary"
              variant="outlined"
            />
          ))}
        </Box>
      )}

      <Accordion 
        expanded={expanded.includes('categories')}
        onChange={handleAccordionChange('categories')}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Categories</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <FormGroup>
            {categories.map(category => (
              <FormControlLabel
                key={category.id}
                control={
                  <Checkbox
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => handleCategoryChange(category.id)}
                  />
                }
                label={category.label}
              />
            ))}
          </FormGroup>
        </AccordionDetails>
      </Accordion>

      <Accordion 
        expanded={expanded.includes('price')}
        onChange={handleAccordionChange('price')}
      >
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Price Range</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Box sx={{ px: 2 }}>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              valueLabelFormat={formatPrice}
              min={0}
              max={10000000}
              step={100000}
            />
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between',
              mt: 1,
              color: 'text.secondary',
              fontSize: '0.875rem'
            }}>
              <span>{formatPrice(priceRange[0])}</span>
              <span>{formatPrice(priceRange[1])}</span>
            </Box>
          </Box>
        </AccordionDetails>
      </Accordion>
    </Paper>
  );
};

export default ProductFilter;
