// backend/routes/timeEntry.routes.js
import express from 'express';
import {
  clockIn,
  clockOut,
  getActiveSession,
  getUserTimeEntries,
  getCompanyTimeEntries,
  getMonthlyReport
} from '../controllers/timeEntry.controller.js';

const router = express.Router();

// Clock in/out
router.post('/clock-in', clockIn);
router.post('/clock-out', clockOut);

// Get active session
router.get('/active/:userId', getActiveSession);

// Get user time entries
router.get('/user/:userId', getUserTimeEntries);

// Get company time entries (Admin)
router.get('/company/:companyId', getCompanyTimeEntries);

// Get monthly report
router.get('/monthly/:userId', getMonthlyReport);

export default router;