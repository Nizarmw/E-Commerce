import React from 'react';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addToCart } from '../redux/cartSlice';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart(product));
    alert(`${product.name} ditambahkan ke keranjang!`);
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-shadow">
      <Link to={`/product/${product.id}`} className="block">
        <div className="h-48 bg-gray-200">
          {product.imageUrl ? (
            <img 
              src={product.imageUrl} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold text-lg truncate">{product.name}</h3>
          <p className="text-gray-600 truncate">{product.description}</p>
          <p className="text-lg font-bold mt-2">Rp {product.price.toLocaleString('id-ID')}</p>
          <button 
            onClick={handleAddToCart}
            className="mt-3 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded w-full"
          >
            Add to Cart
          </button>
        </div>
      </Link>
    </div>
  );
};

export default ProductCard;
