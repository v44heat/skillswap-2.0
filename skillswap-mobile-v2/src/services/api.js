import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});

// Attach JWT token to every request
api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('ss_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    if (error.response?.status === 401) {
      await SecureStore.deleteItemAsync('ss_token');
    }
    return Promise.reject(error);
  }
);

export default api;

export const authService = {
  login:    (data) => api.post('/auth/login', data),
  register: (data) => api.post('/auth/register', data),
  me:       ()     => api.get('/auth/me'),
  logout:   ()     => api.post('/auth/logout'),
};

export const skillService = {
  getMy:   ()              => api.get('/skills/my'),
  create:  (data)          => api.post('/skills', data),
  update:  (id, data)      => api.put(`/skills/${id}`, data),
  remove:  (id)            => api.delete(`/skills/${id}`),
  browse:  (params)        => api.get('/skills/browse', { params }),
};

export const requestService = {
  getSent:    ()           => api.get('/requests/sent'),
  getReceived:()           => api.get('/requests/received'),
  create:     (data)       => api.post('/requests', data),
  accept:     (id)         => api.put(`/requests/${id}/accept`),
  reject:     (id, reason) => api.put(`/requests/${id}/reject`, { reason }),
  cancel:     (id)         => api.delete(`/requests/${id}`),
};

export const sessionService = {
  getUpcoming: () => api.get('/sessions/upcoming'),
  getPast:     () => api.get('/sessions/past'),
  complete:    (id) => api.put(`/sessions/${id}/complete`),
  cancel:      (id) => api.put(`/sessions/${id}/cancel`),
};

export const notificationService = {
  getAll:     () => api.get('/notifications'),
  markRead:   (id) => api.put(`/notifications/${id}/read`),
  markAllRead:() => api.put('/notifications/read-all'),
  remove:     (id) => api.delete(`/notifications/${id}`),
};

export const feedbackService = {
  submit: (data) => api.post('/feedback', data),
};

export const adminService = {
  getStats:      ()        => api.get('/admin/stats'),
  getUsers:      (search)  => api.get('/admin/users', { params: { search } }),
  deleteUser:    (id)      => api.delete(`/admin/users/${id}`),
  resetPassword: (id, data)=> api.post(`/admin/users/${id}/reset-password`, data),
  toggleSuspend: (id)      => api.put(`/admin/users/${id}/suspend`),
  getSkills:     (params)  => api.get('/admin/skills', { params }),
  deleteSkill:   (id)      => api.delete(`/admin/skills/${id}`),
  toggleSkill:   (id)      => api.put(`/admin/skills/${id}/toggle`),
  getRequests:   (status)  => api.get('/admin/requests', { params: { status } }),
  cancelRequest: (id)      => api.put(`/admin/requests/${id}/cancel`),
  getSessions:   (status)  => api.get('/admin/sessions', { params: { status } }),
  cancelSession: (id)      => api.put(`/admin/sessions/${id}/cancel`),
  getLogs:       ()        => api.get('/admin/activity'),
};
