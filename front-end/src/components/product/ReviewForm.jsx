import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Rating, 
  Alert, 
  Paper 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Loading from '../common/Loading';

// This function should be in your auth utility
const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

const ReviewForm = ({ productId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!isAuthenticated()) {
      if (window.confirm('You need to login to submit a review. Would you like to login now?')) {
        navigate('/login', { state: { from: `/product/${productId}` } });
      }
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        process.env.REACT_APP_API_URL + '/reviews/',
        {
          productId,
          rating,
          comment
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      
      // Reset form
      setRating(5);
      setComment('');
      
      // Notify parent component
      if (onReviewSubmitted) {
        onReviewSubmitted();
      }
      
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to submit review. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={1} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
      <Typography variant="h6" gutterBottom fontWeight="medium">
        Write a Review
      </Typography>
      
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box component="form" onSubmit={handleSubmit}>
        <Box mb={3}>
          <Typography variant="body1" mb={1}>
            Your Rating
          </Typography>
          <Box display="flex" alignItems="center">
            <Rating
              name="product-rating"
              value={rating}
              onChange={(event, newValue) => {
                setRating(newValue);
              }}
              precision={1}
            />
            <Typography variant="body2" color="text.secondary" ml={1}>
              ({rating}/5)
            </Typography>
          </Box>
        </Box>
        
        <TextField
          id="comment"
          label="Your Review"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          multiline
          rows={4}
          fullWidth
          required
          placeholder="Tell others what you think about this product..."
          margin="normal"
          variant="outlined"
        />
        
        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </Button>
      </Box>
      
      {loading && <Loading />}
    </Paper>
  );
};

export default ReviewForm;
