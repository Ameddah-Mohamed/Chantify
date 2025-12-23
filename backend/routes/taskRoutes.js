import express from 'express';
import { createTask, getCompanyTasks, getAllTasks, updateTask, deleteTask, getTasksForApproval, approveTask } from '../controllers/task.controller.js';

const router = express.Router();

// Routes (no authentication required)
router.route('/')
  .get(getAllTasks)
  .post(createTask);

router.route('/ready-for-approval')
  .get(getTasksForApproval);

router.route('/company/:companyId')
  .get(getCompanyTasks);

router.route('/:id')
  .get(getAllTasks)
  .put(updateTask)
  .delete(deleteTask);

router.route('/:id/approve')
  .put(approveTask);

export default router;