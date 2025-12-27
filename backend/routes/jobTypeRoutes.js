// backend/routes/jobType.routes.js
import express from "express";
import {
  getJobTypesByCompany,
  getCompanyJobTypes,
  createJobType,
  updateJobType,
  deleteJobType
} from "../controllers/jobType.controller.js";
import { protectRoute } from "../middleware/protectRoute.js";

const router = express.Router();

// Public route - get job types by company email (for signup page)
router.get("/by-company", getJobTypesByCompany);

// Protected routes (require authentication)
router.get("/", protectRoute, getCompanyJobTypes);
router.post("/", protectRoute, createJobType);
router.put("/:id", protectRoute, updateJobType);
router.delete("/:id", protectRoute, deleteJobType);

export default router;