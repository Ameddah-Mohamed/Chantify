import React from 'react';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { dummyData } from '../../data/dummyData';

const Dashboard = () => {
  return (
    <div className="flex-1 p-8 bg-[#f8f7f5] overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-black text-[#181511] mb-2">Dashboard</h1>
          <p className="text-[#8a7a60] text-base">Overview of your management system</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 border border-[#e6e2db]">
            <p className="text-[#8a7a60] text-base font-medium mb-2">Active Tasks</p>
            <p className="text-[#181511] text-4xl font-bold mb-2">142</p>
            <p className="text-green-600 text-sm font-medium">+5.2% this month</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-[#e6e2db]">
            <p className="text-[#8a7a60] text-base font-medium mb-2">Active Workers</p>
            <p className="text-[#181511] text-4xl font-bold mb-2">36</p>
            <p className="text-green-600 text-sm font-medium">+1.4% this month</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-[#e6e2db]">
            <p className="text-[#8a7a60] text-base font-medium mb-2">Salaries Paid (MTD)</p>
            <p className="text-[#181511] text-4xl font-bold mb-2">$52,480</p>
            <p className="text-green-600 text-sm font-medium">+8.1% vs last month</p>
          </div>
          <div className="bg-white rounded-xl p-6 border border-[#e6e2db]">
            <p className="text-[#8a7a60] text-base font-medium mb-2">Pending Approvals</p>
            <p className="text-[#181511] text-4xl font-bold mb-2">12</p>
            <p className="text-red-500 text-sm font-medium">-2 from yesterday</p>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Salary Trends Line Chart */}
          <div className="bg-white rounded-xl p-6 border border-[#e6e2db]">
            <h3 className="text-lg font-semibold text-[#181511] mb-4">Salary Trends</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={dummyData.salaryTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e6e2db" />
                <XAxis dataKey="month" stroke="#8a7a60" />
                <YAxis stroke="#8a7a60" />
                <Tooltip />
                <Line type="monotone" dataKey="amount" stroke="#1e2987" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Task Status Pie Chart */}
          <div className="bg-white rounded-xl p-6 border border-[#e6e2db]">
            <h3 className="text-lg font-semibold text-[#181511] mb-4">Task Status Distribution</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dummyData.taskStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {dummyData.taskStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Workers by Job Type Bar Chart */}
        <div className="bg-white rounded-xl p-6 border border-[#e6e2db]">
          <h3 className="text-lg font-semibold text-[#181511] mb-4">Workers by Job Type</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dummyData.workersByJobType}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e6e2db" />
              <XAxis dataKey="jobType" stroke="#8a7a60" />
              <YAxis stroke="#8a7a60" />
              <Tooltip />
              <Bar dataKey="count" fill="#f3ae3f" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
