import axios from 'axios';

const API_BASE = "/api";

const api = axios.create({
  baseURL: API_BASE,
});

// Dynamic Auth Interceptor — attaches token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('gigshield_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// 401 Auto-logout Interceptor — clears session and redirects to login on expired token
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Avoid redirect loop on the login/register pages
      const publicPaths = ['/login', '/register', '/'];
      if (!publicPaths.includes(window.location.pathname)) {
        localStorage.removeItem('gigshield_token');
        localStorage.removeItem('gigshield_user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
