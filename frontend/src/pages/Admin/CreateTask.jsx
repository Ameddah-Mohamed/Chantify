import React, { useState } from 'react';
import TaskForm from '../../components/TaskForm';

const CreateTask = () => {
  return (
    <div className="flex-1 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Create New Task</h1>
          <p className="text-sm text-gray-600 mt-1">Assign a new task to workers in your company</p>
        </div>

        {/* Task Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <TaskForm />
        </div>
      </div>
    </div>
  );
};

export default CreateTask;