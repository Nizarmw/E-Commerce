import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Button,
  Typography,
  Rating,
  Box,
  IconButton,
  Chip,
  Snackbar,
  Alert,
  Skeleton,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import FavoriteIcon from '@mui/icons-material/Favorite';

// Styled Card with hover effect
const StyledCard = styled(Card)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  transition: 'transform 0.3s ease, box-shadow 0.3s ease',
  '&:hover': {
    transform: 'translateY(-8px)',
    boxShadow: theme.shadows[8],
  },
}));

const ProductCard = ({ product, loading }) => {
  const [favorite, setFavorite] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    // Add to cart logic would go here
    setSnackbarOpen(true);
  };
  
  const handleFavoriteToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setFavorite(!favorite);
  };
  
  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  
  if (loading) {
    return (
      <StyledCard>
        <Skeleton variant="rectangular" height={200} />
        <CardContent>
          <Skeleton variant="text" height={30} />
          <Skeleton variant="text" width="60%" />
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1, mb: 1 }}>
            <Skeleton variant="text" width={120} />
          </Box>
          <Skeleton variant="rectangular" height={30} sx={{ mt: 1 }} />
        </CardContent>
        <CardActions>
          <Skeleton variant="rectangular" height={36} width="100%" />
        </CardActions>
      </StyledCard>
    );
  }
  
  // If no product is provided, return null
  if (!product) return null;
  
  const {
    id,
    name,
    price,
    image,
    rating = 4.5,
    reviewCount = 0,
    discount = 0,
    inStock = true,
  } = product;
  
  // Calculate discounted price
  const discountedPrice = discount > 0 ? price - (price * discount) / 100 : null;
  
  return (
    <>
      <StyledCard>
        <CardActionArea component={RouterLink} to={`/product/${id}`}>
          {/* Product Image */}
          <CardMedia
            component="img"
            height="200"
            image={image || 'https://via.placeholder.com/300x200?text=No+Image'}
            alt={name}
            sx={{ objectFit: 'cover' }}
          />
          
          {/* Discount Badge */}
          {discount > 0 && (
            <Chip
              label={`${discount}% OFF`}
              color="error"
              size="small"
              sx={{
                position: 'absolute',
                top: 10,
                right: 10,
                fontWeight: 'bold',
              }}
            />
          )}
          
          {/* Product Details */}
          <CardContent sx={{ flexGrow: 1 }}>
            <Typography gutterBottom variant="h6" component="div" noWrap>
              {name}
            </Typography>
            
            {/* Rating */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Rating
                name="read-only"
                value={rating}
                precision={0.5}
                size="small"
                readOnly
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                ({reviewCount})
              </Typography>
            </Box>
            
            {/* Price */}
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              {discountedPrice ? (
                <>
                  <Typography variant="h6" color="primary" fontWeight="bold">
                    Rp{discountedPrice.toLocaleString()}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ ml: 1, textDecoration: 'line-through' }}
                  >
                    Rp{price.toLocaleString()}
                  </Typography>
                </>
              ) : (
                <Typography variant="h6" color="primary" fontWeight="bold">
                  Rp{price.toLocaleString()}
                </Typography>
              )}
            </Box>
            
            {/* Stock Status */}
            {!inStock && (
              <Typography variant="body2" color="error" sx={{ mt: 1 }}>
                Out of Stock
              </Typography>
            )}
          </CardContent>
        </CardActionArea>
        
        {/* Actions */}
        <CardActions>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddShoppingCartIcon />}
            onClick={handleAddToCart}
            fullWidth
            disabled={!inStock}
            sx={{ borderRadius: 2 }}
          >
            Add to Cart
          </Button>
          <IconButton
            color="secondary"
            onClick={handleFavoriteToggle}
            aria-label={favorite ? 'Remove from favorites' : 'Add to favorites'}
            sx={{ ml: 1 }}
          >
            {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
          </IconButton>
        </CardActions>
      </StyledCard>
      
      {/* Notification when added to cart */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
      >
        <Alert onClose={handleCloseSnackbar} severity="success" variant="filled">
          Added to cart successfully!
        </Alert>
      </Snackbar>
    </>
  );
};

export default ProductCard;
