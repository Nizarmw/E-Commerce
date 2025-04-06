import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { isAuthenticated } from '../utils/auth';
import Layout from '../components/Layout';

export default function OrderDetail() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      alert('Please login to view order details');
      navigate('/login', { state: { from: `/order/${id}` } });
      return;
    }

    const fetchOrder = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setOrder(response.data);
      } catch (err) {
        console.error('Error fetching order:', err);
        setError('Failed to load order details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [id, navigate]);

  const getStatusBadgeColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'paid':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-purple-100 text-purple-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Function to handle payment
  const handlePayment = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders/${id}/pay`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Redirect to payment gateway if provided
      if (response.data.paymentUrl) {
        window.location.href = response.data.paymentUrl;
      } else {
        // Otherwise refresh the order
        const updatedOrder = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setOrder(updatedOrder.data);
        alert('Payment process initiated. Please check your order status.');
      }
    } catch (err) {
      console.error('Payment error:', err);
      alert('Payment processing failed. Please try again later.');
    }
  };

  const handleCancelOrder = async () => {
    if (!window.confirm('Are you sure you want to cancel this order?')) {
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/orders/${id}/cancel`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      
      // Refresh order data
      const updatedOrder = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      setOrder(updatedOrder.data);
      alert('Order has been cancelled.');
    } catch (err) {
      console.error('Cancel order error:', err);
      alert('Failed to cancel order. Please try again later.');
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      </Layout>
    );
  }

  if (error || !order) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error || 'Order not found'}
          </div>
          <div className="mt-4">
            <Link to="/orders" className="text-blue-500 hover:text-blue-700">
              &larr; Back to Orders
            </Link>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link to="/orders" className="text-blue-500 hover:text-blue-700">
            &larr; Back to Orders
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Order Header */}
          <div className="p-6 border-b bg-gray-50">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div>
                <h1 className="text-2xl font-bold mb-2">Order Details</h1>
                <p className="text-gray-600">Order ID: <span className="font-mono">{order.id}</span></p>
                <p className="text-gray-600">Date: {new Date(order.createdAt).toLocaleString()}</p>
              </div>
              <div className="mt-4 sm:mt-0">
                <span
                  className={`px-4 py-2 rounded-full text-sm font-medium ${getStatusBadgeColor(
                    order.status
                  )}`}
                >
                  {order.status}
                </span>
              </div>
            </div>
          </div>
          
          {/* Order Content */}
          <div className="p-6">
            {/* Order Items */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Items</h2>
              <div className="divide-y">
                {order.orderItems.map((item) => (
                  <div key={item.id} className="py-4 flex flex-col sm:flex-row">
                    <div className="sm:w-24 h-24 mb-4 sm:mb-0 bg-gray-200 rounded flex-shrink-0">
                      {item.product?.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          No img
                        </div>
                      )}
                    </div>
                    <div className="sm:ml-6 flex-grow">
                      <Link 
                        to={`/product/${item.productId}`}
                        className="text-lg font-medium hover:text-blue-600"
                      >
                        {item.product?.name || 'Product Unavailable'}
                      </Link>
                      <p className="text-gray-600">Qty: {item.quantity}</p>
                      <p className="text-gray-600">Price: Rp {item.price.toLocaleString('id-ID')}</p>
                      <p className="font-medium">
                        Subtotal: Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Shipping Information */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
                <div className="bg-gray-50 p-4 rounded">
                  <p className="font-medium">{order.shippingDetails?.fullName}</p>
                  <p>{order.shippingDetails?.address}</p>
                  <p>{order.shippingDetails?.city}, {order.shippingDetails?.postalCode}</p>
                  <p>Phone: {order.shippingDetails?.phoneNumber}</p>
                </div>
              </div>
              
              {/* Payment Summary */}
              <div>
                <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                <div className="bg-gray-50 p-4 rounded">
                  <div className="flex justify-between mb-2">
                    <span>Subtotal</span>
                    <span>Rp {(order.totalPrice * 0.9).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span>Tax (10%)</span>
                    <span>Rp {(order.totalPrice * 0.1).toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg border-t pt-2 mt-2">
                    <span>Total</span>
                    <span>Rp {order.totalPrice.toLocaleString('id-ID')}</span>
                  </div>
                </div>
                
                {/* Payment Actions */}
                <div className="mt-6 space-y-2">
                  {order.status === 'pending' && (
                    <>
                      <button
                        onClick={handlePayment}
                        className="btn w-full bg-green-500 text-white hover:bg-green-600"
                      >
                        Pay Now
                      </button>
                      <button
                        onClick={handleCancelOrder}
                        className="btn w-full bg-red-500 text-white hover:bg-red-600"
                      >
                        Cancel Order
                      </button>
                    </>
                  )}
                  
                  {order.status === 'shipped' && (
                    <button
                      onClick={async () => {
                        try {
                          const token = localStorage.getItem('token');
                          await axios.post(
                            `${process.env.REACT_APP_API_URL}/api/orders/${id}/complete`,
                            {},
                            {
                              headers: {
                                Authorization: `Bearer ${token}`,
                              },
                            }
                          );
                          
                          // Refresh order data
                          const updatedOrder = await axios.get(`${process.env.REACT_APP_API_URL}/api/orders/${id}`, {
                            headers: {
                              Authorization: `Bearer ${token}`,
                            },
                          });
                          
                          setOrder(updatedOrder.data);
                        } catch (err) {
                          console.error('Complete order error:', err);
                          alert('Failed to mark order as completed.');
                        }
                      }}
                      className="btn w-full bg-blue-500 text-white hover:bg-blue-600"
                    >
                      Mark as Received
                    </button>
                  )}
                  
                  {(order.status === 'completed' || order.status === 'delivered') && (
                    <Link
                      to={`/review?orderId=${order.id}`}
                      className="btn w-full bg-yellow-500 text-white hover:bg-yellow-600 block text-center"
                    >
                      Write a Review
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
