import api from './api';

const requestService = {
  getSent: () => api.get('/requests/sent'),
  getReceived: () => api.get('/requests/received'),
  create: (data) => api.post('/requests', data),
  accept: (id) => api.put(`/requests/${id}/accept`),
  reject: (id, reason) => api.put(`/requests/${id}/reject`, { reason }),
  cancel: (id) => api.delete(`/requests/${id}`),
};

export default requestService;
