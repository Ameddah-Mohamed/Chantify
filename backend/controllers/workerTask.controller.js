import WorkerTask from '../models/workerTask.model.js';
import Task from '../models/task.model.js';
import User from '../models/user.model.js';
import asyncHandler from 'express-async-handler';

// @desc    Update worker task status
// @route   PUT /api/worker-tasks/:taskId/:workerId/status
// @access  Public
const updateWorkerTaskStatus = asyncHandler(async (req, res) => {
  const { taskId, workerId } = req.params;
  const { status } = req.body;
  
  console.log('\n========== UPDATE WORKER TASK STATUS ==========');
  console.log('TaskId:', taskId);
  console.log('WorkerId:', workerId);
  console.log('New Status:', status);
  
  if (!taskId || !workerId || !status) {
    return res.status(400).json({
      success: false,
      error: 'TaskId, workerId, and status are required'
    });
  }
  
  // Validate status
  const validStatuses = ['todo', 'in-progress', 'completed'];
  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      success: false,
      error: 'Invalid status. Must be: todo, in-progress, or completed'
    });
  }
  
  let workerTask = await WorkerTask.findOne({ taskId, workerId });
  
  if (!workerTask) {
    // Create new worker task
    workerTask = new WorkerTask({
      taskId,
      workerId,
      status,
      startedAt: status === 'in-progress' ? new Date() : null,
      completedAt: status === 'completed' ? new Date() : null
    });
    console.log('Created new worker task');
  } else {
    // Update existing worker task
    const oldStatus = workerTask.status;
    workerTask.status = status;
    
    // Handle status transitions
    if (status === 'in-progress' && oldStatus !== 'in-progress') {
      workerTask.startedAt = new Date();
    }
    
    if (status === 'completed' && oldStatus !== 'completed') {
      workerTask.completedAt = new Date();
    }
    
    if (status === 'todo') {
      workerTask.startedAt = null;
      workerTask.completedAt = null;
    }
    
    console.log('Updated existing worker task from', oldStatus, 'to', status);
  }
  
  await workerTask.save();
  console.log('Worker task saved successfully');
  
  // Check if all workers for this task have completed their work
  if (status === 'completed') {
    await checkAndUpdateTaskCompletion(taskId);
  }
  
  res.json({
    success: true,
    data: workerTask,
    message: `Task status updated to ${status}`
  });
});

// Helper function to check if all workers are completed and update task status
const checkAndUpdateTaskCompletion = async (taskId) => {
  try {
    console.log('Checking if all workers completed for task:', taskId);
    
    // Get the task to see how many workers are assigned
    const task = await Task.findById(taskId);
    if (!task || !task.assignedTo || task.assignedTo.length === 0) {
      console.log('No task found or no workers assigned');
      return;
    }
    
    // Filter out any invalid worker IDs (like "default-worker-id")
    const validWorkerIds = task.assignedTo.filter(workerId => {
      const workerIdStr = workerId.toString();
      const isValid = workerIdStr && workerIdStr !== 'default-worker-id' && workerIdStr.length === 24;
      if (!isValid) {
        console.log('Filtering out invalid worker ID:', workerIdStr);
      }
      return isValid;
    });
    
    if (validWorkerIds.length === 0) {
      console.log('No valid workers assigned to this task');
      return;
    }
    
    console.log('Valid assigned workers:', validWorkerIds.length);
    
    // Get all worker tasks for this task with valid worker IDs only
    const workerTasks = await WorkerTask.find({ 
      taskId, 
      workerId: { $in: validWorkerIds }
    });
    console.log('Found worker tasks:', workerTasks.length);
    
    // Check if all valid assigned workers have completed status
    const completedWorkers = workerTasks.filter(wt => wt.status === 'completed');
    
    console.log('Completed workers:', completedWorkers.length);
    console.log('Total valid assigned workers:', validWorkerIds.length);
    
    // If all valid assigned workers have completed their work
    if (completedWorkers.length === validWorkerIds.length) {
      console.log('All workers completed! Updating task to approved status');
      
      // Collect all files uploaded by workers
      const allWorkerFiles = [];
      for (const wt of workerTasks) {
        if (wt.files && wt.files.length > 0) {
          const workerInfo = await User.findById(wt.workerId).select('personalInfo email');
          wt.files.forEach(file => {
            allWorkerFiles.push({
              ...file.toObject(),
              workerInfo
            });
          });
        }
      }
      
      // Update task status to approved
      await Task.findByIdAndUpdate(taskId, {
        status: 'approved',
        approvedAt: new Date(),
        workerFiles: allWorkerFiles // Store all worker uploaded files
      });
      
      console.log('Task updated to approved status with', allWorkerFiles.length, 'worker files');
    }
  } catch (error) {
    console.error('Error checking task completion:', error);
  }
};

// @desc    Get worker task status
// @route   GET /api/worker-tasks/:taskId/:workerId
// @access  Public
const getWorkerTaskStatus = asyncHandler(async (req, res) => {
  const { taskId, workerId } = req.params;
  
  const workerTask = await WorkerTask.findOne({ taskId, workerId });
  
  if (!workerTask) {
    // Return default status if not found
    return res.json({
      success: true,
      data: {
        taskId,
        workerId,
        status: 'todo',
        startedAt: null,
        completedAt: null
      }
    });
  }
  
  res.json({
    success: true,
    data: workerTask
  });
});

// @desc    Get all worker tasks for a specific task
// @route   GET /api/worker-tasks/:taskId
// @access  Public
const getTaskWorkerStatuses = asyncHandler(async (req, res) => {
  const { taskId } = req.params;
  
  const workerTasks = await WorkerTask.find({ taskId }).populate('workerId', 'personalInfo email');
  
  res.json({
    success: true,
    count: workerTasks.length,
    data: workerTasks
  });
});

// @desc    Upload file for worker task
// @route   POST /api/worker-tasks/:taskId/:workerId/upload
// @access  Public
const uploadWorkerTaskFile = asyncHandler(async (req, res) => {
  const { taskId, workerId } = req.params;
  const { fileName, fileData, fileSize, fileType } = req.body;
  
  console.log('Uploading file:', fileName, 'for task:', taskId, 'worker:', workerId);
  
  let workerTask = await WorkerTask.findOne({ taskId, workerId });
  
  if (!workerTask) {
    workerTask = new WorkerTask({
      taskId,
      workerId,
      status: 'todo'
    });
  }
  
  // Get worker info for file metadata
  const worker = await User.findById(workerId);
  
  const newFile = {
    fileName,
    fileData, // In production, you'd save this to cloud storage and store URL
    fileSize: fileSize || 0,
    fileType: fileType || 'document',
    uploadedAt: new Date(),
    uploadedBy: workerId,
    workerName: worker ? `${worker.personalInfo?.firstName || ''} ${worker.personalInfo?.lastName || ''}`.trim() : 'Unknown'
  };
  
  workerTask.files.push(newFile);
  await workerTask.save();
  
  console.log('File uploaded successfully');
  
  res.json({
    success: true,
    data: workerTask,
    message: 'File uploaded successfully'
  });
});

// @desc    Clean up invalid worker tasks with default worker IDs
// @route   DELETE /api/worker-tasks/cleanup
// @access  Admin
const cleanupInvalidWorkerTasks = asyncHandler(async (req, res) => {
  try {
    // Find and remove worker tasks with invalid worker IDs
    const result = await WorkerTask.deleteMany({
      workerId: { $in: ['default-worker-id', null, ''] }
    });
    
    console.log('Cleanup completed. Removed', result.deletedCount, 'invalid worker tasks');
    
    res.json({
      success: true,
      message: `Cleanup completed. Removed ${result.deletedCount} invalid worker tasks`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error during cleanup:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to cleanup invalid worker tasks'
    });
  }
});

export {
  updateWorkerTaskStatus,
  getWorkerTaskStatus,
  getTaskWorkerStatuses,
  uploadWorkerTaskFile,
  cleanupInvalidWorkerTasks
};