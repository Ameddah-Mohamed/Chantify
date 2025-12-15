const express = require('express');
const router = express.Router();
const {
  createTask,
  getCompanyTasks,
  getAllTasks,
  updateTask,
  deleteTask
} = require('../controllers/task.controller');

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

module.exports = router;