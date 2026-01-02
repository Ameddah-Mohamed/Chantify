import WorkerTask from '../models/workerTask.model.js';
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
  
  res.json({
    success: true,
    data: workerTask,
    message: `Task status updated to ${status}`
  });
});

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
// @route   POST /api/worker-tasks/:taskId/:workerId/files
// @access  Public
const uploadWorkerTaskFile = asyncHandler(async (req, res) => {
  const { taskId, workerId } = req.params;
  const { fileName, filePath } = req.body;
  
  let workerTask = await WorkerTask.findOne({ taskId, workerId });
  
  if (!workerTask) {
    workerTask = new WorkerTask({
      taskId,
      workerId,
      status: 'todo'
    });
  }
  
  workerTask.files.push({
    fileName,
    filePath,
    uploadedAt: new Date()
  });
  
  await workerTask.save();
  
  res.json({
    success: true,
    data: workerTask
  });
});

export {
  updateWorkerTaskStatus,
  getWorkerTaskStatus,
  getTaskWorkerStatuses,
  uploadWorkerTaskFile
};