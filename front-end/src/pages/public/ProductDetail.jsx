import React, { useState } from 'react';
import {
  Container,
  Grid,
  Box,
  Typography,
  Button,
  Rating,
  Tabs,
  Tab,
  TextField,
  Divider,
  IconButton,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Favorite,
  FavoriteBorder,
} from '@mui/icons-material';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Thumbs } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import { useParams } from 'react-router-dom';
import { PublicLayout } from '../../layouts';
import { ProductCard } from '../../components/product';
import { formatPrice } from '../../utils/formatters';

const TabPanel = ({ children, value, index, ...other }) => (
  <div hidden={value !== index} {...other}>
    {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
  </div>
);

const ProductDetail = () => {
  const { id } = useParams();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [tabValue, setTabValue] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const handleQuantityChange = (amount) => {
    const newQuantity = quantity + amount;
    if (newQuantity >= 1) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    console.log('Adding to cart:', { id, quantity });
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const toggleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  // Mock data - replace with API calls
  const product = {
    name: 'Product Name',
    price: 1500000,
    rating: 4.5,
    reviewCount: 128,
    description: 'Detailed product description goes here...',
    images: [
      '/path/to/image1.jpg',
      '/path/to/image2.jpg',
      '/path/to/image3.jpg',
    ],
    specs: [
      { label: 'Brand', value: 'Brand Name' },
      { label: 'Material', value: 'Premium Material' },
      { label: 'Warranty', value: '1 Year' },
    ],
  };

  return (
    <PublicLayout>
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Grid container spacing={4}>
          {/* Image Gallery */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: 'relative' }}>
              <Swiper
                navigation
                thumbs={{ swiper: thumbsSwiper }}
                modules={[Navigation, Thumbs]}
              >
                {product.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      style={{ width: '100%', height: 'auto' }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
              <Swiper
                onSwiper={setThumbsSwiper}
                spaceBetween={10}
                slidesPerView={4}
                watchSlidesProgress
              >
                {product.images.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      style={{ width: '100%', cursor: 'pointer' }}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </Box>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h4" gutterBottom>
                {product.name}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Rating value={product.rating} precision={0.5} readOnly />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  ({product.reviewCount} reviews)
                </Typography>
              </Box>

              <Typography variant="h5" color="primary" sx={{ mb: 3 }}>
                {formatPrice(product.price)}
              </Typography>

              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                  <IconButton
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <TextField
                    size="small"
                    value={quantity}
                    inputProps={{ readOnly: true }}
                    sx={{ width: 60, mx: 1 }}
                  />
                  <IconButton onClick={() => handleQuantityChange(1)}>
                    <AddIcon />
                  </IconButton>
                </Box>

                <IconButton onClick={toggleWishlist} color="primary">
                  {isWishlisted ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
              </Box>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={handleAddToCart}
                sx={{ mb: 3 }}
              >
                Add to Cart
              </Button>

              <Divider sx={{ my: 3 }} />

              {/* Tabs */}
              <Box sx={{ width: '100%' }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab label="Description" />
                  <Tab label="Specifications" />
                  <Tab label="Reviews" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                  <Typography>{product.description}</Typography>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  <Grid container spacing={2}>
                    {product.specs.map((spec, index) => (
                      <Grid item xs={12} key={index}>
                        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                          <Typography variant="body2" color="text.secondary">
                            {spec.label}
                          </Typography>
                          <Typography variant="body2">{spec.value}</Typography>
                        </Box>
                      </Grid>
                    ))}
                  </Grid>
                </TabPanel>

                <TabPanel value={tabValue} index={2}>
                  {/* Reviews component would go here */}
                  <Typography>Reviews coming soon...</Typography>
                </TabPanel>
              </Box>
            </Box>
          </Grid>
        </Grid>

        {/* Related Products */}
        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" gutterBottom>
            Related Products
          </Typography>
          <Grid container spacing={3}>
            {[1, 2, 3, 4].map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item}>
                <ProductCard />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </PublicLayout>
  );
};

export default ProductDetail;
