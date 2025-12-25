import Task from '../models/task.model.js'; // Add .js extension
import asyncHandler from 'express-async-handler';

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Public
const createTask = asyncHandler(async (req, res) => {
  const { companyId, assignedTo, assignedBy, title, description, project, dueDate, location, status } = req.body;
  
  const task = await Task.create({
    companyId: companyId || null,
    assignedTo: assignedTo || [],
    assignedBy: assignedBy || null,
    title,
    description: description || '',
    project: project || 'General',
    location: location || '',
    dueDate: dueDate || null,
    status: status || 'todo'
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

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Public
const updateTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  // Handle status transitions
  if (updateData.status === 'completed' && !updateData.completedAt) {
    updateData.completedAt = new Date();
  }
  
  // If transitioning from todo to in-progress, record start time
  if (updateData.status === 'in-progress') {
    const task = await Task.findById(id);
    if (task && task.status === 'todo') {
      updateData.startedAt = new Date();
    }
  }
  
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

export {
  createTask,
  getAllTasks,
  getCompanyTasks,
  updateTask,
  deleteTask
};