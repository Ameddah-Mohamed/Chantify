import React, { useState } from "react";
import UserSearchSelect from "./UserSearchSelect";
import { taskAPI } from "../API/taskAPI";

export default function TaskForm() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    dueDate: "",
    project: "",
    location: "",
    status: "todo",
    assignedTo: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUsersChange = (userIds) => {
    setFormData(prev => ({
      ...prev,
      assignedTo: userIds
    }));
  };

  const handleClear = () => {
    setFormData({
      title: "",
      description: "",
      dueDate: "",
      project: "",
      location: "",
      status: "todo",
      assignedTo: []
    });
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      console.log('Creating task with data:', formData);
      console.log('Assigned to users:', formData.assignedTo);
      const response = await taskAPI.createTask(formData);
      console.log('Task created:', response.data);
      setSuccess(true);
      handleClear();
      
      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err.message || 'Failed to create task');
      console.error('Error creating task:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl border border-gray-200 shadow-sm max-w-3xl mx-auto my-8">
      {error && (
        <div className="mb-4 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-4 bg-green-50 border border-green-200 text-green-700 rounded-lg">
          Task created successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Task Title */}
        <div>
          <label className="block pb-2 font-medium text-gray-700">Task Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            placeholder="Enter a short, descriptive title"
            className="w-full h-14 px-4 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block pb-2 font-medium text-gray-700">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="5"
            placeholder="Add a detailed description for the task"
            className="w-full px-4 py-3 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition resize-none"
          />
        </div>

        {/* Project and Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block pb-2 font-medium text-gray-700">Project</label>
            <input
              type="text"
              name="project"
              value={formData.project}
              onChange={handleChange}
              placeholder="e.g., Skyview Tower"
              className="w-full h-14 px-4 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
          </div>

          <div>
            <label className="block pb-2 font-medium text-gray-700">Location</label>
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g., Building A, Floor 5"
              className="w-full h-14 px-4 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
            />
          </div>
        </div>

        {/* User Assignment */}
        <UserSearchSelect
          selectedUsers={formData.assignedTo}
          onUsersChange={handleUsersChange}
        />

        {/* Deadline */}
        <div>
          <label className="block pb-2 font-medium text-gray-700">Deadline</label>
          <input
            type="date"
            name="dueDate"
            value={formData.dueDate}
            onChange={handleChange}
            className="w-full h-14 px-4 rounded-lg bg-gray-50 border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={handleClear}
            disabled={loading}
            className="h-12 px-6 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg font-semibold transition disabled:opacity-50"
          >
            Clear Form
          </button>
          <button
            type="submit"
            disabled={loading}
            className="h-12 px-6 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Task'}
          </button>
        </div>
      </form>
    </div>
  );
}
