import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle, Loader, Mail, Phone, Briefcase } from 'lucide-react';

const WorkerRequests = () => {
  const [pendingWorkers, setPendingWorkers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [approving, setApproving] = useState(null);
  const [rejecting, setRejecting] = useState(null);
  const [activeTab, setActiveTab] = useState('pending'); // 'pending', 'approved', 'rejected'

  useEffect(() => {
    fetchWorkerRequests();
  }, []);

  const fetchWorkerRequests = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('http://localhost:8000/api/users/pending-workers', {
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error('Failed to fetch pending workers');
      }

      const data = await response.json();
      setData(data);
    } catch (err) {
      console.error('Error fetching workers:', err);
      setError(err.message || 'Failed to load pending workers');
    } finally {
      setLoading(false);
    }
  };

  const setData = (data) => {
    const pending = data.filter(w => w.applicationStatus === 'pending') || [];
    const approved = data.filter(w => w.applicationStatus === 'approved') || [];
    const rejected = data.filter(w => w.applicationStatus === 'rejected') || [];
    
    setPendingWorkers({ pending, approved, rejected });
  };

  const handleApprove = async (workerId) => {
    try {
      setApproving(workerId);
      
      const response = await fetch(`http://localhost:8000/api/users/${workerId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status: 'approved' })
      });

      if (!response.ok) {
        throw new Error('Failed to approve worker');
      }

      // Refresh the list
      fetchWorkerRequests();
    } catch (err) {
      console.error('Error approving worker:', err);
      setError(err.message || 'Failed to approve worker');
    } finally {
      setApproving(null);
    }
  };

  const handleReject = async (workerId) => {
    try {
      setRejecting(workerId);
      
      const response = await fetch(`http://localhost:8000/api/users/${workerId}/approve`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ status: 'rejected' })
      });

      if (!response.ok) {
        throw new Error('Failed to reject worker');
      }

      // Refresh the list
      fetchWorkerRequests();
    } catch (err) {
      console.error('Error rejecting worker:', err);
      setError(err.message || 'Failed to reject worker');
    } finally {
      setRejecting(null);
    }
  };

  const getDisplayWorkers = () => {
    if (activeTab === 'pending') return pendingWorkers.pending || [];
    if (activeTab === 'approved') return pendingWorkers.approved || [];
    return pendingWorkers.rejected || [];
  };

  const displayWorkers = getDisplayWorkers();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-20 md:pt-8 flex items-center justify-center">
        <div className="flex items-center gap-3">
          <Loader className="w-6 h-6 text-[#f3ae3f] animate-spin" />
          <span className="text-gray-600">Loading worker requests...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-20 md:pt-8 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Worker Registration Requests</h1>
          <p className="text-gray-600">Review and approve pending worker registrations</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
            {error}
          </div>
        )}

        {/* Tabs */}
        <div className="mb-6 flex gap-4 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'pending'
                ? 'text-[#f3ae3f] border-b-2 border-[#f3ae3f]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              Pending ({pendingWorkers.pending?.length || 0})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('approved')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'approved'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              Approved ({pendingWorkers.approved?.length || 0})
            </div>
          </button>
          <button
            onClick={() => setActiveTab('rejected')}
            className={`px-4 py-2 font-medium transition-colors ${
              activeTab === 'rejected'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-2">
              <XCircle className="w-4 h-4" />
              Rejected ({pendingWorkers.rejected?.length || 0})
            </div>
          </button>
        </div>

        {/* Workers List */}
        {displayWorkers.length === 0 ? (
          <div className="text-center py-12">
            <Clock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500">No {activeTab} workers to display</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {displayWorkers.map((worker) => (
              <div
                key={worker._id}
                className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    {/* Name */}
                    <h3 className="text-lg font-semibold text-gray-900">
                      {worker.personalInfo?.firstName} {worker.personalInfo?.lastName}
                    </h3>

                    {/* Details Grid */}
                    <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                      {/* Email */}
                      <div className="flex items-center gap-2 text-gray-600">
                        <Mail className="w-4 h-4 text-[#f3ae3f]" />
                        <span>{worker.email}</span>
                      </div>

                      {/* Phone */}
                      {worker.personalInfo?.phone && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Phone className="w-4 h-4 text-[#f3ae3f]" />
                          <span>{worker.personalInfo.phone}</span>
                        </div>
                      )}

                      {/* Job Type */}
                      {worker.jobTypeId?.name && (
                        <div className="flex items-center gap-2 text-gray-600">
                          <Briefcase className="w-4 h-4 text-[#f3ae3f]" />
                          <span>{worker.jobTypeId.name}</span>
                        </div>
                      )}
                    </div>

                    {/* Application Date */}
                    {worker.appliedAt && (
                      <p className="text-xs text-gray-500 mt-3">
                        Applied on {new Date(worker.appliedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>

                  {/* Status Badge */}
                  <div className="ml-4 flex-shrink-0">
                    {worker.applicationStatus === 'pending' && (
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Pending
                      </span>
                    )}
                    {worker.applicationStatus === 'approved' && (
                      <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Approved
                      </span>
                    )}
                    {worker.applicationStatus === 'rejected' && (
                      <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Rejected
                      </span>
                    )}
                  </div>
                </div>

                {/* Action Buttons */}
                {activeTab === 'pending' && (
                  <div className="flex gap-3 pt-4 border-t border-gray-100">
                    <button
                      onClick={() => handleApprove(worker._id)}
                      disabled={approving === worker._id}
                      className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      {approving === worker._id ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Approving...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          Approve
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => handleReject(worker._id)}
                      disabled={rejecting === worker._id}
                      className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                    >
                      {rejecting === worker._id ? (
                        <>
                          <Loader className="w-4 h-4 animate-spin" />
                          Rejecting...
                        </>
                      ) : (
                        <>
                          <XCircle className="w-4 h-4" />
                          Reject
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerRequests;
