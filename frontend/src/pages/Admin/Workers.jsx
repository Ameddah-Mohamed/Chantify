// frontend/src/pages/Admin/Workers.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Workers = () => {
  const navigate = useNavigate();
  const [workers, setWorkers] = useState([]);
  const [pendingApplications, setPendingApplications] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobTypeFilter, setJobTypeFilter] = useState('All');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [workerToDelete, setWorkerToDelete] = useState(null);
  const [activeTab, setActiveTab] = useState('active'); // 'active' or 'pending'

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [workersRes, pendingRes, jobTypesRes] = await Promise.all([
        fetch('http://localhost:8000/api/company/users', {
          credentials: 'include'
        }),
        fetch('http://localhost:8000/api/company/applications/pending', {
          credentials: 'include'
        }),
        fetch('http://localhost:8000/api/jobtypes', {
          credentials: 'include'
        })
      ]);

      if (!workersRes.ok) throw new Error('Failed to fetch workers');
      if (!pendingRes.ok) throw new Error('Failed to fetch pending applications');
      if (!jobTypesRes.ok) throw new Error('Failed to fetch job types');

      const workersData = await workersRes.json();
      const pendingData = await pendingRes.json();
      const jobTypesData = await jobTypesRes.json();

      setWorkers(workersData);
      setPendingApplications(pendingData);
      setJobTypes(jobTypesData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (userId) => {
    try {
      const response = await fetch('http://localhost:8000/api/company/applications/approve', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to approve application');
      }

      await fetchData(); // Refresh data
      alert('Application approved successfully!');
    } catch (err) {
      alert(err.message);
      console.error('Error approving application:', err);
    }
  };

  const handleReject = async (userId) => {
    try {
      const response = await fetch('http://localhost:8000/api/company/applications/reject', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ userId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to reject application');
      }

      await fetchData(); // Refresh data
      alert('Application rejected');
    } catch (err) {
      alert(err.message);
      console.error('Error rejecting application:', err);
    }
  };

  const handleDelete = async () => {
    if (!workerToDelete) return;

    try {
      const response = await fetch(`http://localhost:8000/api/company/users/${workerToDelete._id}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete worker');
      }

      await fetchData();
      setShowDeleteModal(false);
      setWorkerToDelete(null);
      alert('Worker deleted successfully');
    } catch (err) {
      alert(err.message);
      console.error('Error deleting worker:', err);
    }
  };

  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      const response = await fetch(`http://localhost:8000/api/company/users/${userId}/toggle-status`, {
        method: 'PATCH',
        credentials: 'include'
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to toggle status');
      }

      await fetchData();
      alert(`Worker ${!currentStatus ? 'activated' : 'deactivated'} successfully`);
    } catch (err) {
      alert(err.message);
      console.error('Error toggling status:', err);
    }
  };

  const filteredWorkers = jobTypeFilter === 'All'
    ? workers
    : workers.filter(w => w.jobTypeId?.name === jobTypeFilter);

  if (loading) {
    return (
      <div className="flex-1 pt-20 md:pt-8 pb-4 md:pb-8 px-4 md:px-8 bg-[#f8f7f5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e2987] mx-auto mb-4"></div>
          <p className="text-[#8a7a60]">Loading workers...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pt-20 md:pt-8 pb-4 md:pb-8 px-4 md:px-8 bg-[#f8f7f5] overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-4xl font-black text-[#181511] mb-2">Workers Management</h1>
          <p className="text-[#8a7a60] text-sm md:text-base">Oversee and manage company workers. Workers are automatically added when they sign up and get approved.</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-6 border-b border-[#e6e2db]">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'active'
                ? 'text-[#f3ae3f] border-b-2 border-[#f3ae3f]'
                : 'text-[#8a7a60] hover:text-[#181511]'
            }`}
          >
            Active Workers ({workers.length})
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 font-medium transition-colors relative ${
              activeTab === 'pending'
                ? 'text-[#f3ae3f] border-b-2 border-[#f3ae3f]'
                : 'text-[#8a7a60] hover:text-[#181511]'
            }`}
          >
            Pending Applications ({pendingApplications.length})
            {pendingApplications.length > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                {pendingApplications.length}
              </span>
            )}
          </button>
        </div>

        {/* Active Workers Tab */}
        {activeTab === 'active' && (
          <>
            {/* Filter */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-6">
              <span className="text-sm font-medium text-[#8a7a60]">Filter by Job Type:</span>
              <select 
                value={jobTypeFilter}
                onChange={(e) => setJobTypeFilter(e.target.value)}
                className="rounded-lg border-0 bg-white py-2.5 px-4 text-[#181511] text-sm font-medium ring-1 ring-inset ring-[#e6e2db] focus:ring-2 focus:ring-[#1e2987] w-full sm:w-auto"
              >
                <option>All</option>
                {jobTypes.map((jobType) => (
                  <option key={jobType._id} value={jobType.name}>
                    {jobType.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Desktop Table View */}
            <div className="hidden md:block bg-white rounded-lg border border-[#e6e2db] overflow-hidden">
              <table className="w-full">
                <thead className="border-b border-[#e6e2db]">
                  <tr className="bg-white">
                    <th className="px-6 py-4 text-left text-[#8a7a60] text-xs font-medium uppercase">Name</th>
                    <th className="px-6 py-4 text-left text-[#8a7a60] text-xs font-medium uppercase">Email</th>
                    <th className="px-6 py-4 text-left text-[#8a7a60] text-xs font-medium uppercase">Phone</th>
                    <th className="px-6 py-4 text-left text-[#8a7a60] text-xs font-medium uppercase">Job Type</th>
                    <th className="px-6 py-4 text-left text-[#8a7a60] text-xs font-medium uppercase">Hourly Rate</th>
                    <th className="px-6 py-4 text-left text-[#8a7a60] text-xs font-medium uppercase">Status</th>
                    <th className="px-6 py-4 text-right text-[#8a7a60] text-xs font-medium uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredWorkers.length === 0 ? (
                    <tr>
                      <td colSpan="7" className="px-6 py-12 text-center text-[#8a7a60]">
                        No workers found. Add your first worker to get started.
                      </td>
                    </tr>
                  ) : (
                    filteredWorkers.map((worker) => (
                      <tr key={worker._id} className="border-t border-[#e6e2db] hover:bg-[#f8f7f5] cursor-pointer">
                        <td 
                          onClick={() => navigate(`/manager/workers/${worker._id}`)}
                          className="px-6 py-4 text-[#181511] text-sm font-medium hover:text-[#1e2987]"
                        >
                          {worker.personalInfo?.firstName} {worker.personalInfo?.lastName}
                        </td>
                        <td className="px-6 py-4 text-[#8a7a60] text-sm">{worker.email}</td>
                        <td className="px-6 py-4 text-[#8a7a60] text-sm">
                          {worker.personalInfo?.phone || 'N/A'}
                        </td>
                        <td className="px-6 py-4 text-[#8a7a60] text-sm">
                          {worker.jobTypeId?.name || 'Unassigned'}
                        </td>
                        <td className="px-6 py-4 text-[#8a7a60] text-sm">
                          {worker.hourlyRate?.toFixed(2)} DZD/hr
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                            worker.isActive
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-600'
                          }`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${
                              worker.isActive ? 'bg-green-500' : 'bg-gray-400'
                            }`}></span>
                            {worker.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex justify-end gap-2">
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                navigate(`/manager/workers/${worker._id}`);
                              }}
                              className="px-3 py-1.5 rounded-lg hover:bg-blue-500/10 text-blue-600 text-sm font-medium transition-colors"
                            >
                              View Profile
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleStatus(worker._id, worker.isActive);
                              }}
                              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                                worker.isActive
                                  ? 'hover:bg-gray-500/10 text-gray-600'
                                  : 'hover:bg-green-500/10 text-green-600'
                              }`}
                            >
                              {worker.isActive ? 'Deactivate' : 'Activate'}
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setWorkerToDelete(worker);
                                setShowDeleteModal(true);
                              }}
                              className="px-3 py-1.5 rounded-lg hover:bg-red-500/10 text-red-500 text-sm font-medium transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>

            {/* Mobile Card View for Active Workers */}
            <div className="md:hidden space-y-4">
              {filteredWorkers.length === 0 ? (
                <div className="bg-white rounded-lg border border-[#e6e2db] p-8 text-center text-[#8a7a60]">
                  No workers found.
                </div>
              ) : (
                filteredWorkers.map((worker) => (
                  <div 
                    key={worker._id} 
                    className="bg-white rounded-lg border border-[#e6e2db] p-4"
                    onClick={() => navigate(`/manager/workers/${worker._id}`)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <h3 className="text-lg font-semibold text-[#181511]">
                          {worker.personalInfo?.firstName} {worker.personalInfo?.lastName}
                        </h3>
                        <p className="text-[#8a7a60] text-sm">{worker.email}</p>
                      </div>
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium ${
                        worker.isActive
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${
                          worker.isActive ? 'bg-green-500' : 'bg-gray-400'
                        }`}></span>
                        {worker.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between">
                        <span className="text-[#8a7a60] text-sm">Phone:</span>
                        <span className="text-[#181511] font-medium">{worker.personalInfo?.phone || 'N/A'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8a7a60] text-sm">Job Type:</span>
                        <span className="text-[#181511] font-medium">{worker.jobTypeId?.name || 'Unassigned'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#8a7a60] text-sm">Hourly Rate:</span>
                        <span className="text-[#181511] font-medium">{worker.hourlyRate?.toFixed(2)} DZD/hr</span>
                      </div>
                    </div>

                    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                      <button 
                        onClick={() => handleToggleStatus(worker._id, worker.isActive)}
                        className={`flex-1 px-3 py-2 rounded-lg text-sm font-medium transition-colors border ${
                          worker.isActive
                            ? 'hover:bg-gray-500/10 text-gray-600 border-gray-300'
                            : 'hover:bg-green-500/10 text-green-600 border-green-300'
                        }`}
                      >
                        {worker.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                      <button 
                        onClick={() => {
                          setWorkerToDelete(worker);
                          setShowDeleteModal(true);
                        }}
                        className="flex-1 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-500 text-sm font-medium transition-colors border border-red-500/30"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </>
        )}

        {/* Pending Applications Tab */}
        {activeTab === 'pending' && (
          <div className="space-y-4">
            {pendingApplications.length === 0 ? (
              <div className="bg-white rounded-lg border border-[#e6e2db] p-12 text-center">
                <p className="text-[#8a7a60] text-lg">No pending applications</p>
                <p className="text-[#8a7a60] text-sm mt-2">New worker applications will appear here</p>
              </div>
            ) : (
              pendingApplications.map((application) => (
                <div key={application._id} className="bg-white rounded-lg border border-[#e6e2db] p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-12 h-12 bg-[#f3ae3f] rounded-full flex items-center justify-center">
                          <span className="text-white font-semibold text-lg">
                            {application.personalInfo?.firstName?.[0]}{application.personalInfo?.lastName?.[0]}
                          </span>
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-[#181511]">
                            {application.personalInfo?.firstName} {application.personalInfo?.lastName}
                          </h3>
                          <p className="text-[#8a7a60] text-sm">{application.email}</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                        <div>
                          <span className="text-[#8a7a60]">Phone:</span>
                          <span className="ml-2 text-[#181511] font-medium">
                            {application.personalInfo?.phone || 'N/A'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#8a7a60]">Job Type:</span>
                          <span className="ml-2 text-[#181511] font-medium">
                            {application.jobTypeId?.name || 'Unassigned'}
                          </span>
                        </div>
                        <div>
                          <span className="text-[#8a7a60]">Hourly Rate:</span>
                          <span className="ml-2 text-[#181511] font-medium">
                            {application.hourlyRate?.toFixed(2)} DZD/hr
                          </span>
                        </div>
                        <div>
                          <span className="text-[#8a7a60]">Applied:</span>
                          <span className="ml-2 text-[#181511] font-medium">
                            {new Date(application.appliedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-2 md:ml-4">
                      <button
                        onClick={() => handleApprove(application._id)}
                        className="px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(application._id)}
                        className="px-6 py-2.5 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Summary Stats */}
        {activeTab === 'active' && (
          <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg border border-[#e6e2db]">
              <p className="text-[#8a7a60] text-sm">Total Workers</p>
              <p className="text-2xl font-bold text-[#181511]">{workers.length}</p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-[#e6e2db]">
              <p className="text-[#8a7a60] text-sm">Active Workers</p>
              <p className="text-2xl font-bold text-green-600">
                {workers.filter(w => w.isActive).length}
              </p>
            </div>
            <div className="bg-white p-4 rounded-lg border border-[#e6e2db]">
              <p className="text-[#8a7a60] text-sm">Pending Applications</p>
              <p className="text-2xl font-bold text-yellow-600">
                {pendingApplications.length}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full">
            <div className="p-6">
              <h2 className="text-2xl font-bold text-[#181511] mb-4">Delete Worker</h2>
              <p className="text-[#8a7a60] mb-6">
                Are you sure you want to delete{' '}
                <strong>
                  {workerToDelete?.personalInfo?.firstName} {workerToDelete?.personalInfo?.lastName}
                </strong>
                ? This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setWorkerToDelete(null);
                  }}
                  className="flex-1 px-4 py-2 border border-[#e6e2db] rounded-lg text-[#8a7a60] hover:bg-[#f8f7f5] transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Workers;