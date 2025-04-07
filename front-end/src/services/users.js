import api from './api';

export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

export const getUserRole = async () => {
  try {
    const response = await api.get('/users/me');
    return response.data.role;
  } catch (error) {
    throw error;
  }
};

export const getUsers = async () => {
  try {
    const response = await api.get('/users');
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateUserRole = async (userId, role) => {
  try {
    const response = await api.put(`/users/${userId}/role`, { role });
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deactivateUser = async (userId) => {
  try {
    const response = await api.put(`/users/${userId}/deactivate`);
    return response.data;
  } catch (error) {
    throw error;
  }
};
