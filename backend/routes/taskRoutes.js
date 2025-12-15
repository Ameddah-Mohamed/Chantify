import express from 'express';
import { createTask, getCompanyTasks, getAllTasks, updateTask, deleteTask } from '../controllers/task.controller.js';

const router = express.Router();

// Routes (no authentication required)
router.route('/')
  .get(getAllTasks)
  .post(createTask);

router.route('/company/:companyId')
  .get(getCompanyTasks);

router.route('/:id')
  .get(getAllTasks)
  .put(updateTask)
  .delete(deleteTask);

export default router;