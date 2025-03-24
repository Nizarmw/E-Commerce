import React, { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Typography,
  Button,
  IconButton,
  Box,
  Rating,
  Chip,
  Skeleton,
  Tooltip,
  Collapse,
  styled
} from '@mui/material';
import {
  FavoriteBorder,
  Favorite,
  AddShoppingCart,
  ExpandMore as ExpandMoreIcon,
  Visibility
} from '@mui/icons-material';

const ExpandMore = styled((props) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const ProductCard = ({ product, loading }) => {
  const [expanded, setExpanded] = useState(false);
  const [favorite, setFavorite] = useState(false);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const toggleFavorite = () => {
    setFavorite(!favorite);
  };

  if (loading) {
    return (
      <Card sx={{ maxWidth: '100%', height: '100%' }}>
        <Skeleton variant="rectangular" width="100%" height={200} animation="wave" />
        <CardContent>
          <Skeleton variant="text" width="80%" height={30} animation="wave" />
          <Skeleton variant="text" width="40%" height={20} animation="wave" />
          <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
            <Skeleton variant="text" width="60%" height={25} animation="wave" />
          </Box>
        </CardContent>
        <CardActions>
          <Skeleton variant="rectangular" width={120} height={36} animation="wave" />
          <Skeleton variant="circular" width={36} height={36} animation="wave" sx={{ ml: 'auto' }} />
        </CardActions>
      </Card>
    );
  }

  if (!product) {
    return null;
  }

  const {
    id,
    name,
    price,
    originalPrice,
    discount,
    image,
    rating,
    reviewCount,
    description,
    isNew,
    stockStatus
  } = product;

  return (
    <Card 
      sx={{ 
        maxWidth: '100%', 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative'
      }}
    >
      {(discount > 0 || isNew) && (
        <Box sx={{ position: 'absolute', top: 10, left: 10, zIndex: 1, display: 'flex', flexDirection: 'column', gap: 1 }}>
          {discount > 0 && (
            <Chip 
              label={`-${discount}%`} 
              color="error" 
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          )}
          {isNew && (
            <Chip 
              label="NEW" 
              color="primary" 
              size="small"
              sx={{ fontWeight: 'bold' }}
            />
          )}
        </Box>
      )}
      
      <Box sx={{ position: 'relative' }}>
        <CardMedia
          component="img"
          height="200"
          image={image || 'https://via.placeholder.com/300x200?text=Product+Image'}
          alt={name}
          sx={{ objectFit: 'cover' }}
        />
        
        <Box 
          sx={{ 
            position: 'absolute', 
            top: 0, 
            left: 0, 
            width: '100%', 
            height: '100%', 
            background: 'rgba(0,0,0,0.03)', 
            opacity: 0, 
            transition: 'opacity 0.3s',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            '&:hover': { 
              opacity: 1 
            } 
          }}
        >
          <Tooltip title="Quick view">
            <IconButton 
              component={RouterLink} 
              to={`/products/${id}`}
              aria-label="view product"
              sx={{ 
                bgcolor: 'background.paper',
                '&:hover': { bgcolor: 'primary.main', color: 'white' },
              }}
            >
              <Visibility />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>
      
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography 
          variant="subtitle1" 
          component={RouterLink} 
          to={`/products/${id}`}
          sx={{ 
            fontWeight: 500, 
            mb: 1, 
            display: 'block',
            color: 'text.primary',
            textDecoration: 'none',
            '&:hover': { color: 'primary.main' }
          }}
        >
          {name}
        </Typography>
        
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
          <Rating value={rating} precision={0.5} size="small" readOnly />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 0.5 }}>
            ({reviewCount})
          </Typography>
        </Box>
        
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <Typography variant="h6" color="primary.main" sx={{ fontWeight: 600 }}>
            ${price.toFixed(2)}
          </Typography>
          {originalPrice && (
            <Typography variant="body2" color="text.secondary" sx={{ textDecoration: 'line-through' }}>
              ${originalPrice.toFixed(2)}
            </Typography>
          )}
        </Box>
        
        {stockStatus && (
          <Typography 
            variant="body2" 
            sx={{ 
              mt: 1,
              color: stockStatus === 'In Stock' ? 'success.main' : 
                     stockStatus === 'Low Stock' ? 'warning.main' : 'error.main'
            }}
          >
            {stockStatus}
          </Typography>
        )}
      </CardContent>
      
      <CardActions disableSpacing>
        <Button 
          variant="contained" 
          size="small" 
          startIcon={<AddShoppingCart />}
          sx={{ borderRadius: '20px' }}
        >
          Add to Cart
        </Button>
        
        <IconButton 
          aria-label={favorite ? 'remove from favorites' : 'add to favorites'}
          onClick={toggleFavorite}
          color={favorite ? 'secondary' : 'default'}
        >
          {favorite ? <Favorite /> : <FavoriteBorder />}
        </IconButton>
        
        {description && (
          <ExpandMore
            expand={expanded}
            onClick={handleExpandClick}
            aria-expanded={expanded}
            aria-label="show more"
          >
            <ExpandMoreIcon />
          </ExpandMore>
        )}
      </CardActions>
      
      {description && (
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography paragraph>Description:</Typography>
            <Typography paragraph variant="body2" color="text.secondary">
              {description}
            </Typography>
          </CardContent>
        </Collapse>
      )}
    </Card>
  );
};

export default ProductCard;
