import React, { useState } from "react";
import {
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
  Button,
  Rating,
  Box,
  Skeleton,
} from "@mui/material";
import {
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  BrokenImage,
} from "@mui/icons-material";
import { Link } from "react-router-dom";

const formatPrice = (price) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
  }).format(price);
};

const ProductCard = ({ product }) => {
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        position: "relative",
      }}
    >
      {/* Wishlist button */}
      <IconButton
        sx={{
          position: "absolute",
          right: 8,
          top: 8,
          backgroundColor: "rgba(255, 255, 255, 0.8)",
          "&:hover": {
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          },
        }}
        // onClick={handleToggleWishlist}
      >
        {wishlisted ? <Favorite color="error" /> : <FavoriteBorder />}
      </IconButton>

      {/* Product Image */}
      <Box sx={{ position: "relative", paddingTop: "75%" }}>
        {isLoading && (
          <Skeleton
            variant="rectangular"
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        )}
        {imageError ? (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              bgcolor: "grey.100",
            }}
          >
            <BrokenImage sx={{ fontSize: 40, color: "grey.500" }} />
          </Box>
        ) : (
          <CardMedia
            component="img"
            image={product.image_url}
            alt={name}
            // onLoad={handleImageLoad}
            // onError={handleImageError}
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              objectFit: "cover",
            }}
          />
        )}
      </Box>

      {/* Product Info */}
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography
          variant="h6"
          component={Link}
          to={`/product/${product.id}`}
          sx={{
            textDecoration: "none",
            color: "inherit",
            "&:hover": {
              color: "primary.main",
            },
          }}
        >
          {product.name}
        </Typography>

        <Typography
          variant="h6"
          color="primary"
          sx={{ mt: 1, fontWeight: "bold" }}
        >
          {formatPrice(product.price)}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
          <Rating
            value={product.rating}
            precision={0.5}
            readOnly
            size="small"
          />
          <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
            {product.rating}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            mt: 1,
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
          }}
        >
          {product.description}
        </Typography>
      </CardContent>

      {/* Actions */}
      <CardActions sx={{ justifyContent: "space-between", p: 2 }}>
        <Button
          variant="contained"
          startIcon={<ShoppingCart />}
          // onClick={handleAddToCart}
          fullWidth
        >
          Add to Cart
        </Button>
      </CardActions>
    </Card>
  );
};

export default ProductCard;
