import express from 'express';
const router = express.Router();

// 1. Changed require to import
// 2. Added the mandatory .js extension
import {
  createTask,
  getCompanyTasks,
  getAllTasks,
  updateTask,
  deleteTask
} from '../controllers/task.controller.js';

// Routes (no authentication required)
router.route('/')
  .get(getAllTasks)
  .post(createTask);

router.route('/ready-for-approval')
  .get(getTasksForApproval);

router.route('/company/:companyId')
  .get(getCompanyTasks);

router.route('/:id')
  .get(getAllTasks) // Note: Usually this is a 'getOneTask' function
  .put(updateTask)
  .delete(deleteTask);

export default router;