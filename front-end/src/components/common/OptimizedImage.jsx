import React, { useState } from 'react';
import { Box, Skeleton } from '@mui/material';

const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  quality = 75,
  blur = false,
  sx = {},
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Generate optimized image URL
  const optimizedSrc = (url) => {
    const imageUrl = new URL(url);
    imageUrl.searchParams.set('q', quality);
    if (blur) imageUrl.searchParams.set('blur', 10);
    return imageUrl.toString();
  };

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setIsLoading(false);
    setError(true);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: width,
        height: height,
        overflow: 'hidden',
        ...sx,
      }}
    >
      {isLoading && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
        />
      )}
      
      <img
        src={optimizedSrc(src)}
        alt={alt}
        loading="lazy"
        onLoad={handleLoad}
        onError={handleError}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          display: isLoading ? 'none' : 'block',
          opacity: error ? 0 : 1,
        }}
      />

      {error && (
        <Box
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            bgcolor: 'grey.200',
            color: 'text.secondary',
          }}
        >
          Image not available
        </Box>
      )}
    </Box>
  );
};

export default OptimizedImage;
