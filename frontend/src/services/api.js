import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  signup: (userData) => api.post('/auth/signup', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (profileData) => api.put('/auth/profile', profileData),
  resetPassword: (email) => api.post('/auth/reset-password', { email }),
};

// Exam API
export const examAPI = {
  getExams: () => api.get('/exams'),
  getSubjects: (examId) => api.get(`/exams/${examId}/subjects`),
  getExamDetails: (examId) => api.get(`/exams/${examId}`),
};

// Test API
export const testAPI = {
  startTest: (examId, subjectId, difficulty, numQuestions) => 
    api.post('/tests/start', { examId, subjectId, difficulty, numQuestions }),
  submitTest: (testId, answers) => 
    api.post(`/tests/${testId}/submit`, { answers }),
  getResults: (testId) => api.get(`/tests/${testId}/results`),
  getTestHistory: (userId) => api.get(`/tests/history/${userId}`),
};

// Question API
export const questionAPI = {
  generateQuestions: (examId, subjectId, difficulty, numQuestions) =>
    api.post('/questions/generate', { examId, subjectId, difficulty, numQuestions }),
  addQuestion: (questionData) => api.post('/questions', questionData),
  updateQuestion: (questionId, questionData) => api.put(`/questions/${questionId}`, questionData),
  deleteQuestion: (questionId) => api.delete(`/questions/${questionId}`),
  getQuestions: (filters) => api.get('/questions', { params: filters }),
};

// Admin API
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  getUserStats: () => api.get('/admin/stats'),
  getQuestionStats: () => api.get('/admin/questions/stats'),
  updateUserRole: (userId, role) => api.put(`/admin/users/${userId}/role`, { role }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
};

export default api;