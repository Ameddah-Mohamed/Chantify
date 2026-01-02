const API_URL = 'http://localhost:8000/api';

// Simple fetch wrapper
const fetchAPI = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include',
      ...options,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || `HTTP ${response.status}`);
    }

    return data;
  } catch (error) {
    if (error.name === 'SyntaxError') {
      throw new Error('Invalid response from server');
    }
    throw error;
  }
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

  // Get tasks assigned to a specific user
  getUserTasks: async (userId) => {
    return fetchAPI(`/tasks/user/${userId}`);
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

  // Get tasks ready for approval (all workers completed)
  getTasksForApproval: async () => {
    return fetchAPI('/tasks/ready-for-approval');
  },

  // Approve a task
  approveTask: async (taskId) => {
    if (!taskId) {
      throw new Error('Task ID is required');
    }
    return fetchAPI(`/tasks/${taskId}/approve`, {
      method: 'PUT',
      body: JSON.stringify({}),
    });
  },
};

export default taskAPI;