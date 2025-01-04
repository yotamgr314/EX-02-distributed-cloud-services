const express = require('express');
const authenticateController = require('../controllers/authenticateController');
const router = express.Router();

// Signup route
router.post('/signup', authenticateController.signup);

// Login route
router.post('/login', authenticateController.login);

module.exports = router;
