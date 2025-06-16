import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { refreshTokenService } from './authService';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // important pour que le cookie soit transmis si utilisé
});

// Ajoute automatiquement le token à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Si erreur 401, tente un refresh + rejoue la requête
api.interceptors.response.use(
  res => res,
  async err => {
    const originalRequest = err.config;
    if (err.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const data = await refreshTokenService();
        const newToken = data.access_token;
        localStorage.setItem('token', newToken);
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return api(originalRequest); // rejoue la requête
      } catch (refreshError) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(err);
  }
);

export default api;
