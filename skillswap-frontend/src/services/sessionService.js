import api from './api';

const sessionService = {
  getUpcoming: () => api.get('/sessions/upcoming'),
  getPast: () => api.get('/sessions/past'),
  complete: (id) => api.put(`/sessions/${id}/complete`),
  cancel: (id) => api.put(`/sessions/${id}/cancel`),
  getById: (id) => api.get(`/sessions/${id}`),
};

export default sessionService;
