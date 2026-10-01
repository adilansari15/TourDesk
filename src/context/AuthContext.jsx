import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import * as authService from '../services/authService.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() => localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Persistent login: Verify token on app startup
  const verifySession = useCallback(async () => {
    const savedToken = localStorage.getItem('token');
    if (!savedToken) {
      setUser(null);
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const data = await authService.getCurrentUser();
      if (data.success && data.user) {
        setUser(data.user);
        setToken(savedToken);
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setToken(null);
      }
    } catch {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setToken(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    verifySession();
  }, [verifySession]);

  // Login action
  const login = async (email, password) => {
    setError(null);
    try {
      const data = await authService.login({ email, password });
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      }
      throw new Error(data.message || 'Login failed');
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || 'Invalid email or password';
      setError(message);
      return { success: false, message };
    }
  };

  // Register action
  const register = async (name, email, password) => {
    setError(null);
    try {
      const data = await authService.register({ name, email, password });
      if (data.success && data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        setToken(data.token);
        setUser(data.user);
        return { success: true };
      }
      throw new Error(data.message || 'Registration failed');
    } catch (err) {
      const message =
        err.response?.data?.message || err.message || 'Registration failed';
      setError(message);
      return { success: false, message };
    }
  };

  // Logout action
  const logout = async () => {
    try {
      await authService.logout();
    } catch {
      // Clean up client storage regardless
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setToken(null);
      setError(null);
    }
  };

  const clearError = () => setError(null);

  const value = {
    user,
    token,
    loading,
    error,
    login,
    register,
    logout,
    verifySession,
    clearError,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
