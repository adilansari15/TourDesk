import api from './api.js';

/**
 * Register a new user
 * @param {Object} userData - { name, email, password }
 */
export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

/**
 * Login user with credentials
 * @param {Object} credentials - { email, password }
 */
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  return response.data;
};

/**
 * Logout user
 */
export const logout = async () => {
  try {
    const response = await api.post('/auth/logout');
    return response.data;
  } catch (error) {
    return { success: true };
  }
};

/**
 * Get current authenticated user profile
 */
export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
