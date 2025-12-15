import React, { useState, useEffect } from 'react';
import { taskAPI } from '../../API/taskAPI';

const TaskApproval = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchTasksForApproval();
  }, []);

  const fetchTasksForApproval = async () => {
    try {
      setLoading(true);
      const response = await taskAPI.getTasksForApproval();
      setTasks(response.data || []);
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch tasks for approval');
      console.error('Error fetching tasks for approval:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (taskId) => {
    try {
      await taskAPI.approveTask(taskId);
      // Remove approved task from the list
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (err) {
      alert('Failed to approve task: ' + err.message);
    }
  };

  const handleReject = (taskId) => {
    // For now, just remove from list - you might want to add a reject endpoint
    console.log('Rejected task:', taskId);
    setTasks(tasks.filter(task => task._id !== taskId));
  };

  const filteredTasks = tasks.filter(task =>
    task.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    task.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-1 justify-center py-5">
      <div className="layout-content-container flex flex-col max-w-[960px] flex-1">
        <div className="flex flex-wrap justify-between gap-3 p-4">
          <div className="flex min-w-72 flex-col gap-3">
            <p className="text-[#111418] tracking-light text-[32px] font-bold leading-tight">Task Approval</p>
            <p className="text-[#637588] text-sm font-normal leading-normal">
              Review and approve tasks completed by all assigned workers
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="flex px-4 py-3">
          <div className="flex flex-1 items-center rounded-xl border border-[#dce0e5] bg-white">
            <div className="text-[#637588] flex items-center justify-center pl-4 pr-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="20px" height="20px" fill="currentColor" viewBox="0 0 256 256">
                <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z"></path>
              </svg>
            </div>
            <input
              placeholder="Search tasks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#111418] focus:outline-0 focus:ring-0 border-none bg-transparent text-base font-normal leading-normal placeholder:text-[#637588] p-3"
            />
          </div>
        </div>

        {/* Task List */}
        <div className="px-4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#1e2987]"></div>
              <span className="ml-2 text-gray-600">Loading tasks...</span>
            </div>
          ) : error ? (
            <div className="text-red-600 text-center py-4 bg-red-50 rounded-lg">
              <p className="font-medium">Error loading tasks</p>
              <p className="text-sm">{error}</p>
              <button 
                onClick={fetchTasksForApproval}
                className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Retry
              </button>
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl text-gray-400 mb-4">📋</div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks ready for approval</h3>
              <p className="text-gray-500">Tasks will appear here when all assigned workers have completed them.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTasks.map((task) => (
                <div key={task._id} className="bg-white shadow-sm rounded-lg border border-gray-200 overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                        <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                        <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                          <span>Due: {new Date(task.dueDate).toLocaleDateString()}</span>
                          <span>•</span>
                          <span>{task.assignedTo?.length || 0} workers assigned</span>
                          <span>•</span>
                          <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => handleApprove(task._id)}
                          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
                        >
                          ✓ Approve Task
                        </button>
                        <button
                          onClick={() => handleReject(task._id)}
                          className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium"
                        >
                          ✗ Reject
                        </button>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 pt-4">
                      <h4 className="font-medium text-gray-900 mb-3">Worker Completion Details:</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {task.workerTasks?.map((workerTask, index) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                            <div className="flex items-center gap-3 mb-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <span className="text-blue-600 text-sm font-medium">
                                  {workerTask.workerId?.firstName?.charAt(0) || 'W'}
                                  {workerTask.workerId?.lastName?.charAt(0) || ''}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium text-sm">
                                  {workerTask.workerId?.firstName} {workerTask.workerId?.lastName}
                                </p>
                                <p className="text-xs text-gray-500">{workerTask.workerId?.email}</p>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between items-center">
                                <span className="text-xs text-gray-600">Status:</span>
                                <span className="px-2 py-1 bg-green-100 text-green-800 rounded text-xs font-medium">
                                  ✓ {workerTask.status}
                                </span>
                              </div>
                              
                              {workerTask.startedAt && (
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-gray-600">Started:</span>
                                  <span className="text-xs text-gray-800">
                                    {new Date(workerTask.startedAt).toLocaleDateString()}
                                  </span>
                                </div>
                              )}
                              
                              {workerTask.completedAt && (
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-gray-600">Completed:</span>
                                  <span className="text-xs text-gray-800 font-medium">
                                    {new Date(workerTask.completedAt).toLocaleDateString()} at{' '}
                                    {new Date(workerTask.completedAt).toLocaleTimeString('en-US', {
                                      hour: '2-digit',
                                      minute: '2-digit'
                                    })}
                                  </span>
                                </div>
                              )}
                              
                              {workerTask.files && workerTask.files.length > 0 && (
                                <div className="flex justify-between items-center">
                                  <span className="text-xs text-gray-600">Files:</span>
                                  <span className="text-xs text-blue-600 font-medium">
                                    📁 {workerTask.files.length} file(s) uploaded
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TaskApproval;