import express from 'express';

import { 
  signup, 
  login, 
  logout, 
  getMe 
} from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected routes
router.post("/logout", protectRoute, logout);
router.get("/me", protectRoute, getMe);

export default router;