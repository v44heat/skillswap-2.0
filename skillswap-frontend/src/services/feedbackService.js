import api from './api';

const feedbackService = {
  submit: (data) => api.post('/feedback', data),
  getForUser: (id) => api.get(`/feedback/user/${id}`),
};

export default feedbackService;
