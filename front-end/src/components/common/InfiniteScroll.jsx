import React, { useEffect, useRef, useCallback } from 'react';
import { Box, CircularProgress } from '@mui/material';

const InfiniteScroll = ({ 
  children, 
  onLoadMore, 
  hasMore, 
  loading,
  threshold = 100 
}) => {
  const observer = useRef();
  const lastElementRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    }, { threshold: 0.1 });

    if (node) observer.current.observe(node);
  }, [loading, hasMore, onLoadMore]);

  return (
    <Box>
      {children}
      <Box ref={lastElementRef} sx={{ height: threshold, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        {loading && <CircularProgress size={24} />}
      </Box>
    </Box>
  );
};

export default InfiniteScroll;
