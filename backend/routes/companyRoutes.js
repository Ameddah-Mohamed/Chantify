const express = require('express');
const {
  getCompany,
  updateCompany,
  getCompanyUsers,
  getPendingApplications,
  approveApplication,
  rejectApplication
} = require('../controllers/company.controller');
const { protectRoute } = require('../middleware/protectRoute');

const router = express.Router();

// All routes are protected
router.get("/", protectRoute, getCompany);
router.put("/", protectRoute, updateCompany);
router.get("/users", protectRoute, getCompanyUsers);

// invite handlers
router.get("/applications/pending", protectRoute, getPendingApplications);
router.post("/applications/approve", protectRoute, approveApplication);
router.post("/applications/reject", protectRoute, rejectApplication);

<<<<<<< HEAD
export default router;


// ===================================

// // Update backend/routes/company.routes.js - ADD these imports and routes
// import express from 'express';
// import { protectRoute } from '../middleware/protectRoute.js';
// import { 
//   getCompany, 
//   updateCompany, 
//   getCompanyUsers,
//   getPendingApplications,
//   approveApplication,
//   rejectApplication
// } from '../controllers/company.controller.js';

// const router = express.Router();

// router.get('/', protectRoute, getCompany);
// router.put('/', protectRoute, updateCompany);
// router.get('/users', protectRoute, getCompanyUsers);
// router.get('/pending-applications', protectRoute, getPendingApplications);
// router.post('/approve-application', protectRoute, approveApplication);
// router.post('/reject-application', protectRoute, rejectApplication);

// export default router;
=======
module.exports = router;
>>>>>>> 6a47782ece35410fa96ee8d45c114c0b7299777f
