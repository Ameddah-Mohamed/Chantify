// frontend/src/API/timeEntryAPI.js
const API_URL = 'http://localhost:8000/api';

const fetchAPI = async (endpoint, options = {}) => {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    credentials: 'include', // Always include credentials for auth
    ...options,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
};

export const timeEntryAPI = {
  // Clock in
  clockIn: async (userId, location) => {
    return fetchAPI('/time-entries/clock-in', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address || ''
      }),
    });
  },

  // Clock out
  clockOut: async (userId, location, notes = '') => {
    return fetchAPI('/time-entries/clock-out', {
      method: 'POST',
      body: JSON.stringify({
        userId,
        latitude: location.latitude,
        longitude: location.longitude,
        address: location.address || '',
        notes
      }),
    });
  },

  // Get active session
  getActiveSession: async (userId) => {
    return fetchAPI(`/time-entries/active/${userId}`);
  },

  // Get user time entries
  getUserTimeEntries: async (userId, filters = {}) => {
    const params = new URLSearchParams(filters);
    return fetchAPI(`/time-entries/user/${userId}?${params}`);
  },

  // Get company time entries (Admin)
  getCompanyTimeEntries: async (companyId, filters = {}) => {
    const params = new URLSearchParams(filters);
    return fetchAPI(`/time-entries/company/${companyId}?${params}`);
  },

  // Get monthly report
  getMonthlyReport: async (userId, year, month) => {
    return fetchAPI(`/time-entries/monthly/${userId}?year=${year}&month=${month}`);
  },

  // Get daily entries
  getDailyEntries: async (userId, date) => {
    return fetchAPI(`/time-entries/daily/${userId}/${date}`);
  },

  // Get monthly summaries for user
  getMonthlySummaries: async (userId) => {
    return fetchAPI(`/time-entries/summaries/${userId}`);
  },

  // Get session history for user (admin view)
  getSessionHistory: async (userId, limit = 50, skip = 0) => {
    return fetchAPI(`/time-entries/history/${userId}?limit=${limit}&skip=${skip}`);
  }
};

export default timeEntryAPI;