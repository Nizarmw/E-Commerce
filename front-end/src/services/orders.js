import api from "./api";

/**
 * Create a new order
 * @param {Object} orderData - Order data including items and shipping details
 * @returns {Promise<Object>} Order response
 */
export const createOrder = async (orderData) => {
  try {
    const response = await api.post("/orders/", orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get order by ID
 * @param {string|number} orderId - Order ID
 * @returns {Promise<Object>} Order details
 */
export const getOrderById = async (orderId) => {
  try {
    const response = await api.get(`/orders/${orderId}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Get orders for current user
 * @returns {Promise<Array>} List of orders
 */
export const getUserOrders = async () => {
  try {
    const response = await api.get("/orders/");
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Process payment for an order
 * @param {string|number} orderId - Order ID
 * @returns {Promise<Object>} Payment response with possible redirect URL
 */
export const processOrderPayment = async (orderId) => {
  try {
    const response = await api.post(`/orders/${orderId}/pay`, {});
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Cancel an order
 * @param {string|number} orderId - Order ID
 * @returns {Promise<Object>} Cancelled order response
 */
export const cancelOrder = async (orderId) => {
  try {
    const response = await api.post(`/orders/${orderId}/cancel`, {});
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Mark order as completed (received)
 * @param {string|number} orderId - Order ID
 * @returns {Promise<Object>} Completed order response
 */
export const completeOrder = async (orderId) => {
  try {
    const response = await api.post(`/orders/${orderId}/complete`, {});
    return response.data;
  } catch (error) {
    throw error;
  }
};

/**
 * Update order status
 * @param {string|number} orderId - Order ID
 * @param {string} status - New status
 * @returns {Promise<Object>} Updated order
 */
export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.put(`/orders/${orderId}/status`, { status });
    return response.data;
  } catch (error) {
    throw error;
  }
};
