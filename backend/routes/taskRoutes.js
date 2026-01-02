import express from 'express';
import { getTasksForApproval, approveTask } from '../controllers/task.controller.js';
const router = express.Router();


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

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'Task routes are working!', timestamp: new Date() });
});

router.route('/company/:companyId')
  .get(getCompanyTasks);

router.route('/user/:userId')
  .get(getUserTasks);

router.route('/:id')
  .get(getAllTasks) // Note: Usually this is a 'getOneTask' function
  .put(updateTask)
  .delete(deleteTask);

router.route('/:id/approve')
  .put(approveTask);

export default router;