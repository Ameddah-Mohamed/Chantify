const API_URL = 'http://localhost:8000/api';

// Simple fetch wrapper
const fetchAPI = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
};

export const taskAPI = {
  // Get all tasks
  getAllTasks: async () => {
    return fetchAPI('/tasks');
  },

  // Get tasks for a specific company
  getCompanyTasks: async (companyId) => {
    return fetchAPI(`/tasks/company/${companyId}`);
  },

  // Create a new task
  createTask: async (taskData) => {
    return fetchAPI('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData),
    });
  },

  // Update a task
  updateTask: async (taskId, updateData) => {
    return fetchAPI(`/tasks/${taskId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // Delete a task
  deleteTask: async (taskId) => {
    return fetchAPI(`/tasks/${taskId}`, {
      method: 'DELETE',
    });
  },
};

export default taskAPI;