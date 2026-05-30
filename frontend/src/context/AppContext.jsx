import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AppContext = createContext(null);

const BACKEND_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
    ? 'http://localhost:8000/api'
    : 'https://smart-food-ai.vercel.app/api');

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('access_token') || null);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState([]);
  const [toastMessage, setToastMessage] = useState(null);

  // Initialize Custom Axios Instance
  const api = axios.create({
    baseURL: BACKEND_URL,
    headers: {
      'Content-Type': 'application/json',
    }
  });

  // Inject Bearer token to requests
  api.interceptors.request.use(
    (config) => {
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // Interceptor to handle JWT Refresh Token
  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        const refreshToken = localStorage.getItem('refresh_token');
        if (refreshToken) {
          try {
            const res = await axios.post(`${BACKEND_URL}/auth/token/refresh/`, {
              refresh: refreshToken,
            });
            const newAccess = res.data.access;
            localStorage.setItem('access_token', newAccess);
            setToken(newAccess);
            originalRequest.headers.Authorization = `Bearer ${newAccess}`;
            return api(originalRequest);
          } catch (refreshErr) {
            // Refresh failed, log out user
            handleLogout();
          }
        }
      }
      return Promise.reject(error);
    }
  );

  // Trigger glowing toast message
  const triggerToast = (text, type = 'info') => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Fetch current user details
  const fetchUserProfile = async (accessToken) => {
    try {
      const res = await axios.get(`${BACKEND_URL}/auth/profile/`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      setUser(res.data);
    } catch (err) {
      handleLogout();
    } finally {
      setLoading(false);
    }
  };

  // Load profile on start
  useEffect(() => {
    if (token) {
      fetchUserProfile(token);
    } else {
      setLoading(false);
    }
  }, [token]);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!token) return;
    try {
      const res = await api.get('/notifications/');
      setNotifications(res.data);
    } catch (err) {
      console.error("Notifications fetching failed", err);
    }
  };

  // Poll notifications every 8 seconds
  useEffect(() => {
    if (token && user) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 8000);
      return () => clearInterval(interval);
    }
  }, [token, user]);

  const handleLogin = async (username, password) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/login/`, { username, password });
      const accessToken = res.data.access;
      const refreshToken = res.data.refresh;
      
      localStorage.setItem('access_token', accessToken);
      localStorage.setItem('refresh_token', refreshToken);
      
      setToken(accessToken);
      setUser(res.data.user);
      triggerToast(`Welcome back, ${res.data.user.username}! Login successful.`, 'success');
      return { success: true, user: res.data.user };
    } catch (err) {
      const errMsg = err.response?.data?.detail || 'Login credentials incorrect. Please try again.';
      triggerToast(errMsg, 'rose');
      return { success: false, error: errMsg };
    }
  };

  const handleRegister = async (formData) => {
    try {
      const res = await axios.post(`${BACKEND_URL}/auth/register/`, formData);
      triggerToast('Registration successful! You can now log in.', 'success');
      return { success: true, data: res.data };
    } catch (err) {
      const errors = err.response?.data;
      let detailedMsg = 'Signup error occurred. Check fields.';
      if (errors) {
        const firstKey = Object.keys(errors)[0];
        detailedMsg = `${firstKey}: ${errors[firstKey][0]}`;
      }
      triggerToast(detailedMsg, 'rose');
      return { success: false, error: detailedMsg };
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setToken(null);
    setUser(null);
    setNotifications([]);
    triggerToast('Logged out successfully.', 'info');
  };

  return (
    <AppContext.Provider value={{
      user,
      token,
      loading,
      notifications,
      toastMessage,
      triggerToast,
      login: handleLogin,
      register: handleRegister,
      logout: handleLogout,
      api,
      fetchNotifications,
      refreshUserProfile: () => token && fetchUserProfile(token),
      backendUrl: BACKEND_URL
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used inside AppProvider');
  }
  return context;
};
