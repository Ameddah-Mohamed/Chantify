import express from 'express';
const router = express.Router();

// 1. Changed require to import
// 2. Added the mandatory .js extension
import { getUsers, getAllUsersTest } from '../controllers/simple-user.controller.js';

// Routes (no authentication required for demo)
router.get('/', getUsers);
router.get('/test/all', getAllUsersTest);

export default router;