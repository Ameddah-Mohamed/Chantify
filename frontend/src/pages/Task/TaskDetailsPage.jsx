import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskAPI } from '../../API/taskAPI';
import { workerTaskAPI } from '../../API/workerTaskAPI';

export default function TaskDetailsPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [workerTaskStatus, setWorkerTaskStatus] = useState('todo');
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    try {
      setLoading(true);
      
      // Get current user
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        
        // Fetch worker task status if user is a worker
        if (user.role === 'worker') {
          try {
            const statusResponse = await workerTaskAPI.getStatus(taskId, user._id);
            setWorkerTaskStatus(statusResponse.data.status || 'todo');
          } catch (err) {
            console.log('No worker task status found, defaulting to todo');
            setWorkerTaskStatus('todo');
          }
        }
      }
      
      // For now, we'll fetch all tasks and find the one we need
      const response = await taskAPI.getAllTasks();
      const foundTask = response.data?.find(t => t._id === taskId);
      if (foundTask) {
        setTask(foundTask);
        // Load files from localStorage (simulating file storage)
        const storedFiles = localStorage.getItem(`task_${taskId}_files`);
        setFiles(storedFiles ? JSON.parse(storedFiles) : []);
      } else {
        setError('Task not found');
      }
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to fetch task');
      console.error('Error fetching task:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e) => {
    const uploadedFiles = Array.from(e.target.files);
    setUploadingFile(true);
    
    try {
      // Simulate file upload - in production, send to backend
      const newFiles = uploadedFiles.map(file => ({
        id: Date.now() + Math.random(),
        name: file.name,
        size: file.size,
        uploadedAt: new Date().toLocaleString(),
        type: file.type
      }));
      
      const updatedFiles = [...files, ...newFiles];
      setFiles(updatedFiles);
      localStorage.setItem(`task_${taskId}_files`, JSON.stringify(updatedFiles));
    } catch (err) {
      console.error('Error uploading file:', err);
      alert('Failed to upload file');
    } finally {
      setUploadingFile(false);
    }
  };

  const handleStatusChange = async (newStatus) => {
    if (!currentUser) {
      alert('Please login to update task status');
      return;
    }
    
    setUpdating(true);
    try {
      if (currentUser.role === 'worker') {
        // Update worker task status
        await workerTaskAPI.updateStatus(taskId, currentUser._id, newStatus);
        setWorkerTaskStatus(newStatus);
      } else {
        // Admin updating main task
        await taskAPI.updateTask(taskId, { status: newStatus });
        setTask(prev => ({
          ...prev,
          status: newStatus,
          startedAt: newStatus === 'in-progress' ? new Date().toISOString() : prev.startedAt,
          completedAt: newStatus === 'completed' ? new Date().toISOString() : prev.completedAt
        }));
      }
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update task status: ' + (err.message || 'Unknown error'));
    } finally {
      setUpdating(false);
    }
  };

  const deleteFile = (fileId) => {
    const updatedFiles = files.filter(f => f.id !== fileId);
    setFiles(updatedFiles);
    localStorage.setItem(`task_${taskId}_files`, JSON.stringify(updatedFiles));
  };

  const getStatusColor = (status) => {
    const colors = {
      'todo': 'bg-gray-200 text-gray-800 border border-gray-300',
      'in-progress': 'bg-orange-200 text-orange-800 border border-orange-300',
      'completed': 'bg-green-200 text-green-800 border border-green-300'
    };
    return colors[status] || colors['todo'];
  };

  const getStatusLabel = (status) => {
    const labels = {
      'todo': 'To Do',
      'in-progress': 'In Progress',
      'completed': 'Completed'
    };
    return labels[status] || status;
  };

  if (loading) {
    return (
      <div className="p-4 min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading task details...</p>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="p-4 min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto">
          <button 
            onClick={() => navigate(-1)}
            className="mb-4 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back
          </button>
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            <p className="font-medium">Error</p>
            <p className="text-sm">{error || 'Task not found'}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="mb-6 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium transition-colors"
          >
            ← Back to Tasks
          </button>
          
          {/* Main Title */}
          <h1 className="text-5xl font-bold text-gray-900 mb-2">Task Details</h1>
          <p className="text-lg text-gray-600">View and manage task information</p>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
          {/* Task Title and Status */}
          <div className="border-b border-gray-200 pb-6">
            <div className="flex items-start justify-between mb-6">
              <div className="flex-1">
                <h2 className="text-4xl font-bold text-indigo-900 mb-3">{task.title}</h2>
                <div className="flex items-center gap-4">
                  <span className={`inline-block px-4 py-2 rounded-full text-sm font-semibold ${
                    currentUser?.role === 'worker' ? getStatusColor(workerTaskStatus) : getStatusColor(task.status)
                  }`}>
                    {getStatusLabel(currentUser?.role === 'worker' ? workerTaskStatus : task.status)}
                  </span>
                  {currentUser?.role === 'worker' && (
                    <span className="text-sm text-gray-500">Your Status</span>
                  )}
                </div>
              </div>
            </div>
            
            {/* Status Update Buttons */}
            {currentUser && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Update Status</h3>
                <div className="flex gap-3">
                  <button
                    onClick={() => handleStatusChange('todo')}
                    disabled={updating || (currentUser.role === 'worker' ? workerTaskStatus === 'todo' : task.status === 'todo')}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      (currentUser.role === 'worker' ? workerTaskStatus === 'todo' : task.status === 'todo')
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                        : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                    }`}
                  >
                    {updating ? 'Updating...' : 'To Do'}
                  </button>
                  
                  <button
                    onClick={() => handleStatusChange('in-progress')}
                    disabled={updating || (currentUser.role === 'worker' ? workerTaskStatus === 'in-progress' : task.status === 'in-progress')}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      (currentUser.role === 'worker' ? workerTaskStatus === 'in-progress' : task.status === 'in-progress')
                        ? 'bg-orange-300 text-orange-700 cursor-not-allowed'
                        : 'bg-orange-200 text-orange-800 hover:bg-orange-300'
                    }`}
                  >
                    {updating ? 'Updating...' : 'In Progress'}
                  </button>
                  
                  <button
                    onClick={() => handleStatusChange('completed')}
                    disabled={updating || (currentUser.role === 'worker' ? workerTaskStatus === 'completed' : task.status === 'completed')}
                    className={`px-6 py-2 rounded-lg font-medium transition-colors ${
                      (currentUser.role === 'worker' ? workerTaskStatus === 'completed' : task.status === 'completed')
                        ? 'bg-green-300 text-green-700 cursor-not-allowed'
                        : 'bg-green-200 text-green-800 hover:bg-green-300'
                    }`}
                  >
                    {updating ? 'Updating...' : 'Completed'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Task Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Project */}
            <div>
              <label className="block text-sm font-bold text-indigo-700 mb-2 uppercase tracking-wide">Project</label>
              <p className="text-lg text-gray-900 font-medium">{task.project || 'N/A'}</p>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-bold text-indigo-700 mb-2 uppercase tracking-wide">Location</label>
              <p className="text-lg text-gray-900 font-medium">{task.location || 'N/A'}</p>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-bold text-indigo-700 mb-2 uppercase tracking-wide">Due Date</label>
              <p className="text-lg text-gray-900 font-medium">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
              </p>
            </div>

            {/* Status Timeline */}
            <div>
              <label className="block text-sm font-bold text-indigo-700 mb-2 uppercase tracking-wide">Timeline</label>
              <div className="space-y-2 text-sm text-gray-700">
                {task.createdAt && (
                  <p><span className="font-medium">Created:</span> {new Date(task.createdAt).toLocaleString()}</p>
                )}
                {task.startedAt && (
                  <p><span className="font-medium">Started:</span> {new Date(task.startedAt).toLocaleString()}</p>
                )}
                {task.completedAt && (
                  <p><span className="font-medium">Completed:</span> {new Date(task.completedAt).toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="border-t border-gray-200 pt-6">
            <label className="block text-sm font-bold text-indigo-700 mb-3 uppercase tracking-wide">Description</label>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-800 text-base leading-relaxed whitespace-pre-wrap">
                {task.description || 'No description provided'}
              </p>
            </div>
          </div>

          {/* Assigned Workers */}
          {task.assignedTo && task.assignedTo.length > 0 && (
            <div className="border-t border-gray-200 pt-6">
              <label className="block text-sm font-bold text-indigo-700 mb-3 uppercase tracking-wide">Assigned Workers</label>
              <div className="flex flex-wrap gap-2">
                {task.assignedTo.map((userId) => (
                  <span 
                    key={userId}
                    className="px-4 py-2 bg-blue-100 border border-blue-300 text-blue-800 rounded-full text-sm font-medium"
                  >
                    Worker #{userId}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* File Upload Section */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-xl font-bold text-indigo-800 mb-4">Attachments & Files</h3>
            
            {/* Upload Area */}
            <div className="mb-6">
              <label className="block mb-3">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 cursor-pointer transition">
                  <svg className="mx-auto h-12 w-12 text-gray-400 mb-2" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                    <path d="M28 8H12a4 4 0 00-4 4v20a4 4 0 004 4h24a4 4 0 004-4V20" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M32 4v12M32 4l-4 4m4-4l4 4" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  <p className="text-gray-600 font-medium">
                    {uploadingFile ? 'Uploading...' : 'Click to upload or drag files here'}
                  </p>
                  <p className="text-sm text-gray-500 mt-1">Any file type, up to 10MB</p>
                </div>
                <input 
                  type="file" 
                  multiple
                  onChange={handleFileUpload}
                  disabled={uploadingFile}
                  className="hidden"
                />
              </label>
            </div>

            {/* Files List */}
            {files.length > 0 ? (
              <div className="space-y-2">
                <h3 className="font-medium text-gray-900 mb-3">Uploaded Files ({files.length})</h3>
                {files.map((file) => (
                  <div key={file.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">{file.name}</p>
                      <p className="text-xs text-gray-500">
                        {(file.size / 1024).toFixed(2)} KB • {file.uploadedAt}
                      </p>
                    </div>
                    <button 
                      onClick={() => deleteFile(file.id)}
                      className="ml-4 px-3 py-1 text-red-600 hover:bg-red-50 rounded transition text-sm font-medium"
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">No files uploaded yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
