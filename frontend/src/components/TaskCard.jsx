import React, { useState, useEffect } from "react";
import { workerTaskAPI } from "../API/workerTaskAPI";
import { useAuth } from "../context/AuthContext";

const TaskCard = ({ task, onStatusUpdate }) => {
  const [loading, setLoading] = useState(false);
  const [workerTaskStatus, setWorkerTaskStatus] = useState('todo');
  const { user: currentUser } = useAuth();

  useEffect(() => {
    // If user is a worker, fetch their task status
    if (currentUser?.role === 'worker') {
      fetchWorkerTaskStatus(task._id, currentUser._id);
    }
  }, [task._id, currentUser]);

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

  const handleStatusChangeSpecific = async (newStatus) => {
    if (!currentUser) {
      alert('Please login to update task status');
      return;
    }
    
    if (currentUser.role !== 'worker' || loading) return;

    setLoading(true);
    try {
      await workerTaskAPI.updateStatus(task._id, currentUser._id, newStatus);
      setWorkerTaskStatus(newStatus);
      
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
      
      {/* Status and Buttons */}
      <div className="mt-2">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusDisplay.color}`}>
              {statusDisplay.label}
            </span>
            {currentUser?.role === 'worker' && (
              <span className="text-xs text-gray-500">Your Status</span>
            )}
          </div>
          
          {/* Status Update Buttons */}
          {currentUser?.role === 'worker' && (
            <div className="flex gap-1 mt-2">
              <button
                onClick={() => handleStatusChangeSpecific('todo')}
                disabled={loading || workerTaskStatus === 'todo'}
                className={`flex-1 px-2 py-1 text-xs font-medium rounded transition-colors ${
                  workerTaskStatus === 'todo'
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                }`}
              >
                {loading && workerTaskStatus === 'todo' ? '...' : 'Todo'}
              </button>
              
              <button
                onClick={() => handleStatusChangeSpecific('in-progress')}
                disabled={loading || workerTaskStatus === 'in-progress'}
                className={`flex-1 px-2 py-1 text-xs font-medium rounded transition-colors ${
                  workerTaskStatus === 'in-progress'
                    ? 'bg-orange-300 text-orange-700 cursor-not-allowed'
                    : 'bg-orange-200 text-orange-800 hover:bg-orange-300'
                }`}
              >
                {loading && workerTaskStatus === 'in-progress' ? '...' : 'Progress'}
              </button>
              
              <button
                onClick={() => handleStatusChangeSpecific('completed')}
                disabled={loading || workerTaskStatus === 'completed'}
                className={`flex-1 px-2 py-1 text-xs font-medium rounded transition-colors ${
                  workerTaskStatus === 'completed'
                    ? 'bg-green-300 text-green-700 cursor-not-allowed'
                    : 'bg-green-200 text-green-800 hover:bg-green-300'
                }`}
              >
                {loading && workerTaskStatus === 'completed' ? '...' : 'Done'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskCard;