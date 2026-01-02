// backend/routes/timeEntry.routes.js
import express from 'express';
import {
  clockIn,
  clockOut,
  getActiveSession,
  getUserTimeEntries,
  getCompanyTimeEntries,
  getDailyEntries,
  getMonthlyReport,
  getUserMonthlySummaries,
  getSessionHistory,
  forceClockOut
} from '../controllers/timeEntry.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

// Clock in/out
router.post('/clock-in', clockIn);
router.post('/clock-out', clockOut);

// Get active session
router.get('/active/:userId', protectRoute, getActiveSession);

// Get daily entries
router.get('/daily/:userId/:date', protectRoute, getDailyEntries);

// Get user time entries
router.get('/user/:userId', protectRoute, getUserTimeEntries);

// Get company time entries (Admin)
router.get('/company/:companyId', protectRoute, getCompanyTimeEntries);

// Get monthly report
router.get('/monthly/:userId', protectRoute, getMonthlyReport);

// Get all monthly summaries for a user
router.get('/summaries/:userId', protectRoute, getUserMonthlySummaries);

// Get session history for a user (for admin view)
router.get('/history/:userId', protectRoute, getSessionHistory);

// Force clear active session (Admin only - for testing/emergencies)
router.delete('/force-clock-out/:userId', protectRoute, forceClockOut);

export default router;