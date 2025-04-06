import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { isAuthenticated } from '../utils/auth';
import Layout from '../components/Layout';

export default function OrderHistory() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('all');
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated()) {
      alert('Please login to view your orders');
      navigate('/login', { state: { from: '/orders' } });
      return;
    }

    const fetchOrders = async () => {
      setLoading(true);
      setError(null);
      
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(process.env.REACT_APP_API_URL + '/orders/', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        setOrders(response.data);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load your orders. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // Filter orders based on active tab
  const filteredOrders = orders.filter(order => {
    if (activeTab === 'all') return true;
    return order.status.toLowerCase() === activeTab;
  });

  // Get status badge color based on status
  const getStatusBadgeColor = (status) => {
    switch (status.toLowerCase()) {
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

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6">My Orders</h1>

        {/* Status tabs */}
        <div className="mb-6 border-b">
          <div className="flex overflow-x-auto">
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'all'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('all')}
            >
              All Orders
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'pending'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('pending')}
            >
              Pending
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'paid'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('paid')}
            >
              Paid
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'shipped'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('shipped')}
            >
              Shipped
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'completed'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('completed')}
            >
              Completed
            </button>
            <button
              className={`px-4 py-2 font-medium ${
                activeTab === 'cancelled'
                  ? 'border-b-2 border-blue-500 text-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => setActiveTab('cancelled')}
            >
              Cancelled
            </button>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            {error}
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="bg-gray-50 p-8 rounded-lg text-center">
            <h3 className="text-lg font-semibold mb-2">No orders found</h3>
            <p className="text-gray-600 mb-4">
              {activeTab === 'all'
                ? "You haven't placed any orders yet."
                : `You don't have any ${activeTab} orders.`}
            </p>
            <button
              onClick={() => navigate('/')}
              className="btn btn-primary"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg shadow-md overflow-hidden"
              >
                <div className="p-4 border-b bg-gray-50 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                  <div>
                    <p className="text-sm text-gray-600">
                      Order ID: <span className="font-mono">{order.id}</span>
                    </p>
                    <p className="text-sm text-gray-600">
                      Date: {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-2 sm:mt-0 flex items-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                        order.status
                      )}`}
                    >
                      {order.status}
                    </span>
                    <button
                      onClick={() => navigate(`/order/${order.id}`)}
                      className="ml-4 text-blue-500 hover:text-blue-700 text-sm"
                    >
                      View Details
                    </button>
                  </div>
                </div>

                <div className="p-4">
                  <div className="divide-y">
                    {order.orderItems.map((item) => (
                      <div key={item.id} className="py-3 flex items-center space-x-4">
                        <div className="w-16 h-16 flex-shrink-0 bg-gray-200 rounded">
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
                        <div className="flex-grow">
                          <h4 className="font-medium">{item.product?.name || 'Product Unavailable'}</h4>
                          <p className="text-gray-600 text-sm">
                            Qty: {item.quantity} × Rp {item.price.toLocaleString('id-ID')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">
                            Rp {(item.quantity * item.price).toLocaleString('id-ID')}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="mt-4 pt-4 border-t">
                    <div className="flex justify-between">
                      <span className="font-medium">Total</span>
                      <span className="font-bold text-lg">
                        Rp {order.totalPrice.toLocaleString('id-ID')}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
