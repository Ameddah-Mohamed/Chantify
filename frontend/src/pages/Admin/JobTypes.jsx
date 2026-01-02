import React, { useState, useEffect } from 'react';
import { jobTypeAPI } from '../../API/jobTypeAPI';

const JobTypes = () => {
  const [jobTypes, setJobTypes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editingJobType, setEditingJobType] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    hourlyRate: '',
    baseSalary: '',
    expectedHoursPerDay: 8
  });

  useEffect(() => {
    fetchJobTypes();
  }, []);

  const fetchJobTypes = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await jobTypeAPI.getJobTypes();
      setJobTypes(data);
    } catch (err) {
      setError(err.message);
      console.error('Error fetching job types:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.name || formData.hourlyRate === '' || !formData.expectedHoursPerDay) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      if (editingJobType) {
        await jobTypeAPI.updateJobType(editingJobType._id, {
          name: formData.name,
          hourlyRate: Number(formData.hourlyRate),
          baseSalary: formData.baseSalary ? Number(formData.baseSalary) : 0,
          expectedHoursPerDay: Number(formData.expectedHoursPerDay)
        });
      } else {
        await jobTypeAPI.createJobType({
          name: formData.name,
          hourlyRate: Number(formData.hourlyRate),
          baseSalary: formData.baseSalary ? Number(formData.baseSalary) : 0,
          expectedHoursPerDay: Number(formData.expectedHoursPerDay)
        });
      }

      await fetchJobTypes();
      handleCloseModal();
    } catch (err) {
      alert(err.message);
      console.error('Error saving job type:', err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this job type?')) {
      return;
    }

    try {
      await jobTypeAPI.deleteJobType(id);
      await fetchJobTypes();
    } catch (err) {
      alert(err.message);
      console.error('Error deleting job type:', err);
    }
  };

  const handleEdit = (jobType) => {
    setEditingJobType(jobType);
    setFormData({
      name: jobType.name,
      hourlyRate: jobType.hourlyRate,
      baseSalary: jobType.baseSalary || '',
      expectedHoursPerDay: jobType.expectedHoursPerDay || 8
    });
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingJobType(null);
    setFormData({
      name: '',
      hourlyRate: '',
      baseSalary: '',
      expectedHoursPerDay: 8
    });
  };

  if (loading) {
    return (
      <div className="flex-1 p-8 bg-[#f8f7f5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#1e2987] mx-auto mb-4"></div>
          <p className="text-[#8a7a60]">Loading job types...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 pt-20 md:pt-8 pb-4 md:pb-8 px-4 md:px-8 bg-[#f8f7f5] overflow-y-auto">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start mb-6 md:mb-8 gap-4">
          <div>
            <h1 className="text-2xl md:text-4xl font-black text-[#181511] mb-2">Job Types Management</h1>
            <p className="text-[#8a7a60] text-sm md:text-base">Add, edit, or delete job types and their hourly rates</p>
          </div>
          <button 
            onClick={() => setShowModal(true)}
            className="w-full md:w-auto flex items-center justify-center gap-2 px-4 md:px-6 py-3 bg-[#1e2987] text-white rounded-lg font-bold hover:bg-[#1a2475] transition-colors"
          >
            <span className="text-xl">+</span>
            <span>Add Job Type</span>
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-600">
            {error}
          </div>
        )}

        {/* Desktop Table View */}
        <div className="hidden md:block bg-white rounded-lg border border-[#e6e2db] overflow-hidden">
          <table className="w-full">
            <thead className="border-b border-[#e6e2db]">
              <tr className="bg-white">
                <th className="px-6 py-4 text-left text-[#8a7a60] text-sm font-medium">Job Type Name</th>
                <th className="px-6 py-4 text-left text-[#8a7a60] text-sm font-medium">Hourly Rate</th>
                <th className="px-6 py-4 text-left text-[#8a7a60] text-sm font-medium">Base Salary</th>
                <th className="px-6 py-4 text-left text-[#8a7a60] text-sm font-medium">Expected Hours/Day</th>
                <th className="px-6 py-4 text-left text-[#8a7a60] text-sm font-medium">Status</th>
                <th className="px-6 py-4 text-left text-[#8a7a60] text-sm font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobTypes.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-[#8a7a60]">
                    No job types found. Create your first job type to get started.
                  </td>
                </tr>
              ) : (
                jobTypes.map((jobType) => (
                  <tr key={jobType._id} className="border-t border-[#e6e2db] hover:bg-[#f8f7f5]">
                    <td className="px-6 py-4 text-[#181511] text-sm font-medium">{jobType.name}</td>
                    <td className="px-6 py-4 text-[#8a7a60] text-sm">{jobType.hourlyRate.toFixed(2)} DZD/hr</td>
                    <td className="px-6 py-4 text-[#8a7a60] text-sm">{jobType.baseSalary ? jobType.baseSalary.toFixed(2) + ' DZD' : '-'}</td>
                    <td className="px-6 py-4 text-[#8a7a60] text-sm">{jobType.expectedHoursPerDay || 8} hours</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        jobType.isActive 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-600'
                      }`}>
                        {jobType.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={() => handleEdit(jobType)}
                          className="px-3 py-1.5 rounded-lg hover:bg-[#f3ae3f]/20 text-[#f3ae3f] text-sm font-medium transition-colors"
                        >
                          Edit
                        </button>
                        <button 
                          onClick={() => handleDelete(jobType._id)}
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
          {jobTypes.length === 0 ? (
            <div className="bg-white rounded-lg border border-[#e6e2db] p-8 text-center text-[#8a7a60]">
              No job types found. Create your first job type to get started.
            </div>
          ) : (
            jobTypes.map((jobType) => (
              <div key={jobType._id} className="bg-white rounded-lg border border-[#e6e2db] p-4">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-semibold text-[#181511]">{jobType.name}</h3>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    jobType.isActive 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {jobType.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-[#8a7a60] text-sm">Hourly Rate:</span>
                    <span className="text-[#181511] font-medium">{jobType.hourlyRate.toFixed(2)} DZD/hr</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8a7a60] text-sm">Base Salary:</span>
                    <span className="text-[#181511] font-medium">{jobType.baseSalary ? jobType.baseSalary.toFixed(2) + ' DZD' : '-'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8a7a60] text-sm">Expected Hours/Day:</span>
                    <span className="text-[#181511] font-medium">{jobType.expectedHoursPerDay || 8} hours</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button 
                    onClick={() => handleEdit(jobType)}
                    className="flex-1 px-3 py-2 rounded-lg hover:bg-[#f3ae3f]/20 text-[#f3ae3f] text-sm font-medium transition-colors border border-[#f3ae3f]/30"
                  >
                    Edit
                  </button>
                  <button 
                    onClick={() => handleDelete(jobType._id)}
                    className="flex-1 px-3 py-2 rounded-lg hover:bg-red-500/10 text-red-500 text-sm font-medium transition-colors border border-red-500/30"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <h2 className="text-xl md:text-2xl font-bold text-[#181511] mb-4">
                {editingJobType ? 'Edit Job Type' : 'Add New Job Type'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-[#181511] mb-2">
                    Job Type Name
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className="w-full px-4 py-2 border border-[#e6e2db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e2987]"
                    placeholder="e.g., Maçon, Électricien"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#181511] mb-2">
                    Hourly Rate (DZD)
                  </label>
                  <input
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => setFormData({...formData, hourlyRate: e.target.value})}
                    className="w-full px-4 py-2 border border-[#e6e2db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e2987]"
                    min="0"
                    step="0.01"
                    placeholder="e.g., 800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#181511] mb-2">
                    Base Salary (DZD) <span className="text-[#8a7a60] text-xs">(Optional)</span>
                  </label>
                  <input
                    type="number"
                    value={formData.baseSalary}
                    onChange={(e) => setFormData({...formData, baseSalary: e.target.value})}
                    className="w-full px-4 py-2 border border-[#e6e2db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e2987]"
                    min="0"
                    step="0.01"
                    placeholder="e.g., 25000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-[#181511] mb-2">
                    Expected Hours Per Day
                  </label>
                  <input
                    type="number"
                    value={formData.expectedHoursPerDay}
                    onChange={(e) => setFormData({...formData, expectedHoursPerDay: e.target.value})}
                    className="w-full px-4 py-2 border border-[#e6e2db] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1e2987]"
                    min="0"
                    max="12"
                    step="0.5"
                  />
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-4">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 border border-[#e6e2db] rounded-lg text-[#8a7a60] hover:bg-[#f8f7f5] transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    className="flex-1 px-4 py-2 bg-[#1e2987] text-white rounded-lg hover:bg-[#1a2475] transition-colors font-medium"
                  >
                    {editingJobType ? 'Update' : 'Create'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobTypes;