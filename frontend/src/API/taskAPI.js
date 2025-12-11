import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// Request interceptor to add token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('chantify_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const taskApi = {
  // Create task
  createTask: (taskData) => api.post('/tasks', taskData),
  
  // Get company tasks
  getCompanyTasks: (companyId) => api.get(`/tasks/company/${companyId}`),
  
  // Get my tasks
  getMyTasks: () => api.get('/tasks/my-tasks'),
  
  // Update task
  updateTask: (taskId, updateData) => api.put(`/tasks/${taskId}`, updateData),
  
  // Delete task
  deleteTask: (taskId) => api.delete(`/tasks/${taskId}`),
};

// Export the base api instance for other modules
export default api;