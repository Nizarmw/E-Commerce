import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

/**
 * Memeriksa role pengguna dari API
 * @returns {Promise<Object>} - Data role pengguna
 */
export const getUserRole = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await axios.get(`${API_URL}/users/role/`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error mengambil role pengguna:', error);
    throw error;
  }
};

/**
 * Memeriksa apakah pengguna terautentikasi
 * @returns {boolean} - Status autentikasi
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token; // Mengembalikan true jika token ada
};

/**
 * Logout pengguna
 */
export const logout = () => {
  localStorage.removeItem('token');
  // Dapat ditambahkan logika lain seperti menghapus item lain dari localStorage
};
