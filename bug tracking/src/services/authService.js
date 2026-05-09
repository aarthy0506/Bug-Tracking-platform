import api from './api';

export const authService = {
  login: async (email, password) => {
    // BACKEND ROUTE: POST /api/auth/login
    const res = await api.post('/auth/login', { email, password });
    return res.data; // expects { token, user }
  },

  register: async (userData) => {
    // BACKEND ROUTE: POST /api/auth/register
    const res = await api.post('/auth/register', userData);
    return res.data;
  },

  forgotPassword: async (email) => {
    // BACKEND ROUTE: POST /api/auth/forgot-password
    const res = await api.post('/auth/forgot-password', { email });
    return res.data;
  },

  getProfile: async () => {
    // BACKEND ROUTE: GET /api/auth/me
    const res = await api.get('/auth/me');
    return res.data;
  },
};