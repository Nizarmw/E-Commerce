import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
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
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Favorite,
  FavoriteBorder,
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/thumbs";
import PublicLayout from "../../layouts/PublicLayout";
import ReviewForm from "../../components/product/ReviewForm";
// import ReviewList from "../../components/product/ReviewList";
import { addToCart } from "../../redux/cartSlice";
import {
  getAllProducts,
  getProductById,
  // getProductReviews,
  // getRelatedProducts,
} from "../../services/products";
import ProductCard from "../../components/product/ProductCard";
import { formatPrice } from "../../utils/formatters";
import { addItemToCart } from "../../services/cart";
import { getUserInfo } from "../../utils/auth";
import ReviewList from "../../components/product/ReviewList";
import api from "../../services/api";

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
  const [product, setProduct] = useState(null);
  const [productImages, setProductImages] = useState([]);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviews, setReviews] = useState([]);
  // const [reviewsLoading, setReviewsLoading] = useState(true);
  // const [reviewsError, setReviewsError] = useState(null);

  const handleAddToCart = async (productId) => {
    // Add product to cart logic here
    const info = getUserInfo();
    const data = {
      product_id: productId,
      user_id: info.user_id,
      quantity,
    };

    await addItemToCart(data);
    alert("Product added to cart!");
  };

  const fetchProductData = async () => {
    setLoading(true);
    setError(null);
    try {
      const productData = await getProductById(id);
      setProduct(productData);

      const mockGallery = [productData.image_url];
      setProductImages(mockGallery);
    } catch (err) {
      console.error("Error fetching product:", err);
      setError("Failed to load product. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await getAllProducts();
      setRelatedProducts(response);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await api.get(`/reviews/${id}`);
      setReviews(response.data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductData();
    fetchProducts();
    fetchReviews();
  }, [id]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  if (error) {
    return <Typography>{error}</Typography>;
  }

  return (
    <PublicLayout>
      <Container maxWidth="lg" sx={{ my: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Box sx={{ position: "relative" }}>
              <Swiper
                navigation
                thumbs={{ swiper: thumbsSwiper }}
                modules={[Navigation, Thumbs]}
              >
                {productImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image}
                      alt={`${product.name} - ${index + 1}`}
                      style={{ width: "100%", height: "auto" }}
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
                {/* {productImages.map((image, index) => (
                  <SwiperSlide key={index}>
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      style={{ width: "100%", cursor: "pointer" }}
                    />
                  </SwiperSlide>
                ))} */}
              </Swiper>
            </Box>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box>
              <Typography variant="h4" gutterBottom>
                {product.name}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <Rating value={product.rating} precision={0.5} readOnly />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  ({product.reviewCount} reviews)
                </Typography>
              </Box>

              <Typography variant="h5" color="primary" sx={{ mb: 3 }}>
                {formatPrice(product.price)}
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
                  <IconButton
                    disabled={quantity <= 1}
                    onClick={() => setQuantity(quantity - 1)}
                  >
                    <RemoveIcon />
                  </IconButton>
                  <TextField
                    size="small"
                    value={quantity}
                    inputProps={{ readOnly: true }}
                    sx={{ width: 60, mx: 1 }}
                  />
                  <IconButton onClick={() => setQuantity(quantity + 1)}>
                    <AddIcon />
                  </IconButton>
                </Box>

                <IconButton color="primary">
                  {isWishlisted ? <Favorite /> : <FavoriteBorder />}
                </IconButton>
              </Box>

              <Button
                variant="contained"
                size="large"
                fullWidth
                onClick={() => handleAddToCart(product.id)}
                sx={{ mb: 3 }}
              >
                Add to Cart
              </Button>

              <Divider sx={{ my: 3 }} />

              <Box sx={{ width: "100%" }}>
                <Tabs value={tabValue} onChange={handleTabChange}>
                  <Tab label="Description" />
                  <Tab label="Reviews" />
                </Tabs>

                <TabPanel value={tabValue} index={0}>
                  <Typography>{product.description}</Typography>
                </TabPanel>

                <TabPanel value={tabValue} index={1}>
                  <ReviewList reviews={reviews} />
                  <ReviewForm productId={id} onReviewSubmitted={fetchReviews} />
                </TabPanel>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 8 }}>
          <Typography variant="h5" gutterBottom>
            Related Products
          </Typography>
          <Grid container spacing={3}>
            {relatedProducts.map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item.id}>
                <ProductCard product={item} />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Container>
    </PublicLayout>
  );
};

export default ProductDetail;
