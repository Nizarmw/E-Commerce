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
 * Get user info from token (simplified)
 * @returns {Object|null} User data or null
 */
export const getUserInfo = () => {
  // In a real app, you would decode the JWT token
  // For now, this is a simplified placeholder
  const token = getToken();
  if (!token) return null;
  
  // This is where you would decode the token
  return { 
    id: 1,
    name: "User",
    email: "user@example.com",
    role: "admin"
  };
};
