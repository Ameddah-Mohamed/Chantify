import React, { useState, useEffect } from 'react';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeRange, setTimeRange] = useState('week');

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/dashboard/stats?range=${timeRange}`, {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch dashboard data');
      
      const data = await response.json();
      setStats(data);
      setError(null);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 p-4 md:p-8 bg-[#f8f7f5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e2987] mx-auto mb-4"></div>
          <p className="text-[#8a7a60]">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 p-4 md:p-8 bg-[#f8f7f5]">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-600">
          {error}
        </div>
      </div>
    );
  }

  const COLORS = ['#1e2987', '#f3ae3f', '#82ca9d', '#8884d8'];

  return (
    <div className="flex-1 pt-20 md:pt-8 p-4 md:p-8 bg-[#f8f7f5] overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-[#181511] mb-2">Dashboard</h1>
            <p className="text-[#8a7a60] text-sm md:text-base">Overview of your company's performance</p>
          </div>
          
          {/* Time Range Filter */}
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="w-full md:w-auto rounded-lg border-0 bg-white py-2.5 px-4 text-[#181511] text-sm font-medium ring-1 ring-inset ring-[#e6e2db] focus:ring-2 focus:ring-[#1e2987]"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white p-4 md:p-6 rounded-lg border border-[#e6e2db] shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#8a7a60] text-xs md:text-sm mb-1">Total Workers</p>
                <p className="text-2xl md:text-3xl font-bold text-[#181511]">{stats?.totalWorkers || 0}</p>
                <p className="text-xs md:text-sm text-green-600 mt-1">
                  {stats?.activeWorkers || 0} active
                </p>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[#1e2987]/10 rounded-full flex items-center justify-center">
                <span className="text-2xl md:text-3xl">👥</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg border border-[#e6e2db] shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#8a7a60] text-xs md:text-sm mb-1">Active Tasks</p>
                <p className="text-2xl md:text-3xl font-bold text-[#181511]">{stats?.activeTasks || 0}</p>
                <p className="text-xs md:text-sm text-[#f3ae3f] mt-1">
                  {stats?.inProgressTasks || 0} in progress
                </p>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-[#f3ae3f]/10 rounded-full flex items-center justify-center">
                <span className="text-2xl md:text-3xl">📋</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg border border-[#e6e2db] shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#8a7a60] text-xs md:text-sm mb-1">Completed Tasks</p>
                <p className="text-2xl md:text-3xl font-bold text-[#181511]">{stats?.completedTasks || 0}</p>
                <p className="text-xs md:text-sm text-green-600 mt-1">
                  {stats?.completionRate || 0}% rate
                </p>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl md:text-3xl">✅</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 md:p-6 rounded-lg border border-[#e6e2db] shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[#8a7a60] text-xs md:text-sm mb-1">Pending Applications</p>
                <p className="text-2xl md:text-3xl font-bold text-[#181511]">{stats?.pendingApplications || 0}</p>
                <p className="text-xs md:text-sm text-yellow-600 mt-1">
                  Need review
                </p>
              </div>
              <div className="w-12 h-12 md:w-14 md:h-14 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-2xl md:text-3xl">⏳</span>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          {/* Task Status Chart */}
          <div className="bg-white p-4 md:p-6 rounded-lg border border-[#e6e2db]">
            <h2 className="text-lg md:text-xl font-bold text-[#181511] mb-4">Task Distribution</h2>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={stats?.taskDistribution || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(stats?.taskDistribution || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Workers by Job Type */}
          <div className="bg-white p-4 md:p-6 rounded-lg border border-[#e6e2db]">
            <h2 className="text-lg md:text-xl font-bold text-[#181511] mb-4">Workers by Job Type</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={stats?.workersByJobType || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="jobType" angle={-45} textAnchor="end" height={80} />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#1e2987" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Task Completion Trend */}
        <div className="bg-white p-4 md:p-6 rounded-lg border border-[#e6e2db] mb-6 md:mb-8">
          <h2 className="text-lg md:text-xl font-bold text-[#181511] mb-4">Task Completion Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats?.taskCompletionTrend || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="completed" stroke="#1e2987" strokeWidth={2} name="Completed Tasks" />
              <Line type="monotone" dataKey="created" stroke="#f3ae3f" strokeWidth={2} name="Created Tasks" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Activity & Top Performers */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* Recent Activity */}
          <div className="bg-white p-4 md:p-6 rounded-lg border border-[#e6e2db]">
            <h2 className="text-lg md:text-xl font-bold text-[#181511] mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {(stats?.recentActivity || []).map((activity, index) => (
                <div key={index} className="flex items-start gap-3 pb-3 border-b border-[#e6e2db] last:border-0">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                    activity.type === 'task_completed' ? 'bg-green-100' :
                    activity.type === 'task_started' ? 'bg-blue-100' :
                    'bg-yellow-100'
                  }`}>
                    {activity.type === 'task_completed' ? '✓' : activity.type === 'task_started' ? '▶' : '◆'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-[#181511] truncate">{activity.description}</p>
                    <p className="text-xs text-[#8a7a60]">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Top Performers */}
          <div className="bg-white p-4 md:p-6 rounded-lg border border-[#e6e2db]">
            <h2 className="text-lg md:text-xl font-bold text-[#181511] mb-4">Top Performers</h2>
            <div className="space-y-3">
              {(stats?.topPerformers || []).map((worker, index) => (
                <div key={index} className="flex items-center justify-between pb-3 border-b border-[#e6e2db] last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-[#1e2987] text-white rounded-full flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-[#181511]">{worker.name}</p>
                      <p className="text-xs text-[#8a7a60]">{worker.jobType}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-[#1e2987]">{worker.completedTasks}</p>
                    <p className="text-xs text-[#8a7a60]">tasks done</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;