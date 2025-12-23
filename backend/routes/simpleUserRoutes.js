import express from 'express';
import { getUsers } from '../controllers/simple-user.controller.js';

const router = express.Router();

// Routes (no authentication required for demo)
router.get('/', getUsers);

export default router;
