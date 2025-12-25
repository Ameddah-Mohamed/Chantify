import express from 'express';
const router = express.Router();

// 1. Changed require to import
// 2. Added the mandatory .js extension
import { getUsers } from '../controllers/simple-user.controller.js';

// Routes (no authentication required for demo)
router.get('/', getUsers);

export default router;