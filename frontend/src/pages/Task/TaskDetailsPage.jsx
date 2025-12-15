import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { taskAPI } from '../../API/taskAPI';

export default function TaskDetailsPage() {
  const { taskId } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [files, setFiles] = useState([]);
  const [uploadingFile, setUploadingFile] = useState(false);
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    fetchTask();
  }, [taskId]);

  const fetchTask = async () => {
    try {
      setLoading(true);
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
    setUpdating(true);
    try {
      await taskAPI.updateTask(taskId, { status: newStatus });
      setTask(prev => ({
        ...prev,
        status: newStatus,
        startedAt: newStatus === 'in-progress' ? new Date().toISOString() : prev.startedAt,
        completedAt: newStatus === 'completed' ? new Date().toISOString() : prev.completedAt
      }));
    } catch (err) {
      console.error('Error updating status:', err);
      alert('Failed to update task status');
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
      'todo': 'bg-gray-200 text-gray-800',
      'in-progress': 'bg-orange-200 text-orange-800',
      'completed': 'bg-blue-200 text-blue-800'
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
    <div className="p-4 min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-6">
          <button 
            onClick={() => navigate(-1)}
            className="mb-4 px-4 py-2 text-blue-600 hover:text-blue-800 font-medium"
          >
            ← Back to Tasks
          </button>
        </div>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow p-8 space-y-6">
          {/* Task Title and Status */}
          <div>
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">{task.title}</h1>
                <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status)}`}>
                  {getStatusLabel(task.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Task Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Project */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Project</label>
              <p className="text-gray-900">{task.project || 'N/A'}</p>
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
              <p className="text-gray-900">{task.location || 'N/A'}</p>
            </div>

            {/* Due Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Due Date</label>
              <p className="text-gray-900">
                {task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'No due date'}
              </p>
            </div>

            {/* Status Timeline */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Timeline</label>
              <div className="space-y-2 text-sm text-gray-600">
                {task.createdAt && (
                  <p>Created: {new Date(task.createdAt).toLocaleString()}</p>
                )}
                {task.startedAt && (
                  <p>Started: {new Date(task.startedAt).toLocaleString()}</p>
                )}
                {task.completedAt && (
                  <p>Completed: {new Date(task.completedAt).toLocaleString()}</p>
                )}
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <p className="text-gray-700 whitespace-pre-wrap">{task.description || 'No description'}</p>
          </div>

          {/* Assigned Workers */}
          {task.assignedTo && task.assignedTo.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Assigned To</label>
              <div className="flex flex-wrap gap-2">
                {task.assignedTo.map((userId) => (
                  <span 
                    key={userId}
                    className="px-3 py-1 bg-blue-50 border border-blue-200 text-blue-700 rounded-full text-sm"
                  >
                    Worker #{userId}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Status Actions */}
          {task.status !== 'completed' && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-sm text-blue-700 font-medium mb-3">Update Task Status</p>
              <div className="flex gap-3 flex-wrap">
                {task.status === 'todo' && (
                  <button 
                    onClick={() => handleStatusChange('in-progress')}
                    disabled={updating}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                  >
                    {updating ? 'Updating...' : 'Start Task'}
                  </button>
                )}
                {task.status === 'in-progress' && (
                  <button 
                    onClick={() => handleStatusChange('completed')}
                    disabled={updating}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
                  >
                    {updating ? 'Updating...' : 'Mark Complete'}
                  </button>
                )}
              </div>
            </div>
          )}

          {/* File Upload Section */}
          <div className="border-t pt-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Attachments</h2>
            
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
