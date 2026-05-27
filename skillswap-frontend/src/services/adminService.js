import api from './api';

const adminService = {
  getStats: () => api.get('/admin/stats'),
  getUsers: (params) => api.get('/admin/users', { params }),
  getUser: (id) => api.get(`/admin/users/${id}`),
  updateUser: (id, data) => api.put(`/admin/users/${id}`, data),
  deleteUser: (id) => api.delete(`/admin/users/${id}`),
  resetPassword: (id, data) => api.post(`/admin/users/${id}/reset-password`, data),
  suspendUser: (id) => api.put(`/admin/users/${id}/suspend`),
  getSkills: (params) => api.get('/admin/skills', { params }),
  deleteSkill: (id) => api.delete(`/admin/skills/${id}`),
  toggleSkill: (id) => api.put(`/admin/skills/${id}/toggle`),
  getRequests: (params) => api.get('/admin/requests', { params }),
  cancelRequest: (id) => api.put(`/admin/requests/${id}/cancel`),
  getSessions: (params) => api.get('/admin/sessions', { params }),
  cancelSession: (id) => api.put(`/admin/sessions/${id}/cancel`),
  getLogs: (params) => api.get('/admin/activity', { params }),
};

export default adminService;
