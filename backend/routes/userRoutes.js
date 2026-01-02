import express from 'express';
import { getProfile, updateProfile, getUserById, updateUserPaymentInfo, getCompanyUsers, getPendingWorkers, approveWorkerApplication } from '../controllers/user.controller.js';
import { protectRoute } from '../middleware/protectRoute.js';

const router = express.Router();

router.get('/profile', protectRoute, getProfile);
router.get('/company/workers', protectRoute, getCompanyUsers);
router.put('/profile', protectRoute, updateProfile);
router.get('/pending-workers', protectRoute, getPendingWorkers);
router.get('/:userId', protectRoute, getUserById);
router.put('/:userId/payment-info', protectRoute, updateUserPaymentInfo);
router.patch('/:userId/approve', protectRoute, approveWorkerApplication);

export default router;
