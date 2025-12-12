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

module.exports = router;