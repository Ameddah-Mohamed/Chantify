import Task from '../models/task.model.js';
import WorkerTask from '../models/workerTask.model.js';
import asyncHandler from 'express-async-handler';

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Public
const createTask = asyncHandler(async (req, res) => {
  const { companyId, assignedTo, assignedBy, title, description, project, dueDate, location } = req.body;
  
  // Validate required fields
  if (!title || !assignedTo || assignedTo.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'Task title and at least one worker assignment is required'
    });
  }
  
  // Validate worker IDs are valid ObjectIds
  const validWorkerIds = assignedTo.filter(workerId => {
    const workerIdStr = workerId.toString();
    const isValid = workerIdStr && workerIdStr !== 'default-worker-id' && workerIdStr.length === 24;
    if (!isValid) {
      console.log('Invalid worker ID filtered out during task creation:', workerIdStr);
    }
    return isValid;
  });
  
  if (validWorkerIds.length === 0) {
    return res.status(400).json({
      success: false,
      error: 'No valid worker IDs provided. Please select valid workers.'
    });
  }
  
  // Create the main task with only valid worker IDs
  const task = await Task.create({
    companyId: companyId || null,
    assignedTo: validWorkerIds,
    assignedBy: assignedBy || null,
    title,
    description: description || '',
    project: project || 'General',
    location: location || '',
    dueDate: dueDate || null,
    approved: false
  });
  
  // Create individual worker tasks for each assigned worker
  const workerTasks = [];
  for (const workerId of validWorkerIds) {
    const workerTask = await WorkerTask.create({
      taskId: task._id,
      workerId: workerId,
      status: 'todo',
      completedAt: null,
      proofOfProgress: []
    });
    workerTasks.push(workerTask);
  }
  
  res.status(201).json({
    success: true,
    data: {
      task,
      workerTasks
    },
    message: `Task created and assigned to ${assignedTo.length} worker(s)`
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
  try {
    // Get tasks that have been automatically approved when all workers completed
    const tasks = await Task.find({ status: 'approved', approved: false })
      .populate('assignedTo', 'firstName lastName email personalInfo')
      .populate('assignedBy', 'firstName lastName email personalInfo')
      .sort({ approvedAt: -1 });

    const tasksWithDetails = [];

    for (const task of tasks) {
      // Get all worker tasks for this task
      const workerTasks = await WorkerTask.find({ taskId: task._id })
        .populate('workerId', 'firstName lastName email personalInfo');
      
      // Collect all files uploaded by workers
      const allWorkerFiles = [];
      workerTasks.forEach(wt => {
        if (wt.files && wt.files.length > 0) {
          wt.files.forEach(file => {
            allWorkerFiles.push({
              ...file.toObject(),
              workerInfo: wt.workerId
            });
          });
        }
      });

      tasksWithDetails.push({
        ...task.toObject(),
        workerTasks: workerTasks.map(wt => ({
          workerId: wt.workerId,
          status: wt.status,
          completedAt: wt.completedAt,
          startedAt: wt.startedAt,
          files: wt.files
        })),
        allWorkerFiles: allWorkerFiles
      });
    }

    res.json({
      success: true,
      count: tasksWithDetails.length,
      data: tasksWithDetails
    });
  } catch (error) {
    console.error('Error fetching tasks for approval:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch tasks for approval'
    });
  }
});

// @desc    Approve a task
// @route   PUT /api/tasks/:id/approve
// @access  Public
const approveTask = asyncHandler(async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    return res.status(400).json({
      success: false,
      error: 'Task ID is required'
    });
  }
  
  try {
    const task = await Task.findByIdAndUpdate(
      id,
      { 
        approved: true, 
        status: 'completed',
        approvedAt: new Date() 
      },
      { new: true, runValidators: false }
    );
    
    if (!task) {
      return res.status(404).json({
        success: false,
        error: 'Task not found'
      });
    }
    
    res.json({
      success: true,
      data: task,
      message: 'Task approved successfully'
    });
  } catch (error) {
    console.error('Error approving task:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to approve task: ' + error.message
    });
  }
});

export { createTask, getAllTasks, getCompanyTasks, getUserTasks, updateTask, deleteTask, getTasksForApproval, approveTask };