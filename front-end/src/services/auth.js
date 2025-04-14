// utils/auth.js
export const getToken = () => {
    return localStorage.getItem('token');
  };
  
  export const getUserInfo = () => {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  };
  
  export const isAuthenticated = () => {
    return !!getToken();
  };
  
  export const refreshToken = async () => {
    // Implement token refresh logic if needed
    return true;
  };
  
  export const setAuthData = (userData, token) => {
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', token);
  };
  
  export const clearAuthData = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };