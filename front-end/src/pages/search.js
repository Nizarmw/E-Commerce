import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import ProductSearch from '../components/ProductSearch';
import ProductCard from '../components/ProductCard';

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  
  const query = searchParams.get('q') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('min') || '';
  const maxPrice = searchParams.get('max') || '';

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      setError(null);
      
      try {
        // Build query parameters
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (category) params.append('category', category);
        if (minPrice) params.append('min_price', minPrice);
        if (maxPrice) params.append('max_price', maxPrice);
        
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/products/search/?${params.toString()}`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to fetch products. Please try again later.');
        // Fall back to all products if search fails
        const allProducts = await axios.get(process.env.REACT_APP_API_URL + '/products/');
        setProducts(allProducts.data);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProducts();
  }, [query, category, minPrice, maxPrice]);

  // Build search summary text
  const buildSearchSummary = () => {
    let summary = 'All Products';
    
    if (query) {
      summary = `Results for "${query}"`;
    }
    
    const filters = [];
    if (category) filters.push(`Category: ${category}`);
    if (minPrice && maxPrice) {
      filters.push(`Price: Rp ${minPrice} - Rp ${maxPrice}`);
    } else if (minPrice) {
      filters.push(`Price: Min Rp ${minPrice}`);
    } else if (maxPrice) {
      filters.push(`Price: Max Rp ${maxPrice}`);
    }
    
    if (filters.length > 0) {
      summary += ` (${filters.join(', ')})`;
    }
    
    return summary;
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Search Products</h1>
        
        <ProductSearch />
        
        <div className="mb-4">
          <h2 className="text-xl font-semibold">{buildSearchSummary()}</h2>
          <p className="text-gray-600">{products.length} products found</p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-60">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="bg-gray-100 p-8 rounded-lg text-center">
            <h3 className="text-lg font-semibold mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default SearchPage;
