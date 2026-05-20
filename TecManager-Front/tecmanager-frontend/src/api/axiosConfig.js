import axios from 'axios';
import { getCookie, deleteCookie, tokenCookieExpirado } from '../utils/cookieUtils';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    // ✅ Rutas públicas — no verificar token
    const esRutaPublica = config.url?.includes('/auth/');
    if (esRutaPublica) return config;

    // Verificar expiración
    if (tokenCookieExpirado()) {
      deleteCookie('token');
      deleteCookie('usuario');
      window.location.href = '/login';
      return Promise.reject(new Error('Token expirado'));
    }

    const token = getCookie('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      deleteCookie('token');
      deleteCookie('usuario');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;