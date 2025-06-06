import React from "react";
import { Box, Typography, Rating, Divider, Avatar, Stack } from "@mui/material";

// Fungsi escape karakter HTML sederhana
function escapeHTML(str) {
  if (!str) return '';
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const ReviewList = ({ reviews }) => {
  if (!reviews || reviews.length === 0) {
    return <Typography>No reviews yet.</Typography>;
  }

  return (
    <Box>
      {reviews.map((review, index) => (
        <Box key={index} sx={{ mb: 4 }}>
          <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
            <Avatar>{review.user?.name?.charAt(0).toUpperCase() || "U"}</Avatar>
            <Box>
              <Typography variant="subtitle1" fontWeight={600}>
                {review.user?.name || "Anonymous"}
              </Typography>
              <Rating
                value={review.rating}
                precision={0.5}
                readOnly
                size="small"
              />
            </Box>
          </Stack>
          <Typography
            variant="body1"
            sx={{ ml: 7 }}
            dangerouslySetInnerHTML={{ __html: escapeHTML(review.comment) }}
          />

          <Divider sx={{ my: 2 }} />
        </Box>
      ))}
    </Box>
  );
};

export default ReviewList;
