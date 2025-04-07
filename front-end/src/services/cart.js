import axios from 'axios';
import { API_URL } from './products';

/**
 * Mengambil data keranjang dari backend
 * @returns {Promise<Array>} Array item di keranjang
 */
export const getCart = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/cart/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error mengambil data keranjang:', error);
    throw error;
  }
};

/**
 * Menyinkronkan keranjang dengan backend
 * @param {Array} items - Item keranjang untuk disinkronkan
 * @returns {Promise<Array>} Array item yang telah disinkronkan
 */
export const syncCart = async (items) => {
  try {
    const token = localStorage.getItem('token');
    await axios.post(
      `${API_URL}/cart/sync/`,
      { items },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return items;
  } catch (error) {
    console.error('Error menyinkronkan keranjang:', error);
    throw error;
  }
};

/**
 * Menambahkan item ke keranjang
 * @param {Object} item - Item untuk ditambahkan
 * @returns {Promise<Object>} Item yang ditambahkan
 */
export const addItemToCart = async (item) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.post(
      `${API_URL}/cart/`,
      item,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error menambahkan item ke keranjang:', error);
    throw error;
  }
};

/**
 * Menghapus item dari keranjang
 * @param {string|number} itemId - ID item untuk dihapus
 * @returns {Promise<void>}
 */
export const removeItemFromCart = async (itemId) => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/cart/items/${itemId}/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error menghapus item dari keranjang:', error);
    throw error;
  }
};

/**
 * Mengupdate jumlah item di keranjang
 * @param {string|number} itemId - ID item
 * @param {number} quantity - Jumlah baru
 * @returns {Promise<Object>} Item yang diupdate
 */
export const updateItemQuantity = async (itemId, quantity) => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.patch(
      `${API_URL}/cart/items/${itemId}/`,
      { quantity },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error mengupdate jumlah item:', error);
    throw error;
  }
};

/**
 * Mengosongkan keranjang
 * @returns {Promise<void>}
 */
export const clearCartItems = async () => {
  try {
    const token = localStorage.getItem('token');
    await axios.delete(`${API_URL}/cart/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error mengosongkan keranjang:', error);
    throw error;
  }
};
