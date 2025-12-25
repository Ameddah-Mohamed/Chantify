import React, { useState } from "react";
import { workerTaskAPI } from "../API/workerTaskAPI";

const TaskCard = ({ task, workerId = "default-worker-id", onStatusUpdate }) => {
  const [loading, setLoading] = useState(false);

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
    const buttonConfig = getButtonConfig(task.status);
    if (!buttonConfig.nextStatus || loading) return;

    setLoading(true);
    try {
      await workerTaskAPI.updateStatus(task._id, workerId, buttonConfig.nextStatus);
      if (onStatusUpdate) {
        onStatusUpdate();
      }
    } catch (error) {
      console.error('Failed to update worker task status:', error);
      alert('Failed to update task status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const statusDisplay = getStatusDisplay(task.status);
  const buttonConfig = getButtonConfig(task.status);

  return (
    <div className={`flex flex-col rounded-lg border-2 ${getBorderColor(task.status)} p-5 gap-3 bg-white hover:shadow-md transition-shadow`}>
      {/* Title */}
      <p className="text-gray-900 text-base font-bold">{task.title}</p>
      
      {/* Project */}
      <p className="text-gray-600 text-sm">Project {task.project || 'N/A'}</p>
      
      {/* Status and Button */}
      <div className="flex items-center justify-between mt-2 gap-3">
        <span className={`text-xs font-medium px-3 py-1 rounded-full ${statusDisplay.color}`}>
          {statusDisplay.label}
        </span>
        <button 
          onClick={handleStatusChange}
          disabled={loading}
          className={`min-w-[84px] h-8 px-4 rounded-lg text-white text-sm font-medium ${buttonConfig.color} disabled:opacity-50 disabled:cursor-not-allowed transition`}
        >
          {loading ? '...' : buttonConfig.label}
        </button>
      </div>
    </div>
  );
};

export default TaskCard;