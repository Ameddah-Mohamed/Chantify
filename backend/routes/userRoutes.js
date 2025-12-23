import express from 'express';
import { getProfile, updateProfile } from '../controllers/user.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

// All routes are protected
router.get("/profile", protectRoute, getProfile);
router.put("/profile", protectRoute, updateProfile);

export default router;