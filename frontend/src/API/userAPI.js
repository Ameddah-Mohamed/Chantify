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

export const userAPI = {
  // Get all users with optional search
  getUsers: async (searchTerm = '') => {
    const query = searchTerm ? `?search=${encodeURIComponent(searchTerm)}` : '';
    return fetchAPI(`/users${query}`);
  },
};

export default userAPI;
