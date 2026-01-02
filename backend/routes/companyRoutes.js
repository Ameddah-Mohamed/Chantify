// backend/routes/companyRoutes.js
import express from 'express';
import {
  getCompany,
  updateCompany,
  getCompanyUsers,
  getPendingApplications,
  approveApplication,
  rejectApplication,
  updateWorker,
  deleteWorker,
  toggleWorkerStatus
} from '../controllers/company.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

// All routes are protected
router.get("/", protectRoute, getCompany);
router.put("/", protectRoute, updateCompany);

// Workers management
router.get("/users", protectRoute, getCompanyUsers);
router.put("/users/:userId", protectRoute, updateWorker);
router.delete("/users/:userId", protectRoute, deleteWorker);
router.patch("/users/:userId/toggle-status", protectRoute, toggleWorkerStatus);

// Application handlers
router.get("/applications/pending", protectRoute, getPendingApplications);
router.post("/applications/approve", protectRoute, approveApplication);
router.post("/applications/reject", protectRoute, rejectApplication);

export default router;