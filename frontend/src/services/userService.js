import api from './api';

export const userService = {
  // BACKEND ROUTE: GET /api/users
  getAllUsers: async () => {
    const res = await api.get('/users');
    return res.data;
  },

  // BACKEND ROUTE: GET /api/users/:id
  getUserById: async (id) => {
    const res = await api.get(`/users/${id}`);
    return res.data;
  },

  // BACKEND ROUTE: PUT /api/users/:id
  updateUser: async (id, data) => {
    const res = await api.put(`/users/${id}`, data);
    return res.data;
  },

  // BACKEND ROUTE: DELETE /api/users/:id
  deleteUser: async (id) => {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  },

  // BACKEND ROUTE: PUT /api/users/:id/role
  changeRole: async (id, role) => {
    const res = await api.put(`/users/${id}/role`, { role });
    return res.data;
  },
};