// frontend/src/API/clearSessionAPI.js
/**
 * API to clear stuck active sessions (for testing/emergencies)
 * Usage: clearStuckSession(userId)
 */

export const clearStuckSession = async (userId) => {
  try {
    const response = await fetch(`http://localhost:8000/api/time-entries/force-clock-out/${userId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include'
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to clear session');
    }

    return data;
  } catch (error) {
    console.error('Clear session error:', error);
    throw error;
  }
};

export default clearStuckSession;
