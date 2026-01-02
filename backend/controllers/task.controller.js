import Task from '../models/task.model.js';
import WorkerTask from '../models/worker_Task.model.js';
import asyncHandler from 'express-async-handler';

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Public
const createTask = asyncHandler(async (req, res) => {
  const { companyId, assignedTo, assignedBy, title, description, project, dueDate, location } = req.body;
  
  const task = await Task.create({
    companyId: companyId || null,
    assignedTo: assignedTo || [],
    assignedBy: assignedBy || null,
    title,
    description: description || '',
    project: project || 'General',
    location: location || '',
    dueDate: dueDate || null,
    approved: false
  });
  
  res.status(201).json({
    success: true,
    data: task
  });
});

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
const getAllTasks = asyncHandler(async (req, res) => {
  const tasks = await Task.find({})
    .sort({ createdAt: -1 });
  
  res.json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

// @desc    Get all tasks for a company
// @route   GET /api/tasks/company/:companyId
// @access  Public
const getCompanyTasks = asyncHandler(async (req, res) => {
  const { companyId } = req.params;
  
  const tasks = await Task.find({ companyId })
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

// @desc    Get tasks assigned to a specific user
// @route   GET /api/tasks/user/:userId
// @access  Public
const getUserTasks = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  
  const tasks = await Task.find({ 
    assignedTo: { $in: [userId] }
  }).sort({ createdAt: -1 });
  
  res.json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Public
const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  const task = await Task.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  );
  
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  
  res.json({
    success: true,
    data: task
  });
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private (Admin only)
const deleteTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const task = await Task.findById(id);
  
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  
  await task.deleteOne();
  
  res.json({
    success: true,
    message: 'Task deleted successfully'
  });
});


// @desc    Get tasks ready for approval (all workers completed)
// @route   GET /api/tasks/ready-for-approval
// @access  Public
const getTasksForApproval = asyncHandler(async (req, res) => {
  const tasks = await Task.find({ approved: false })
    .populate('assignedTo', 'firstName lastName email')
    .populate('assignedBy', 'firstName lastName email')
    .sort({ createdAt: -1 });

  const tasksReadyForApproval = [];

  for (const task of tasks) {
    if (task.assignedTo.length === 0) continue;
    
    // Get worker task statuses for all assigned workers
    const workerTasks = await WorkerTask.find({ taskId: task._id })
      .populate('workerId', 'firstName lastName email');
    
    // Check if all assigned workers have completed their tasks
    const allCompleted = task.assignedTo.every(worker => {
      const workerTask = workerTasks.find(wt => wt.workerId._id.toString() === worker._id.toString());
      return workerTask && workerTask.status === 'completed';
    });

    if (allCompleted) {
      tasksReadyForApproval.push({
        ...task.toObject(),
        workerTasks: workerTasks.map(wt => ({
          workerId: wt.workerId,
          status: wt.status,
          completedAt: wt.completedAt,
          startedAt: wt.startedAt,
          files: wt.files
        }))
      });
    }
  }

  res.json({
    success: true,
    count: tasksReadyForApproval.length,
    data: tasksReadyForApproval
  });
});

// @desc    Approve a task
// @route   PUT /api/tasks/:id/approve
// @access  Public
const approveTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  const task = await Task.findByIdAndUpdate(
    id,
    { approved: true, approvedAt: new Date() },
    { new: true, runValidators: true }
  );
  
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  
  res.json({
    success: true,
    data: task,
    message: 'Task approved successfully'
  });
});

export { createTask, getAllTasks, getCompanyTasks, getUserTasks, updateTask, deleteTask, getTasksForApproval, approveTask };