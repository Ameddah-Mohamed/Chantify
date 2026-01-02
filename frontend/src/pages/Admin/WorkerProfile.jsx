// frontend/src/pages/Admin/WorkerProfile.jsx
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, Calendar, Clock } from 'lucide-react';
import { userAPI } from '../../API/userAPI';
import { workerTaskAPI } from '../../API/workerTaskAPI';
import timeEntryAPI from '../../API/timeEntryAPI';

const WorkerProfile = () => {
  const { workerId } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [workerTasks, setWorkerTasks] = useState([]);
  const [monthlySummaries, setMonthlySummaries] = useState([]);
  const [sessionHistory, setSessionHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState('tasks'); // 'tasks', 'sessions', 'monthly'
  const [formData, setFormData] = useState({
    hourlyRate: 0,
    baseSalary: 0,
    expectedHoursPerDay: null,
    workingDaysPerMonth: 22
  });

  useEffect(() => {
    fetchWorkerData();
  }, [workerId]);

  const fetchWorkerData = async () => {
    try {
      setLoading(true);
      const [workerRes, tasksRes, monthlyRes, sessionsRes] = await Promise.all([
        fetch(`http://localhost:8000/api/users/${workerId}`, {
          credentials: 'include'
        }),
        fetch(`http://localhost:8000/api/worker-tasks/worker/${workerId}`, {
          credentials: 'include'
        }),
        timeEntryAPI.getMonthlySummaries(workerId).catch(() => ({ data: [] })),
        timeEntryAPI.getSessionHistory(workerId, 50, 0).catch(() => ({ data: [] }))
      ]);

      if (!workerRes.ok) throw new Error('Failed to fetch worker');
      
      const workerData = await workerRes.json();
      setWorker(workerData);
      setFormData({
        hourlyRate: workerData.hourlyRate || 0,
        baseSalary: workerData.baseSalary || 0,
        expectedHoursPerDay: workerData.expectedHoursPerDay,
        workingDaysPerMonth: workerData.workingDaysPerMonth || 22
      });

      if (tasksRes.ok) {
        const tasksData = await tasksRes.json();
        setWorkerTasks(tasksData.data || []);
      }

      setMonthlySummaries(monthlyRes.data || []);
      setSessionHistory(sessionsRes.data || []);
    } catch (err) {
      console.error('Error fetching worker data:', err);
      alert('Failed to load worker data');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePaymentInfo = async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/users/${workerId}/payment-info`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(formData)
      });

      if (!response.ok) throw new Error('Failed to update payment info');

      alert('Payment information updated successfully!');
      setEditing(false);
      fetchWorkerData();
    } catch (err) {
      alert(err.message || 'Failed to update payment info');
    }
  };

  const getMonthName = (month) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                    'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month - 1] || 'Unknown';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex-1 pt-20 md:pt-8 pb-4 md:pb-8 px-4 md:px-8 bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading worker profile...</p>
        </div>
      </div>
    );
  }

  if (!worker) {
    return (
      <div className="flex-1 pt-20 md:pt-8 pb-4 md:pb-8 px-4 md:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <button onClick={() => navigate('/manager/workers')} className="mb-4 text-blue-600 hover:text-blue-800">
            ← Back to Workers
          </button>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            Worker not found
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pt-20 md:pt-8 pb-4 md:pb-8 px-4 md:px-8 bg-gray-50 overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => navigate('/manager/workers')}
            className="mb-4 text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Workers
          </button>
          <h1 className="text-3xl font-bold text-gray-900">Worker Profile</h1>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Info & Payment */}
          <div className="space-y-6">
            {/* Personal Info Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-2xl font-bold">
                    {worker.personalInfo?.firstName?.[0]}{worker.personalInfo?.lastName?.[0]}
                  </span>
                </div>
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {worker.personalInfo?.firstName} {worker.personalInfo?.lastName}
                  </h2>
                  <p className="text-gray-600">{worker.jobTypeId?.name || 'Worker'}</p>
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="text-sm font-medium text-gray-900">{worker.email}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Phone</p>
                  <p className="text-sm font-medium text-gray-900">
                    {worker.personalInfo?.phone || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Status</p>
                  <span className={`inline-block px-2 py-1 rounded-full text-xs font-semibold ${
                    worker.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}>
                    {worker.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>
            </div>

            {/* Payment Info Card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-bold text-gray-900">Payment Information</h3>
                {!editing && (
                  <button
                    onClick={() => setEditing(true)}
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                  >
                    Edit
                  </button>
                )}
              </div>

              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Hourly Rate (DZD)</label>
                    <input
                      type="number"
                      value={formData.hourlyRate}
                      onChange={(e) => setFormData({ ...formData, hourlyRate: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Base Salary (DZD)</label>
                    <input
                      type="number"
                      value={formData.baseSalary}
                      onChange={(e) => setFormData({ ...formData, baseSalary: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      step="0.01"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Expected Hours Per Day (Leave empty to use Job Type default)</label>
                    <input
                      type="number"
                      value={formData.expectedHoursPerDay === null ? '' : formData.expectedHoursPerDay}
                      onChange={(e) => setFormData({ ...formData, expectedHoursPerDay: e.target.value === '' ? null : parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="0"
                      max="12"
                      step="0.5"
                      placeholder="Default: Use Job Type value"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Working Days Per Month</label>
                    <input
                      type="number"
                      value={formData.workingDaysPerMonth}
                      onChange={(e) => setFormData({ ...formData, workingDaysPerMonth: parseFloat(e.target.value) || 22 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="31"
                      step="1"
                    />
                  </div>

                  <div className="flex gap-2 pt-2">
                    <button
                      onClick={handleUpdatePaymentInfo}
                      className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setEditing(false);
                        setFormData({
                          hourlyRate: worker.hourlyRate || 0,
                          baseSalary: worker.baseSalary || 0,
                          expectedHoursPerDay: worker.expectedHoursPerDay,
                          workingDaysPerMonth: worker.workingDaysPerMonth || 22
                        });
                      }}
                      className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-300"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Hourly Rate</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {worker.hourlyRate?.toFixed(2) || '0.00'} DZD/hr
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Base Salary</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {worker.baseSalary?.toFixed(2) || '0.00'} DZD
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Expected Hours/Day</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {worker.expectedHoursPerDay !== null && worker.expectedHoursPerDay !== undefined 
                        ? worker.expectedHoursPerDay + ' hrs'
                        : (worker.jobTypeId?.expectedHoursPerDay || 8) + ' hrs (default)'
                      }
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600">Working Days/Month</span>
                    <span className="text-sm font-semibold text-gray-900">
                      {worker.workingDaysPerMonth || 22} days
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Monthly Summary Card */}
            {monthlySummaries.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">📊 Monthly Hours Summary</h3>
                <div className="space-y-3 max-h-[300px] overflow-y-auto">
                  {monthlySummaries.slice(0, 6).map((summary) => (
                    <div key={summary._id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition">
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-gray-900">
                          {getMonthName(summary.month)} {summary.year}
                        </p>
                        <p className="text-xs text-gray-500">{summary.workDaysCount} days worked</p>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-blue-600 block">
                          {summary.totalMonthlyHours.toFixed(1)}h
                        </span>
                        <p className="text-xs text-gray-500">
                          {((summary.totalMonthlyHours / 160) * 100).toFixed(0)}% of 160h
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Tabs */}
          <div className="lg:col-span-2">
            {/* Quick Recent Sessions Preview */}
            {sessionHistory.length > 0 && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm mb-6">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">⏱️ Recent Work Sessions</h3>
                  <p className="text-sm text-gray-600 mt-1">Last 5 sessions (most recent first)</p>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-3 text-left font-semibold text-gray-900">Date</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-900">Time</th>
                        <th className="px-6 py-3 text-right font-semibold text-gray-900">Hours</th>
                        <th className="px-6 py-3 text-left font-semibold text-gray-900">Location</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {sessionHistory.slice(0, 5).map((session) => (
                        <tr key={session._id} className="hover:bg-gray-50 transition">
                          <td className="px-6 py-4 text-gray-900 font-medium">
                            {formatDate(session.workDate)}
                          </td>
                          <td className="px-6 py-4 text-gray-600 text-xs">
                            {formatTime(session.clockInTime)} - {formatTime(session.clockOutTime)}
                          </td>
                          <td className="px-6 py-4 text-right font-bold text-blue-600">
                            {session.totalHours.toFixed(2)}h
                          </td>
                          <td className="px-6 py-4">
                            {session.clockInLocation ? (
                              <a
                                href={`https://www.google.com/maps?q=${session.clockInLocation.latitude},${session.clockInLocation.longitude}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-1 text-blue-600 hover:text-blue-800 text-xs font-medium"
                              >
                                <MapPin className="w-3 h-3" />
                                {session.clockInLocation.address || `${session.clockInLocation.latitude.toFixed(3)}, ${session.clockInLocation.longitude.toFixed(3)}`}
                              </a>
                            ) : (
                              <span className="text-gray-400 text-xs">No location</span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Tab Navigation */}
            <div className="flex gap-2 mb-4 bg-white rounded-xl border border-gray-200 p-2">
              <button
                onClick={() => setTab('tasks')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === 'tasks'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Tasks
              </button>
              <button
                onClick={() => setTab('sessions')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === 'sessions'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Session History
              </button>
              <button
                onClick={() => setTab('monthly')}
                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
                  tab === 'monthly'
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                Monthly Breakdown
              </button>
            </div>

            {/* Tasks Tab */}
            {tab === 'tasks' && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Tasks & Uploaded Files</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {workerTasks.length} task(s) assigned
                  </p>
                </div>

                <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                  {workerTasks.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No tasks assigned yet
                    </div>
                  ) : (
                    workerTasks.map((wt) => (
                      <div key={wt._id} className="p-6 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {wt.taskId?.title || 'Task'}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2">
                              {wt.taskId?.description || 'No description'}
                            </p>
                            <div className="flex items-center gap-3 text-xs text-gray-500">
                              <span>Project: {wt.taskId?.project || 'N/A'}</span>
                              <span>•</span>
                              <span>Location: {wt.taskId?.location || 'N/A'}</span>
                            </div>
                          </div>
                          <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            wt.status === 'completed' ? 'bg-green-100 text-green-800' :
                            wt.status === 'in-progress' ? 'bg-orange-100 text-orange-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {wt.status}
                          </span>
                        </div>

                        {/* Files */}
                        {wt.files && wt.files.length > 0 && (
                          <div className="mt-4 pt-4 border-t border-gray-100">
                            <p className="text-xs font-semibold text-gray-700 mb-2">
                              Uploaded Files ({wt.files.length})
                            </p>
                            <div className="space-y-2">
                              {wt.files.map((file, idx) => (
                                <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                  <div>
                                    <p className="text-sm font-medium text-gray-900">{file.fileName}</p>
                                    <p className="text-xs text-gray-500">
                                      {new Date(file.uploadedAt).toLocaleDateString()}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Timestamps */}
                        <div className="mt-3 text-xs text-gray-500 space-y-1">
                          {wt.startedAt && (
                            <p>Started: {new Date(wt.startedAt).toLocaleString()}</p>
                          )}
                          {wt.completedAt && (
                            <p>Completed: {new Date(wt.completedAt).toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Session History Tab */}
            {tab === 'sessions' && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Work Sessions</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {sessionHistory.length} session(s) recorded
                  </p>
                </div>

                <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                  {sessionHistory.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No sessions recorded
                    </div>
                  ) : (
                    sessionHistory.map((session) => (
                      <div key={session._id} className="p-6 hover:bg-gray-50">
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex-1">
                            <p className="font-semibold text-gray-900">
                              {formatDate(session.workDate)}
                            </p>
                            <div className="flex items-center gap-2 mt-2 text-sm text-gray-600">
                              <Clock className="w-4 h-4" />
                              <span>
                                {formatTime(session.clockInTime)} - {formatTime(session.clockOutTime)}
                              </span>
                            </div>
                          </div>
                          <span className="text-lg font-bold text-blue-600">
                            {session.totalHours.toFixed(1)}h
                          </span>
                        </div>

                        {/* Location */}
                        {session.clockInLocation && (
                          <div className="mt-3 p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-2 text-sm text-gray-700">
                              <MapPin className="w-4 h-4 text-orange-500" />
                              <span>
                                Clock-in: {session.clockInLocation.latitude.toFixed(4)}, {session.clockInLocation.longitude.toFixed(4)}
                              </span>
                            </div>
                            {session.clockInLocation.address && (
                              <p className="text-xs text-gray-500 mt-1">
                                {session.clockInLocation.address}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* Monthly Breakdown Tab */}
            {tab === 'monthly' && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
                <div className="p-6 border-b border-gray-200">
                  <h3 className="text-lg font-bold text-gray-900">Monthly Hours Breakdown</h3>
                  <p className="text-sm text-gray-600 mt-1">
                    Total worked hours by month
                  </p>
                </div>

                <div className="divide-y divide-gray-200 max-h-[600px] overflow-y-auto">
                  {monthlySummaries.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      No monthly data available
                    </div>
                  ) : (
                    monthlySummaries.map((summary) => (
                      <div key={summary._id} className="p-6 hover:bg-gray-50">
                        <div className="flex justify-between items-center mb-4">
                          <div>
                            <h4 className="font-semibold text-gray-900">
                              {getMonthName(summary.month)} {summary.year}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {summary.workDaysCount} days worked
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-3xl font-bold text-blue-600">
                              {summary.totalMonthlyHours.toFixed(1)}
                            </p>
                            <p className="text-xs text-gray-500">Hours</p>
                          </div>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${Math.min((summary.totalMonthlyHours / (8 * 20)) * 100, 100)}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 mt-2">
                          {((summary.totalMonthlyHours / (8 * 20)) * 100).toFixed(1)}% of expected monthly hours (160h)
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;