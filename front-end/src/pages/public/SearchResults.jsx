import React from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import PublicLayout from '../../layouts/PublicLayout';
import Loading from '../../components/common/Loading';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q');
  const [loading, setLoading] = React.useState(true);
  const [results, setResults] = React.useState([]);

  React.useEffect(() => {
    const searchProducts = async () => {
      setLoading(true);
      try {
        // Mock API call - replace with actual API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        // Mock results
        const mockResults = [
          { id: 1, name: `Result for "${query}" 1`, price: '$99.99' },
          { id: 2, name: `Result for "${query}" 2`, price: '$149.99' },
        ];
        setResults(mockResults);
      } catch (error) {
        console.error('Search failed:', error);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      searchProducts();
    }
  }, [query]);

  return (
    <PublicLayout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Search Results for "{query}"
        </Typography>
        {loading ? (
          <Loading text="Searching..." />
        ) : results.length > 0 ? (
          <Grid container spacing={3}>
            {results.map((result) => (
              <Grid item xs={12} sm={6} md={4} key={result.id}>
                {/* Use your existing Product Card component here */}
                <Box p={2} border={1} borderColor="divider" borderRadius={2}>
                  <Typography variant="h6">{result.name}</Typography>
                  <Typography color="primary">{result.price}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography color="text.secondary">
            No results found for "{query}"
          </Typography>
        )}
      </Container>
    </PublicLayout>
  );
};

export default SearchResults;
