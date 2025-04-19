import axios from "axios";

export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080";

/**
 * Mendapatkan semua produk
 * @returns {Promise<Array>} Array produk dari API
 */
export const getAllProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products`);
    return response.data;
  } catch (error) {
    console.error("Error mengambil produk:", error);
    throw error;
  }
};

/**
 * Mencari produk berdasarkan parameter
 * @param {Object} params - Parameter pencarian
 * @param {string} params.query - Kata kunci pencarian
 * @param {string} params.category - Kategori produk
 * @param {number} params.minPrice - Harga minimum
 * @param {number} params.maxPrice - Harga maksimum
 * @returns {Promise<Array>} - Array produk hasil pencarian
 */
export const searchProducts = async ({
  query,
  category,
  minPrice,
  maxPrice,
}) => {
  try {
    // Membangun parameter query
    const params = new URLSearchParams();
    if (query) params.append("q", query);
    if (category) params.append("category", category);
    if (minPrice) params.append("min_price", minPrice);
    if (maxPrice) params.append("max_price", maxPrice);

    const response = await axios.get(
      `${API_URL}/products/search?${params.toString()}`
    );
    return response.data;
  } catch (error) {
    console.error("Error mencari produk:", error);
    throw error;
  }
};

/**
 * Mendapatkan detail produk berdasarkan ID
 * @param {string|number} id - ID produk
 * @returns {Promise<Object>} - Detail produk
 */
export const getProductById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/products/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error mengambil produk dengan ID ${id}:`, error);
    throw error;
  }
};

/**
 * Mendapatkan produk berdasarkan kategori
 * @param {string} category - Nama kategori
 * @returns {Promise<Array>} - Array produk dalam kategori
 */
export const getProductsByCategory = async (category) => {
  try {
    const response = await axios.get(
      `${API_URL}/products?category=${category}`
    );
    return response.data;
  } catch (error) {
    console.error(`Error mengambil produk untuk kategori ${category}:`, error);
    throw error;
  }
};

/**
 * Mengambil produk milik seller yang sedang login
 * @returns {Promise<Array>} - Array produk milik seller
 */
export const getSellerProducts = async () => {
  try {
    const response = await api.get(`/products/seller`);
    return response.data;
  } catch (error) {
    console.error("Error mengambil produk seller:", error);
    throw error;
  }
};

/**
 * Membuat produk baru
 * @param {Object} productData - Data produk yang akan dibuat
 * @returns {Promise<Object>} - Data produk yang dibuat
 */
export const createProduct = async (productData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(`${API_URL}/products`, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error membuat produk:", error);
    throw error;
  }
};

/**
 * Memperbarui produk yang sudah ada
 * @param {string|number} id - ID produk
 * @param {Object} productData - Data produk yang diperbarui
 * @returns {Promise<Object>} - Data produk yang diperbarui
 */
export const updateProduct = async (id, productData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/products/${id}`, productData, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error(`Error memperbarui produk dengan ID ${id}:`, error);
    throw error;
  }
};

/**
 * Menghapus produk
 * @param {string|number} id - ID produk
 * @returns {Promise<void>}
 */
export const deleteProduct = async (id) => {
  try {
    const token = localStorage.getItem("token");
    await axios.delete(`${API_URL}/products/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error(`Error menghapus produk dengan ID ${id}:`, error);
    throw error;
  }
};
