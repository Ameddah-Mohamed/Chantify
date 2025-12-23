import WorkerTask from '../models/worker_Task.model.js';
import asyncHandler from 'express-async-handler';

// @desc    Create or update worker task status
// @route   POST /api/worker-tasks
// @access  Public
const updateWorkerTaskStatus = asyncHandler(async (req, res) => {
  const { taskId, workerId, status } = req.body;
  
  if (!taskId || !workerId || !status) {
    res.status(400);
    throw new Error('TaskId, workerId, and status are required');
  }
  
  let workerTask = await WorkerTask.findOne({ taskId, workerId });
  
  if (!workerTask) {
    // Create new worker task
    workerTask = new WorkerTask({
      taskId,
      workerId,
      status
    });
  } else {
    // Update existing worker task
    workerTask.status = status;
  }
  
  // Handle status transitions
  if (status === 'in-progress' && workerTask.status !== 'in-progress') {
    workerTask.startedAt = new Date();
  }
  
  if (status === 'completed' && workerTask.status !== 'completed') {
    workerTask.completedAt = new Date();
  }
  
  await workerTask.save();
  
  res.json({
    success: true,
    data: workerTask
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