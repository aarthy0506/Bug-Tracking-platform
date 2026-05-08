import api from './api';

export const projectService = {
  // BACKEND ROUTE: GET /api/projects
  getAllProjects: async () => {
    const res = await api.get('/projects');
    return res.data;
  },

  // BACKEND ROUTE: GET /api/projects/:id
  getProjectById: async (id) => {
    const res = await api.get(`/projects/${id}`);
    return res.data;
  },

  // BACKEND ROUTE: POST /api/projects
  createProject: async (data) => {
    const res = await api.post('/projects', data);
    return res.data;
  },

  // BACKEND ROUTE: PUT /api/projects/:id
  updateProject: async (id, data) => {
    const res = await api.put(`/projects/${id}`, data);
    return res.data;
  },

  // BACKEND ROUTE: DELETE /api/projects/:id
  deleteProject: async (id) => {
    const res = await api.delete(`/projects/${id}`);
    return res.data;
  },

  // BACKEND ROUTE: POST /api/projects/:id/members
  assignMember: async (projectId, userId) => {
    const res = await api.post(`/projects/${projectId}/members`, { userId });
    return res.data;
  },

  // BACKEND ROUTE: DELETE /api/projects/:id/members/:userId
  removeMember: async (projectId, userId) => {
    const res = await api.delete(`/projects/${projectId}/members/${userId}`);
    return res.data;
  },
};