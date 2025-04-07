/**
 * Authentication utility functions
 */

/**
 * Check if user is authenticated
 * @returns {boolean} Authentication status
 */
export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

/**
 * Get authentication token
 * @returns {string|null} JWT token
 */
export const getToken = () => {
  return localStorage.getItem("token");
};

/**
 * Set authentication token
 * @param {string} token - JWT token
 */
export const setToken = (token) => {
  localStorage.setItem("token", token);
};

/**
 * Remove authentication token (logout)
 */
export const removeToken = () => {
  localStorage.removeItem("token");
};

/**
 * Decode JWT token
 * @param {string} token - JWT token string
 * @returns {Object|null} Decoded token payload
 */
const decodeToken = (token) => {
  try {
    // Split token into parts and get payload
    const base64Payload = token.split('.')[1];
    // Replace invalid characters and decode
    const payload = atob(base64Payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(payload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

/**
 * Get user info by combining JWT token data and stored user info
 * @returns {Object|null} User data or null
 */
export const getUserInfo = () => {
  const token = getToken();
  if (!token) return null;
  
  const decodedToken = decodeToken(token);
  if (!decodedToken) return null;

  // Get additional stored user info
  const storedInfo = JSON.parse(localStorage.getItem('userInfo') || '{}');

  // Combine token data with stored user info
  return {
    id: decodedToken.user_id,
    role: decodedToken.role,
    exp: decodedToken.exp,
    iat: decodedToken.iat,
    // Include additional stored user info
    ...storedInfo
  };
};

/**
 * Set user info
 * @param {Object} userInfo - User information
 */
export const setUserInfo = (userInfo) => {
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
};

/**
 * Clear user info
 */
export const clearUserInfo = () => {
  localStorage.removeItem('userInfo');
};
