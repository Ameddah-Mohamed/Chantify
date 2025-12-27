// backend/routes/payment.routes.js
import express from 'express';
import {
  getCompanyPayments,
  generateMonthlyPayments,
  getPaymentDetails,
  updatePayment,
  togglePaymentStatus,
  getMyPayments
} from '../controllers/payment.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

// All routes require authentication
router.use(protectRoute);

// Admin routes
router.get('/company', getCompanyPayments);
router.post('/generate', generateMonthlyPayments);
router.get('/details/:userId/:year/:month', getPaymentDetails);
router.put('/:paymentId', updatePayment);
router.patch('/:paymentId/status', togglePaymentStatus);

// Worker routes
router.get('/my-payments', getMyPayments);

export default router;


