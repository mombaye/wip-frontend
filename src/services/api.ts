// src/services/api.ts
import axios from 'axios';
import {jwtDecode} from 'jwt-decode';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Cette fonction récupère le token et le vérifie à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    const decoded: any = jwtDecode(token);
    if (decoded.exp * 1000 < Date.now()) {
      localStorage.removeItem('token');
      window.location.href = '/login'; // Redirection immédiate
      return Promise.reject(new Error("Token expiré"));
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
