
// backend/routes/dashboard.routes.js
import express from 'express';
import { protectRoute } from '../middleware/protectRoute.js';
import { getDashboardStats } from '../controllers/dashboard.controller.js';

const router = express.Router();

router.get('/stats', protectRoute, getDashboardStats);

export default router;