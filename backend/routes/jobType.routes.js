// backend/routes/jobType.routes.js
import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { 
  getJobTypes, 
  createJobType, 
  updateJobType, 
  deleteJobType 
} from '../controllers/jobType.controller.js';

const router = express.Router();

router.get('/', protectRoute, getJobTypes);
router.post('/', protectRoute, createJobType);
router.put('/:id', protectRoute, updateJobType);
router.delete('/:id', protectRoute, deleteJobType);

export default router;

// ===================================

