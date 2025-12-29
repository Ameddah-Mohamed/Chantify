import React, { useState, useEffect } from "react";
import { workerTaskAPI } from "../API/workerTaskAPI";

const TaskCard = ({ task, onStatusUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [workerTaskStatus, setWorkerTaskStatus] = useState('todo');

  useEffect(() => {
    // Get current user from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      setCurrentUser(user);
      
      // If user is a worker, fetch their task status
      if (user.role === 'worker') {
        fetchWorkerTaskStatus(task._id, user._id);
      }
    }
  }, [task._id]);

  const fetchWorkerTaskStatus = async (taskId, workerId) => {
    try {
      const response = await workerTaskAPI.getStatus(taskId, workerId);
      setWorkerTaskStatus(response.data.status || 'todo');
    } catch (error) {
      console.log('No worker task status found, using default');
      setWorkerTaskStatus('todo');
    }
  };

  const getStatusDisplay = (status) => {
    const displays = {
      'todo': { label: 'Not Started', color: 'bg-gray-200 text-gray-800' },
      'in-progress': { label: 'In Progress', color: 'bg-orange-200 text-orange-800' },
      'completed': { label: 'Completed', color: 'bg-blue-200 text-blue-800' }
    };
    return displays[status] || displays['todo'];
  };

  const getButtonConfig = (status) => {
    if (status === 'todo') {
      return { label: 'Start', color: 'bg-blue-600 hover:bg-blue-700', nextStatus: 'in-progress' };
    } else if (status === 'in-progress') {
      return { label: 'Complete', color: 'bg-blue-600 hover:bg-blue-700', nextStatus: 'completed' };
    }
    return { label: 'Details', color: 'bg-orange-600 hover:bg-orange-700', nextStatus: null };
  };

  const getBorderColor = (status) => {
    const colors = {
      'todo': 'border-gray-300',
      'in-progress': 'border-orange-300',
      'completed': 'border-blue-300'
    };
    return colors[status] || 'border-gray-300';
  };

  const handleStatusChange = async () => {
    if (!currentUser) {
      alert('Please login to update task status');
      return;
    }
    
    const currentStatus = currentUser.role === 'worker' ? workerTaskStatus : task.status;
    const buttonConfig = getButtonConfig(currentStatus);
    
    if (!buttonConfig.nextStatus || loading) return;

    setLoading(true);
    try {
      if (currentUser.role === 'worker') {
        // Update worker task status
        await workerTaskAPI.updateStatus(task._id, currentUser._id, buttonConfig.nextStatus);
        setWorkerTaskStatus(buttonConfig.nextStatus);
      } else {
        // Admin updating main task (could implement taskAPI.updateTask here if needed)
        console.log('Admin task update not implemented in TaskCard');
      }
      
      if (onStatusUpdate) {
        onStatusUpdate();
      }
    } catch (error) {
      console.error('Failed to update worker task status:', error);
      alert('Failed to update task status: ' + (error.message || 'Please try again'));
    } finally {
      setLoading(false);
    }
  };

  // Determine which status to display based on user role
  const displayStatus = currentUser?.role === 'worker' ? workerTaskStatus : task.status;
  const statusDisplay = getStatusDisplay(displayStatus);
  const buttonConfig = getButtonConfig(displayStatus);

  return (
    <div className={`flex flex-col rounded-lg border-2 ${getBorderColor(displayStatus)} p-5 gap-3 bg-white hover:shadow-md transition-shadow`}>
      {/* Title */}
      <p className="text-gray-900 text-base font-bold">{task.title}</p>
      
      {/* Project */}
      <p className="text-gray-600 text-sm">Project {task.project || 'N/A'}</p>
      
      {/* Status and Button */}
      <div className="flex items-center justify-between mt-2 gap-3">
        <div className="flex flex-col">
          <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusDisplay.color}`}>
            {statusDisplay.label}
          </span>
          {currentUser?.role === 'worker' && (
            <span className="text-xs text-gray-500 mt-1">Your Status</span>
          )}
        </div>
        {currentUser?.role === 'worker' && buttonConfig.nextStatus && (
          <button 
            onClick={handleStatusChange}
            disabled={loading}
            className={`min-w-[84px] h-8 px-4 rounded-lg text-white text-sm font-medium ${buttonConfig.color} disabled:opacity-50 disabled:cursor-not-allowed transition`}
          >
            {loading ? '...' : buttonConfig.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;