const Task = require('../models/task.model');
const asyncHandler = require('express-async-handler');

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = asyncHandler(async (req, res) => {
  const { companyId, assignedTo, title, description, project, dueDate } = req.body;
  
  // Get the user ID from the authenticated user (from protectRoute middleware)
  const assignedBy = req.user._id;
  
  const task = await Task.create({
    companyId,
    assignedTo,
    assignedBy,
    title,
    description,
    project: project || 'General',
    dueDate: dueDate || null,
    status: 'todo'
  });
  
  // Populate user details
  const populatedTask = await Task.findById(task._id)
    .populate('assignedTo', 'personalInfo.firstName personalInfo.lastName email')
    .populate('assignedBy', 'personalInfo.firstName personalInfo.lastName');
  
  res.status(201).json({
    success: true,
    data: populatedTask
  });
});

// @desc    Get all tasks for a company
// @route   GET /api/tasks/company/:companyId
// @access  Private
const getCompanyTasks = asyncHandler(async (req, res) => {
  const { companyId } = req.params;
  
  const tasks = await Task.find({ companyId })
    .populate('assignedTo', 'personalInfo.firstName personalInfo.lastName email')
    .populate('assignedBy', 'personalInfo.firstName personalInfo.lastName')
    .sort({ createdAt: -1 });
  
  res.json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

// @desc    Get tasks assigned to a specific user
// @route   GET /api/tasks/my-tasks
// @access  Private
const getMyTasks = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const companyId = req.user.companyId;
  
  const tasks = await Task.find({ 
    companyId,
    assignedTo: userId 
  })
    .populate('assignedBy', 'personalInfo.firstName personalInfo.lastName')
    .sort({ dueDate: 1, createdAt: -1 });
  
  res.json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

// @desc    Update task status
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status, completionNotes } = req.body;
  
  const updateData = { status };
  
  // If marking as completed, set completion date
  if (status === 'completed') {
    updateData.completedAt = new Date();
    updateData.completionNotes = completionNotes || '';
  }
  
  const task = await Task.findByIdAndUpdate(
    id,
    updateData,
    { new: true, runValidators: true }
  ).populate('assignedTo', 'personalInfo.firstName personalInfo.lastName');
  
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
  
  // Check if user is admin or assigned the task
  if (req.user.role !== 'admin' && task.assignedBy.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this task');
  }
  
  await task.deleteOne();
  
  res.json({
    success: true,
    message: 'Task deleted successfully'
  });
});

module.exports = {
  createTask,
  getCompanyTasks,
  getMyTasks,
  updateTask,
  deleteTask
};