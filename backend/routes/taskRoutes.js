import express from "express";
import {
  getTasks,
  createTask,
  updateTask,
  updateTaskStatus,
  markTaskComplete,
  getTeamTasks,
} from "../controllers/task.controller.js";

import protectRoute from "../middleware/protectRoute.js";

const router = express.Router();

// All routes are protected
router.get("/", protectRoute, getTasks);
router.post("/", protectRoute, createTask);
router.put("/:taskId", protectRoute, updateTask);
router.put("/:taskId/status", protectRoute, updateTaskStatus);
router.put("/:taskId/complete", protectRoute, markTaskComplete);
router.get("/team", protectRoute, getTeamTasks);

export default router;
