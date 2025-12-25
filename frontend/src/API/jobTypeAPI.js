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

export const jobTypeAPI = {
  // Get all job types for logged-in user's company
  getJobTypes: async () => {
    return fetchAPI('/jobtypes');
  },

  // Get job types by company email (public - for signup)
  getJobTypesByCompany: async (companyEmail) => {
    return fetchAPI(`/jobtypes/by-company?companyEmail=${encodeURIComponent(companyEmail)}`);
  },

  // Create a new job type
  createJobType: async (jobTypeData) => {
    return fetchAPI('/jobtypes', {
      method: 'POST',
      body: JSON.stringify(jobTypeData),
    });
  },

  // Update a job type
  updateJobType: async (id, jobTypeData) => {
    return fetchAPI(`/jobtypes/${id}`, {
      method: 'PUT',
      body: JSON.stringify(jobTypeData),
    });
  },

  // Delete a job type
  deleteJobType: async (id) => {
    return fetchAPI(`/jobtypes/${id}`, {
      method: 'DELETE',
    });
  },
};

export default jobTypeAPI;