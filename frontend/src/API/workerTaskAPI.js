// Worker Task API functions
const API_BASE_URL = 'http://localhost:8000/api';

export const workerTaskAPI = {
  // Update worker task status
  updateStatus: async (taskId, workerId, status) => {
    const response = await fetch(`${API_BASE_URL}/worker-tasks/${taskId}/${workerId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      throw new Error('Failed to update worker task status');
    }

    return response.json();
  },

  // Get worker task status
  getStatus: async (taskId, workerId) => {
    const response = await fetch(`${API_BASE_URL}/worker-tasks/${taskId}/${workerId}`);
    
    if (!response.ok) {
      throw new Error('Failed to get worker task status');
    }

    return response.json();
  },

  // Get all worker statuses for a task
  getTaskWorkerStatuses: async (taskId) => {
    const response = await fetch(`${API_BASE_URL}/worker-tasks/${taskId}/all`);
    
    if (!response.ok) {
      throw new Error('Failed to get task worker statuses');
    }

    return response.json();
  },

  // Upload file for worker task
  uploadFile: async (taskId, workerId, file, fileName) => {
    const response = await fetch(`${API_BASE_URL}/worker-tasks/${taskId}/${workerId}/upload`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fileName,
        fileData: file, // In real app, this would be FormData or base64
        fileSize: file.length || 0,
        fileType: 'document'
      })
    });

    if (!response.ok) {
      throw new Error('Failed to upload file');
    }

    return response.json();
  }
};