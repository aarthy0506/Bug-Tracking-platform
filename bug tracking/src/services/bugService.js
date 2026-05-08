import api from './api';

export const bugService = {
  // BACKEND ROUTE: GET /api/bugs?project=&status=&priority=&assignee=
  getAllBugs: async (filters = {}) => {
    const res = await api.get('/bugs', { params: filters });
    return res.data;
  },

  // BACKEND ROUTE: GET /api/bugs/:id
  getBugById: async (id) => {
    const res = await api.get(`/bugs/${id}`);
    return res.data;
  },

  // BACKEND ROUTE: POST /api/bugs
  createBug: async (bugData) => {
    const formData = new FormData();
    Object.keys(bugData).forEach((key) => {
      if (key === 'screenshots') {
        bugData.screenshots.forEach((file) => formData.append('screenshots', file));
      } else {
        formData.append(key, bugData[key]);
      }
    });
    const res = await api.post('/bugs', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },

  // BACKEND ROUTE: PUT /api/bugs/:id
  updateBug: async (id, updates) => {
    const res = await api.put(`/bugs/${id}`, updates);
    return res.data;
  },

  // BACKEND ROUTE: DELETE /api/bugs/:id
  deleteBug: async (id) => {
    const res = await api.delete(`/bugs/${id}`);
    return res.data;
  },

  // BACKEND ROUTE: PUT /api/bugs/:id/status
  updateStatus: async (id, status) => {
    const res = await api.put(`/bugs/${id}/status`, { status });
    return res.data;
  },

  // BACKEND ROUTE: POST /api/bugs/:id/comments
  addComment: async (id, comment) => {
    const res = await api.post(`/bugs/${id}/comments`, { comment });
    return res.data;
  },

  // BACKEND ROUTE: GET /api/bugs/my-reports (tester's own bugs)
  getMyBugs: async () => {
    const res = await api.get('/bugs/my-reports');
    return res.data;
  },

  // BACKEND ROUTE: GET /api/bugs/assigned (developer's assigned bugs)
  getAssignedBugs: async () => {
    const res = await api.get('/bugs/assigned');
    return res.data;
  },
};