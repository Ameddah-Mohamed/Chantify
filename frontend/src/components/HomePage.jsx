import React from 'react';

const HomePage = () => {
  return (
    <div className="p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Welcome to Chantify</h1>
          <p className="text-gray-600 text-lg">Task and Project Management System</p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Active Projects</h3>
            <p className="text-3xl font-bold text-gray-900">12</p>
            <p className="text-green-600 text-sm mt-1">+3 this week</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Total Tasks</h3>
            <p className="text-3xl font-bold text-gray-900">248</p>
            <p className="text-blue-600 text-sm mt-1">15 completed today</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Team Members</h3>
            <p className="text-3xl font-bold text-gray-900">36</p>
            <p className="text-gray-600 text-sm mt-1">8 online now</p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-gray-500 text-sm font-medium mb-2">Completion Rate</h3>
            <p className="text-3xl font-bold text-gray-900">89%</p>
            <p className="text-green-600 text-sm mt-1">+2% from last month</p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-lg p-6 shadow-sm border">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button className="p-4 bg-blue-50 rounded-lg border border-blue-200 text-left hover:bg-blue-100 transition-colors">
              <h3 className="font-medium text-blue-900">Create New Task</h3>
              <p className="text-blue-600 text-sm mt-1">Add a new task to your project</p>
            </button>
            <button className="p-4 bg-green-50 rounded-lg border border-green-200 text-left hover:bg-green-100 transition-colors">
              <h3 className="font-medium text-green-900">View Reports</h3>
              <p className="text-green-600 text-sm mt-1">Check project progress and analytics</p>
            </button>
            <button className="p-4 bg-purple-50 rounded-lg border border-purple-200 text-left hover:bg-purple-100 transition-colors">
              <h3 className="font-medium text-purple-900">Manage Team</h3>
              <p className="text-purple-600 text-sm mt-1">Add or manage team members</p>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;