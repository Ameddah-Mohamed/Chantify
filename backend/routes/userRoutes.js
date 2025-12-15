const express = require('express');
const {
  getProfile,
  updateProfile
} = require('../controllers/user.controller');
const { protectRoute } = require('../middleware/protectRoute');

const router = express.Router();

// All routes are protected
router.get("/profile", protectRoute, getProfile);
router.put("/profile", protectRoute, updateProfile);

module.exports = router;