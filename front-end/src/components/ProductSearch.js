import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

const ProductSearch = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [priceRange, setPriceRange] = useState({
    min: searchParams.get('min') || '',
    max: searchParams.get('max') || ''
  });
  const [category, setCategory] = useState(searchParams.get('category') || '');
  const [showFilters, setShowFilters] = useState(false);

  // Hardcoded categories for now - would come from an API in real app
  const categories = [
    { id: '1', name: 'Electronics' },
    { id: '2', name: 'Clothing' },
    { id: '3', name: 'Home & Kitchen' },
    { id: '4', name: 'Books' },
    { id: '5', name: 'Sports' }
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    
    const params = new URLSearchParams();
    if (searchQuery) params.append('q', searchQuery);
    if (category) params.append('category', category);
    if (priceRange.min) params.append('min', priceRange.min);
    if (priceRange.max) params.append('max', priceRange.max);
    
    navigate({
      pathname: '/search',
      search: params.toString()
    });
  };

  const clearFilters = () => {
    setSearchQuery('');
    setPriceRange({ min: '', max: '' });
    setCategory('');
    navigate('/search');
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <form onSubmit={handleSearch}>
        <div className="flex flex-col sm:flex-row items-center gap-2">
          <div className="relative flex-grow">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              className="input-field pr-10"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                &times;
              </button>
            )}
          </div>
          
          <button type="submit" className="btn btn-primary whitespace-nowrap">
            Search
          </button>
          
          <button 
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className="text-blue-500 hover:text-blue-700 whitespace-nowrap ml-2 sm:ml-4"
          >
            {showFilters ? 'Hide Filters' : 'Show Filters'}
          </button>
        </div>
        
        {showFilters && (
          <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block mb-1 text-sm">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="input-field"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block mb-1 text-sm">Min Price</label>
              <input
                type="number"
                value={priceRange.min}
                onChange={(e) => setPriceRange({...priceRange, min: e.target.value})}
                placeholder="Min Price"
                min="0"
                className="input-field"
              />
            </div>
            
            <div>
              <label className="block mb-1 text-sm">Max Price</label>
              <input
                type="number"
                value={priceRange.max}
                onChange={(e) => setPriceRange({...priceRange, max: e.target.value})}
                placeholder="Max Price"
                min="0"
                className="input-field"
              />
            </div>
            
            <div className="md:col-span-3 flex justify-end">
              <button 
                type="button" 
                onClick={clearFilters}
                className="text-gray-500 hover:text-gray-700 mr-4"
              >
                Clear All
              </button>
              <button type="submit" className="btn btn-primary">
                Apply Filters
              </button>
            </div>
          </div>
        )}
      </form>
    </div>
  );
};

export default ProductSearch;
