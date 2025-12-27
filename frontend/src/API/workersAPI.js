const API_URL = 'http://localhost:8000/api';

// Simple fetch wrapper
const fetchAPI = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Important for cookies
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
};

export const workersAPI = {
  // Get all workers for the logged-in user's company
  getWorkers: async () => {
    return fetchAPI('/company/users');
  },

  // Get job types (for filter dropdown)
  getJobTypes: async () => {
    return fetchAPI('/jobtypes');
  },

  // Update a worker
  updateWorker: async (workerId, workerData) => {
    return fetchAPI(`/company/users/${workerId}`, {
      method: 'PUT',
      body: JSON.stringify(workerData),
    });
  },

  // Delete a worker
  deleteWorker: async (workerId) => {
    return fetchAPI(`/company/users/${workerId}`, {
      method: 'DELETE',
    });
  },

  // Toggle worker active status
  toggleWorkerStatus: async (workerId) => {
    return fetchAPI(`/company/users/${workerId}/toggle-status`, {
      method: 'PATCH',
    });
  },
};

export default workersAPI;