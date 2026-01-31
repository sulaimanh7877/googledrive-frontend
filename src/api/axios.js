import axios from 'axios';
import { getToken, removeToken } from '../utils/token.util';
import { toast } from 'react-toastify';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      removeToken();
      // Prevent multiple toasts or redirects
      if (window.location.pathname !== '/login') {
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;