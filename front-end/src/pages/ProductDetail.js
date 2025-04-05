import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../redux/cartSlice";
import axios from "axios";
import Layout from "../components/Layout";
import ReviewForm from "../components/ReviewForm";
import ReviewList from "../components/ReviewList";
import {
  Box,
  Container,
  Grid,
  Typography,
  Button,
  Divider,
  Paper,
  Tabs,
  Tab,
  Rating,
  Chip,
  IconButton,
  Breadcrumbs,
  Skeleton,
  Snackbar,
  Alert,
  Stack,
  Card,
  CardMedia,
  CardContent,
  CardActionArea,
  Slide,
  Zoom,
  Tooltip,
  CircularProgress
} from "@mui/material";
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  ShoppingCart as ShoppingCartIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  CompareArrows as CompareIcon,
  ZoomIn as ZoomInIcon
} from "@mui/icons-material";
import { styled } from "@mui/material/styles";

// Styled components for the gallery
const MainImage = styled(Box)(({ theme }) => ({
  width: "100%",
  height: 400,
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  position: "relative",
  marginBottom: theme.spacing(2),
  cursor: "zoom-in",
  boxShadow: theme.shadows[2],
  "&:hover .zoom-icon": {
    opacity: 1,
  },
  [theme.breakpoints.down("md")]: {
    height: 300,
  },
}));

const ThumbnailContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  gap: theme.spacing(1),
  marginBottom: theme.spacing(3),
}));

const Thumbnail = styled(Box)(({ theme, selected }) => ({
  width: 80,
  height: 80,
  borderRadius: theme.shape.borderRadius,
  overflow: "hidden",
  cursor: "pointer",
  transition: "all 0.3s ease",
  border: selected ? `2px solid ${theme.palette.primary.main}` : "2px solid transparent",
  opacity: selected ? 1 : 0.7,
  "&:hover": {
    opacity: 1,
    transform: "translateY(-2px)",
  },
}));

// Quantity control component
const QuantityControl = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  border: `1px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  width: "fit-content",
  overflow: "hidden",
}));

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reviewsError, setReviewsError] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState(0);
  const [showNotification, setShowNotification] = useState(false);
  const [favorite, setFavorite] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showZoomModal, setShowZoomModal] = useState(false);

  const dispatch = useDispatch();

  // Mock multiple product images since API might not have them
  const [productImages, setProductImages] = useState([]);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`http://localhost:8080/api/products/${id}`);
        setProduct(response.data);
        
        // Create mock gallery images for demo purposes
        // In a real app, these would come from the API
        const mockGallery = [
          response.data.imageUrl || "https://via.placeholder.com/600x400?text=Product+Image",
          "https://via.placeholder.com/600x400?text=Side+View",
          "https://via.placeholder.com/600x400?text=Back+View",
          "https://via.placeholder.com/600x400?text=Detail+View",
        ];
        setProductImages(mockGallery);
        
        // Fetch related products based on category
        if (response.data.categoryId) {
          const relatedResponse = await axios.get(`http://localhost:8080/api/products?category=${response.data.categoryId}&limit=8`);
          // Filter out the current product
          setRelatedProducts(relatedResponse.data.filter(p => p.id !== id));
        }
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    const fetchReviews = async () => {
      setReviewsLoading(true);
      setReviewsError(null);
      try {
        const response = await axios.get(`http://localhost:8080/api/products/${id}/reviews`);
        setReviews(response.data);
      } catch (err) {
        console.error("Error fetching reviews:", err);
        setReviewsError("Failed to load reviews.");
      } finally {
        setReviewsLoading(false);
      }
    };

    fetchProduct();
    fetchReviews();
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      dispatch(addToCart({ ...product, quantity }));
      setShowNotification(true);
    }
  };

  const handleQuantityChange = (newQuantity) => {
    if (newQuantity >= 1 && newQuantity <= 10) {
      setQuantity(newQuantity);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleReviewSubmitted = () => {
    // Refresh reviews after a new one is submitted
    const fetchReviews = async () => {
      setReviewsLoading(true);
      try {
        const response = await axios.get(`http://localhost:8080/api/products/${id}/reviews`);
        setReviews(response.data);
      } catch (err) {
        console.error("Error refreshing reviews:", err);
      } finally {
        setReviewsLoading(false);
      }
    };
    
    fetchReviews();
  };

  const handleCloseNotification = () => {
    setShowNotification(false);
  };

  const handleFavoriteToggle = () => {
    setFavorite(!favorite);
  };

  // Product gallery loading skeleton
  const GallerySkeleton = () => (
    <Box>
      <Skeleton variant="rectangular" height={400} sx={{ borderRadius: 1, mb: 2 }} />
      <Box sx={{ display: "flex", gap: 1 }}>
        {[1, 2, 3, 4].map((item) => (
          <Skeleton key={item} variant="rectangular" width={80} height={80} sx={{ borderRadius: 1 }} />
        ))}
      </Box>
    </Box>
  );

  // Product info loading skeleton
  const ProductInfoSkeleton = () => (
    <Box>
      <Skeleton variant="text" height={40} width="80%" />
      <Box sx={{ my: 2 }}>
        <Skeleton variant="text" width={120} height={30} />
      </Box>
      <Skeleton variant="text" height={60} width="40%" />
      <Skeleton variant="text" height={100} />
      <Skeleton variant="text" height={100} />
      <Box sx={{ my: 2 }}>
        <Skeleton variant="rectangular" height={50} width={180} />
      </Box>
      <Box sx={{ display: "flex", gap: 2 }}>
        <Skeleton variant="rectangular" height={50} width="40%" />
        <Skeleton variant="rectangular" height={50} width="40%" />
      </Box>
    </Box>
  );

  if (loading) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Box sx={{ mb: 4 }}>
            <Skeleton variant="text" width={150} height={30} />
          </Box>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <GallerySkeleton />
            </Grid>
            <Grid item xs={12} md={6}>
              <ProductInfoSkeleton />
            </Grid>
          </Grid>
        </Container>
      </Layout>
    );
  }

  if (error || !product) {
    return (
      <Layout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Paper sx={{ p: 4, textAlign: "center", borderRadius: 2 }}>
            <Typography variant="h5" color="error" gutterBottom>
              {error || "Product not found"}
            </Typography>
            <Button
              component={Link}
              to="/"
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
            >
              Back to Home
            </Button>
          </Paper>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        {/* Breadcrumb Navigation */}
        <Breadcrumbs sx={{ mb: 3 }}>
          <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
            Home
          </Link>
          <Link to="/products" style={{ textDecoration: "none", color: "inherit" }}>
            Products
          </Link>
          <Typography color="text.primary">{product.name}</Typography>
        </Breadcrumbs>

        {/* Product Details Section */}
        <Paper sx={{ mb: 6, overflow: "hidden", borderRadius: 2 }}>
          <Grid container>
            {/* Product Gallery */}
            <Grid item xs={12} md={6} sx={{ p: 3 }}>
              <MainImage>
                <Box
                  component="img"
                  src={productImages[selectedImage]}
                  alt={product.name}
                  sx={{
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover",
                    transition: "transform 0.3s ease",
                    "&:hover": {
                      transform: "scale(1.05)",
                    },
                  }}
                  onClick={() => setShowZoomModal(true)}
                />
                <Box
                  className="zoom-icon"
                  sx={{
                    position: "absolute",
                    top: 10,
                    right: 10,
                    backgroundColor: "rgba(255,255,255,0.8)",
                    borderRadius: "50%",
                    p: 1,
                    opacity: 0,
                    transition: "opacity 0.3s ease",
                  }}
                >
                  <ZoomInIcon />
                </Box>
              </MainImage>
              
              <ThumbnailContainer>
                {productImages.map((image, index) => (
                  <Thumbnail
                    key={index}
                    selected={selectedImage === index}
                    onClick={() => setSelectedImage(index)}
                  >
                    <Box
                      component="img"
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      sx={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  </Thumbnail>
                ))}
              </ThumbnailContainer>
              
              {/* Action buttons below gallery */}
              <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                <Tooltip title={favorite ? "Remove from Wishlist" : "Add to Wishlist"}>
                  <IconButton
                    color={favorite ? "secondary" : "default"}
                    onClick={handleFavoriteToggle}
                    sx={{ 
                      border: "1px solid", 
                      borderColor: "divider",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "scale(1.1)",
                      } 
                    }}
                  >
                    {favorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                  </IconButton>
                </Tooltip>
                <Tooltip title="Share Product">
                  <IconButton
                    sx={{ 
                      border: "1px solid", 
                      borderColor: "divider",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "scale(1.1)",
                      } 
                    }}
                  >
                    <ShareIcon />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Compare">
                  <IconButton
                    sx={{ 
                      border: "1px solid", 
                      borderColor: "divider",
                      transition: "transform 0.2s",
                      "&:hover": {
                        transform: "scale(1.1)",
                      } 
                    }}
                  >
                    <CompareIcon />
                  </IconButton>
                </Tooltip>
              </Box>
            </Grid>

            {/* Product Information */}
            <Grid item xs={12} md={6} sx={{ p: 3, bgcolor: "background.paper" }}>
              <Box sx={{ mb: 2, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <Typography variant="h4" component="h1" fontWeight="bold">
                  {product.name}
                </Typography>
                {product.discount > 0 && (
                  <Chip
                    label={`${product.discount}% OFF`}
                    color="error"
                    size="medium"
                    sx={{ fontWeight: "bold" }}
                  />
                )}
              </Box>
              
              <Box sx={{ mb: 2, display: "flex", alignItems: "center" }}>
                <Rating 
                  value={reviews.length > 0 
                    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
                    : 0
                  } 
                  precision={0.5} 
                  readOnly 
                />
                <Typography variant="body2" sx={{ ml: 1 }}>
                  ({reviews.length} reviews)
                </Typography>
              </Box>
              
              <Box sx={{ mb: 3 }}>
                <Typography variant="h4" color="primary" fontWeight="bold">
                  Rp {product.price.toLocaleString("id-ID")}
                </Typography>
                {product.discount > 0 && (
                  <Typography 
                    variant="body1" 
                    color="text.secondary" 
                    sx={{ textDecoration: "line-through" }}
                  >
                    Rp {(product.price * (1 + product.discount / 100)).toLocaleString("id-ID")}
                  </Typography>
                )}
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              <Typography variant="body1" sx={{ mb: 3 }}>
                {product.description}
              </Typography>
              
              {/* Additional product details */}
              <Box sx={{ mb: 3 }}>
                <Grid container spacing={2}>
                  <Grid item xs={4} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      SKU:
                    </Typography>
                  </Grid>
                  <Grid item xs={8} sm={9}>
                    <Typography variant="body2">
                      {product.id || "N/A"}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={4} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Category:
                    </Typography>
                  </Grid>
                  <Grid item xs={8} sm={9}>
                    <Typography variant="body2">
                      {product.category?.name || "Uncategorized"}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={4} sm={3}>
                    <Typography variant="body2" color="text.secondary">
                      Availability:
                    </Typography>
                  </Grid>
                  <Grid item xs={8} sm={9}>
                    <Chip 
                      label={product.stock > 0 ? "In Stock" : "Out of Stock"} 
                      color={product.stock > 0 ? "success" : "error"}
                      size="small"
                    />
                  </Grid>
                </Grid>
              </Box>
              
              <Divider sx={{ my: 2 }} />
              
              {/* Quantity selector */}
              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" gutterBottom>
                  Quantity:
                </Typography>
                <QuantityControl>
                  <IconButton 
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    size="small"
                  >
                    <RemoveIcon fontSize="small" />
                  </IconButton>
                  <Typography 
                    sx={{ 
                      width: 40, 
                      textAlign: "center",
                      userSelect: "none",
                    }}
                  >
                    {quantity}
                  </Typography>
                  <IconButton 
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= 10 || quantity >= product.stock}
                    size="small"
                  >
                    <AddIcon fontSize="small" />
                  </IconButton>
                </QuantityControl>
              </Box>
              
              {/* Action buttons */}
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  startIcon={<ShoppingCartIcon />}
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  fullWidth
                  sx={{ 
                    py: 1.5,
                    flex: { xs: "1 0 100%", sm: "1 1 auto" },
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateY(-3px)",
                    }
                  }}
                >
                  Add to Cart
                </Button>
                <Button
                  component={Link}
                  to="/checkout"
                  variant="outlined"
                  color="primary"
                  size="large"
                  fullWidth
                  disabled={product.stock <= 0}
                  sx={{ 
                    py: 1.5, 
                    flex: { xs: "1 0 100%", sm: "1 1 auto" },
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "translateY(-3px)",
                    }
                  }}
                >
                  Buy Now
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        {/* Product details tabs */}
        <Paper sx={{ mb: 6, borderRadius: 2 }}>
          <Tabs
            value={activeTab}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
            sx={{ borderBottom: 1, borderColor: "divider" }}
          >
            <Tab label="Description" />
            <Tab label="Specifications" />
            <Tab label={`Reviews (${reviews.length})`} />
            <Tab label="Shipping & Returns" />
          </Tabs>
          
          <Box sx={{ p: 3 }}>
            {/* Description Tab */}
            {activeTab === 0 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Product Description
                </Typography>
                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                  {product.description || "No detailed description available for this product."}
                  
                  {/* Example extended description - would come from API in real app */}
                  {`\n\nThis high-quality product is designed to meet all your needs with premium materials and expert craftsmanship. Our team has spent countless hours perfecting every detail to ensure the best user experience.\n\nFeatures:\n- Premium quality materials\n- Durable construction\n- Easy to use\n- Versatile application`}
                </Typography>
              </Box>
            )}
            
            {/* Specifications Tab */}
            {activeTab === 1 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Product Specifications
                </Typography>
                
                {/* Specs would come from API in real app */}
                <Grid container spacing={2} sx={{ mt: 2 }}>
                  <Grid item xs={12} sm={6}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Dimensions
                      </Typography>
                      <Typography variant="body1">
                        10 × 20 × 5 cm
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Weight
                      </Typography>
                      <Typography variant="body1">
                        0.5 kg
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Material
                      </Typography>
                      <Typography variant="body1">
                        Premium quality
                      </Typography>
                    </Paper>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Paper variant="outlined" sx={{ p: 2 }}>
                      <Typography variant="subtitle2" color="text.secondary">
                        Color
                      </Typography>
                      <Typography variant="body1">
                        Multiple options
                      </Typography>
                    </Paper>
                  </Grid>
                </Grid>
              </Box>
            )}
            
            {/* Reviews Tab */}
            {activeTab === 2 && (
              <Box>
                <Box sx={{ mb: 4 }}>
                  <Typography variant="h6" gutterBottom>
                    Customer Reviews
                  </Typography>
                  <ReviewList
                    reviews={reviews}
                    loading={reviewsLoading}
                    error={reviewsError}
                  />
                </Box>
                
                <Divider sx={{ my: 3 }} />
                
                <Typography variant="h6" gutterBottom>
                  Write a Review
                </Typography>
                <ReviewForm productId={id} onReviewSubmitted={handleReviewSubmitted} />
              </Box>
            )}
            
            {/* Shipping Tab */}
            {activeTab === 3 && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Shipping Information
                </Typography>
                <Typography variant="body1" paragraph>
                  We ship to all major cities in Indonesia using trusted courier services. Standard shipping typically takes 2-4 business days, while express shipping is available for 1-2 business days delivery.
                </Typography>
                
                <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
                  Return Policy
                </Typography>
                <Typography variant="body1">
                  If you're not completely satisfied with your purchase, you can return it within 30 days for a full refund. The product must be unused and in the same condition that you received it, in the original packaging.
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Typography variant="h5" component="h2" gutterBottom sx={{ fontWeight: "bold" }}>
              Related Products
            </Typography>
            <Grid container spacing={3}>
              {relatedProducts.slice(0, 4).map((relatedProduct) => (
                <Grid item key={relatedProduct.id} xs={12} sm={6} md={3}>
                  <Zoom in={true} style={{ transitionDelay: '100ms' }}>
                    <Card 
                      sx={{ 
                        height: "100%",
                        transition: "transform 0.3s ease, box-shadow 0.3s ease",
                        "&:hover": {
                          transform: "translateY(-8px)",
                          boxShadow: 6,
                        }
                      }}
                    >
                      <CardActionArea component={Link} to={`/product/${relatedProduct.id}`}>
                        <CardMedia
                          component="img"
                          height="180"
                          image={relatedProduct.imageUrl || "https://via.placeholder.com/180x180?text=No+Image"}
                          alt={relatedProduct.name}
                        />
                        <CardContent>
                          <Typography variant="subtitle1" component="div" noWrap>
                            {relatedProduct.name}
                          </Typography>
                          <Typography variant="h6" color="primary" sx={{ fontWeight: "bold", mt: 1 }}>
                            Rp {relatedProduct.price.toLocaleString("id-ID")}
                          </Typography>
                        </CardContent>
                      </CardActionArea>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Box>
        )}
      </Container>

      {/* Add to Cart Notification */}
      <Snackbar
        open={showNotification}
        autoHideDuration={3000}
        onClose={handleCloseNotification}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        TransitionComponent={Slide}
      >
        <Alert
          onClose={handleCloseNotification}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {product.name} has been added to your cart!
        </Alert>
      </Snackbar>

      {/* Zoom Modal (simplified, real implementation would use a proper modal) */}
      {showZoomModal && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0,0,0,0.9)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            cursor: "zoom-out",
          }}
          onClick={() => setShowZoomModal(false)}
        >
          <Box
            component="img"
            src={productImages[selectedImage]}
            alt={product.name}
            sx={{
              maxWidth: "90%",
              maxHeight: "90%",
              objectFit: "contain",
            }}
          />
        </Box>
      )}
    </Layout>
  );
}
