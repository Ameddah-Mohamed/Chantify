import express from 'express';
import {
  updateWorkerTaskStatus,
  getWorkerTaskStatus,
  getTaskWorkerStatuses,
  uploadWorkerTaskFile,
  cleanupInvalidWorkerTasks
} from '../controllers/workerTask.controller.js';

const router = express.Router();

// @route   PUT /api/worker-tasks/:taskId/:workerId/status
// @desc    Update worker task status
// @access  Public
router.put('/:taskId/:workerId/status', updateWorkerTaskStatus);

// @route   GET /api/worker-tasks/:taskId/:workerId
// @desc    Get worker task status
// @access  Public
router.get('/:taskId/:workerId', getWorkerTaskStatus);

// @route   GET /api/worker-tasks/:taskId/all
// @desc    Get all worker statuses for a task
// @access  Public
router.get('/:taskId/all', getTaskWorkerStatuses);

// @route   POST /api/worker-tasks/:taskId/:workerId/upload
// @desc    Upload file for worker task
// @access  Public
router.post('/:taskId/:workerId/upload', uploadWorkerTaskFile);

// @route   DELETE /api/worker-tasks/cleanup
// @desc    Clean up invalid worker tasks
// @access  Admin
router.delete('/cleanup', cleanupInvalidWorkerTasks);

export default router;