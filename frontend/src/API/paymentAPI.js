// frontend/src/API/paymentAPI.js
const API_URL = 'http://localhost:8000/api';

const fetchAPI = async (endpoint, options = {}) => {
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
    throw new Error(data.error || 'Something went wrong');
  }

  return data;
};

export const paymentAPI = {
  // Get all company payments (Admin)
  getCompanyPayments: async (filters = {}) => {
    const params = new URLSearchParams(filters);
    return fetchAPI(`/payments/company?${params}`);
  },

  // Generate monthly payments (Admin)
  generateMonthlyPayments: async (year, month) => {
    return fetchAPI('/payments/generate', {
      method: 'POST',
      body: JSON.stringify({ year, month }),
    });
  },

  // Get payment details
  getPaymentDetails: async (userId, year, month) => {
    return fetchAPI(`/payments/${userId}/${year}/${month}`);
  },

  // Update payment (bonus, penalties, notes)
  updatePayment: async (paymentId, updateData) => {
    return fetchAPI(`/payments/${paymentId}`, {
      method: 'PUT',
      body: JSON.stringify(updateData),
    });
  },

  // Toggle payment status
  togglePaymentStatus: async (paymentId) => {
    return fetchAPI(`/payments/${paymentId}/toggle-status`, {
      method: 'PATCH',
    });
  },

  // Get worker's own payments
  getMyPayments: async (year) => {
    const params = year ? `?year=${year}` : '';
    return fetchAPI(`/payments/my-payments${params}`);
  }
};

export default paymentAPI;