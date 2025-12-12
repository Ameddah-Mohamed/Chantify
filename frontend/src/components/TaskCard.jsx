import React, { useState } from "react";
import { taskAPI } from "../API/taskAPI";

const TaskCard = ({ task, onStatusUpdate }) => {
  const [loading, setLoading] = useState(false);

  const getStatusDisplay = (status) => {
    const displays = {
      'todo': { label: 'To Do', color: 'bg-gray-200 text-gray-800' },
      'in-progress': { label: 'In Progress', color: 'bg-blue-200 text-blue-800' },
      'completed': { label: 'Completed', color: 'bg-green-200 text-green-800' }
    };
    return displays[status] || displays['todo'];
  };

  const getButtonConfig = (status) => {
    if (status === 'todo') {
      return { label: 'Start Task', color: 'bg-blue-500', nextStatus: 'in-progress' };
    } else if (status === 'in-progress') {
      return { label: 'Complete', color: 'bg-green-500', nextStatus: 'completed' };
    }
    return null;
  };

  const handleStatusChange = async () => {
    const buttonConfig = getButtonConfig(task.status);
    if (!buttonConfig || loading) return;

    setLoading(true);
    try {
      await taskAPI.updateTask(task._id, { status: buttonConfig.nextStatus });
      if (onStatusUpdate) {
        onStatusUpdate();
      }
    } catch (error) {
      console.error('Failed to update task status:', error);
      alert('Failed to update task status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const statusDisplay = getStatusDisplay(task.status);
  const buttonConfig = getButtonConfig(task.status);

  return (
    <div className="flex flex-col rounded-lg shadow-sm border border-gray-200 p-4 gap-3 bg-white">
      <p className="text-gray-900 text-base font-bold">{task.title}</p>
      <p className="text-gray-600 text-sm">Project: {task.project || 'N/A'}</p>
      {task.location && <p className="text-gray-500 text-xs">📍 {task.location}</p>}
      {task.dueDate && (
        <p className="text-gray-500 text-xs">
          📅 Due: {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}
      <div className="flex items-center justify-between mt-2 gap-3">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${statusDisplay.color}`}>
          {statusDisplay.label}
        </span>
        {buttonConfig && (
          <button 
            onClick={handleStatusChange}
            disabled={loading}
            className={`min-w-[84px] h-8 px-4 rounded-lg text-white text-sm font-medium ${buttonConfig.color} hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition`}
          >
            {loading ? '...' : buttonConfig.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default TaskCard;