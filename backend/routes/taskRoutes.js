const express = require('express');
const router = express.Router();
const {
  createTask,
  getCompanyTasks,
  getMyTasks,
  updateTask,
  deleteTask
} = require('../controllers/task.controller');
const { protectRoute } = require('../middleware/protectRoute');

// All routes are protected
router.use(protectRoute);

// Routes
router.route('/')
  .post(createTask);

router.route('/company/:companyId')
  .get(getCompanyTasks);

router.route('/my-tasks')
  .get(getMyTasks);

router.route('/:id')
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;