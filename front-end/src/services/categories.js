import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

/**
 * Mengambil semua kategori
 * @returns {Promise<Array>} - Array kategori
 */
export const getAllCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories/`);
    return response.data;
  } catch (error) {
    console.error('Error mengambil kategori:', error);
    throw error;
  }
};

/**
 * Mengambil kategori berdasarkan ID
 * @param {string|number} id - ID kategori
 * @returns {Promise<Object>} - Detail kategori
 */
export const getCategoryById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/categories/${id}/`);
    return response.data;
  } catch (error) {
    console.error(`Error mengambil kategori dengan ID ${id}:`, error);
    throw error;
  }
};
