import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { removeFromCart, updateCartItemQuantity, clearCart } from '../redux/cartSlice';
import { isAuthenticated } from '../utils/auth';

const Cart = () => {
  const cart = useSelector((state) => state.cart.items);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Calculate totals
  const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  const tax = subtotal * 0.1; // 10% tax
  const total = subtotal + tax;

  const handleRemoveItem = (id) => {
    dispatch(removeFromCart(id));
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity > 0 && newQuantity <= 10) { // Set a reasonable max quantity
      dispatch(updateCartItemQuantity({ id, quantity: newQuantity }));
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated()) {
      alert('Silakan login terlebih dahulu untuk melanjutkan checkout');
      navigate('/login', { state: { from: '/cart' } });
      return;
    }

    navigate('/checkout');
  };

  // If cart is empty
  if (cart.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">Keranjang Belanja</h1>
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-600 mb-4">Keranjang belanja Anda kosong</p>
          <Link to="/" className="btn btn-primary">
            Mulai Belanja
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Keranjang Belanja</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Cart Items */}
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Items ({cart.length})</h2>
            </div>
            
            <ul>
              {cart.map((item) => (
                <li key={item.id} className="border-b p-4 flex flex-col sm:flex-row items-start sm:items-center">
                  {/* Product image or placeholder */}
                  <div className="w-20 h-20 bg-gray-200 rounded flex-shrink-0 mr-4 mb-4 sm:mb-0">
                    {item.imageUrl ? (
                      <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No img
                      </div>
                    )}
                  </div>
                  
                  {/* Product details */}
                  <div className="flex-grow mb-4 sm:mb-0">
                    <h3 className="font-semibold text-lg">{item.name}</h3>
                    <p className="text-sm text-gray-600">{item.description?.substring(0, 50)}...</p>
                    <p className="text-blue-600 font-medium">Rp {item.price.toLocaleString('id-ID')}</p>
                  </div>
                  
                  {/* Quantity control */}
                  <div className="flex items-center mr-4">
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      className="border rounded-l px-2 py-1 bg-gray-100 hover:bg-gray-200"
                    >
                      -
                    </button>
                    <span className="border-t border-b px-4 py-1">{item.quantity || 1}</span>
                    <button 
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                      className="border rounded-r px-2 py-1 bg-gray-100 hover:bg-gray-200"
                    >
                      +
                    </button>
                  </div>
                  
                  {/* Remove button */}
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    Hapus
                  </button>
                </li>
              ))}
            </ul>
            
            {/* Cart actions */}
            <div className="p-4 flex justify-between">
              <button 
                onClick={() => dispatch(clearCart())}
                className="text-red-500 hover:text-red-700"
              >
                Kosongkan Keranjang
              </button>
              <Link to="/" className="text-blue-500 hover:text-blue-700">
                Lanjut Belanja
              </Link>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-md p-4">
            <h2 className="text-lg font-semibold mb-4">Ringkasan Order</h2>
            
            <div className="space-y-3 mb-4">
              <div className="flex justify-between">
                <span className="text-gray-600">Subtotal ({cart.length} items)</span>
                <span>Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Pajak (10%)</span>
                <span>Rp {tax.toLocaleString('id-ID')}</span>
              </div>
              <div className="border-t pt-3 font-bold flex justify-between">
                <span>Total</span>
                <span>Rp {total.toLocaleString('id-ID')}</span>
              </div>
            </div>
            
            <button 
              onClick={handleCheckout}
              className="btn btn-primary w-full"
            >
              Lanjut ke Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
