import axios from 'axios';

const API = axios.create({
  baseURL: 'https://tbs-backend-hub4.onrender.com/api',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth APIs
export const loginUser = (formData) => API.post('/auth/login', formData);
export const registerUser = (formData) => API.post('/auth/register', formData);

// Student Admission APIs
export const getStudents = () => API.get('/students');
export const createStudent = (studentData) => API.post('/students', studentData);
export const updateStudentFee = (id, additionalAmount) => API.put(`/students/${id}/fee`, { additionalAmount });

export default API;