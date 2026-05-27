import api from './api';

const skillService = {
  getMy: () => api.get('/skills/my'),
  create: (data) => api.post('/skills', data),
  update: (id, data) => api.put(`/skills/${id}`, data),
  remove: (id) => api.delete(`/skills/${id}`),
  browse: (params) => api.get('/skills/browse', { params }),
  getCategories: () => api.get('/skills/categories'),
};

export default skillService;
