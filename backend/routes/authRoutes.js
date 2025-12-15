const express = require('express');
const { 
  signup, 
  login, 
  logout, 
  getMe 
} = require('../controllers/auth.controller');
const { protectRoute } = require('../middleware/protectRoute');

const router = express.Router();

// Public routes
router.post("/signup", signup);
router.post("/login", login);

// Protected routes
router.post("/logout", protectRoute, logout);
router.get("/me", protectRoute, getMe);

module.exports = router;


export default router;