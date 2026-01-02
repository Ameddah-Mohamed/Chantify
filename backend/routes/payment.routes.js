// backend/routes/payment.routes.js
import express from 'express';
import {
  getCompanyPayments,
  generateMonthlyPayments,
  getPaymentDetails,
  getWorkerPayments,
  updatePayment,
  togglePaymentStatus,
  getMyPayments
} from '../controllers/payment.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

// Admin routes
router.get('/company', protectRoute, getCompanyPayments);
router.post('/generate', protectRoute, generateMonthlyPayments);
router.get('/worker/:workerId', protectRoute, getWorkerPayments);
router.get('/:userId/:year/:month', protectRoute, getPaymentDetails);
router.put('/:paymentId', protectRoute, updatePayment);
router.patch('/:paymentId/toggle-status', protectRoute, togglePaymentStatus);

// Worker routes
router.get('/my-payments', protectRoute, getMyPayments);

export default router;