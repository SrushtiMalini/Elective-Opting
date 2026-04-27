import axios from 'axios';

const API = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach token to every request
API.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem('electiveUser') || '{}');
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

// ---- Student APIs ----
export const registerStudent = (data) => API.post('/students/register', data);
export const loginStudent = (data) => API.post('/students/login', data);
export const getProfile = (id) => API.get(`/students/profile/${id}`);
export const updateProfile = (id, data) => API.put(`/students/profile/${id}`, data);
export const updatePreferences = (id, data) => API.put(`/students/preferences/${id}`, data);
export const getMyResult = (id) => API.get(`/students/result/${id}`);

// ---- Elective APIs ----
export const getAllElectives = () => API.get('/electives');
export const getElective = (id) => API.get(`/electives/${id}`);
export const addElective = (data) => API.post('/electives/add', data);
export const updateElective = (id, data) => API.put(`/electives/update/${id}`, data);
export const deleteElective = (id) => API.delete(`/electives/delete/${id}`);

// ---- Admin APIs ----
export const adminLogin = (data) => API.post('/admin/login', data);
export const seedAdmin = () => API.post('/admin/seed');
export const runAllocation = () => API.post('/admin/run-allocation');
export const getAllResults = () => API.get('/admin/results');
export const getAllStudents = () => API.get('/admin/students');
export const getAnalytics = () => API.get('/admin/analytics');
export const updateAllocationStatus = (id, data) => API.put(`/admin/allocation/${id}`, data);

export default API;