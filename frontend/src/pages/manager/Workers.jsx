import React, { useState, useEffect } from 'react';
import { workersAPI } from '../../api/workersAPI';

const Workers = () => {
  const [workers, setWorkers] = useState([]);
  const [jobTypes, setJobTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [jobTypeFilter, setJobTypeFilter] = useState('All');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [workerToDelete, setWorkerToDelete] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [workersData, jobTypesData] = await Promise.all([
        workersAPI.getWorkers(),
        workersAPI.getJobTypes()
      ]);
      setWorkers(workersData);
      setJobTypes(jobTypesData);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!workerToDelete) return;

    try {
      await workersAPI.deleteWorker(workerToDelete._id);
      await fetchData();
      setShowDeleteModal(false);
      setWorkerToDelete(null);
    } catch (err) {
      alert(err.message);
      console.error('Error deleting worker:', err);
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
                  <tr key={worker._id} className="border-t border-[#e6e2db] hover:bg-[#f8f7f5]">
                    <td className="px-6 py-4 text-[#181511] text-sm font-medium">
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
                      <div className="flex flex-col gap-1">
                        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium w-fit ${
                          worker.isActive
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-600'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${
                            worker.isActive ? 'bg-green-500' : 'bg-gray-400'
                          }`}></span>
                          {worker.isActive ? 'Active' : 'Inactive'}
                        </span>
                        {worker.applicationStatus === 'pending' && (
                          <span className="inline-flex items-center rounded-full px-3 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 w-fit">
                            Pending Approval
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button 
                          onClick={() => window.location.href = `/manager/workers/${worker._id}/edit`}
                          className="px-3 py-1.5 rounded-lg hover:bg-[#f3ae3f]/20 text-[#f3ae3f] text-sm font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => {
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

        {/* Mobile Card View */}
        <div className="md:hidden space-y-4">
          {filteredWorkers.length === 0 ? (
            <div className="bg-white rounded-lg border border-[#e6e2db] p-8 text-center text-[#8a7a60]">
              No workers found. Add your first worker to get started.
            </div>
          ) : (
            filteredWorkers.map((worker) => (
              <div key={worker._id} className="bg-white rounded-lg border border-[#e6e2db] p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-[#181511]">
                      {worker.personalInfo?.firstName} {worker.personalInfo?.lastName}
                    </h3>
                    <p className="text-[#8a7a60] text-sm">{worker.email}</p>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-medium w-fit ${
                      worker.isActive
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        worker.isActive ? 'bg-green-500' : 'bg-gray-400'
                      }`}></span>
                      {worker.isActive ? 'Active' : 'Inactive'}
                    </span>
                    {worker.applicationStatus === 'pending' && (
                      <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-700 w-fit">
                        Pending
                      </span>
                    )}
                  </div>
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

                <div className="flex gap-2">
                  <button 
                    onClick={() => window.location.href = `/manager/workers/${worker._id}/edit`}
                    className="flex-1 px-3 py-2 rounded-lg hover:bg-[#f3ae3f]/20 text-[#f3ae3f] text-sm font-medium transition-colors border border-[#f3ae3f]/30"
                  >
                    Edit
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

        {/* Summary Stats */}
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
              {workers.filter(w => w.applicationStatus === 'pending').length}
            </p>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-[#181511] mb-4">Delete Worker</h2>
              <p className="text-[#8a7a60] mb-6">
                Are you sure you want to delete{' '}
                <strong>
                  {workerToDelete?.personalInfo?.firstName} {workerToDelete?.personalInfo?.lastName}
                </strong>
                ? This action cannot be undone.
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
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