const express = require('express');
const router = express.Router();
const { getUsers } = require('../controllers/simple-user.controller');

// Routes (no authentication required for demo)
router.get('/', getUsers);

module.exports = router;
