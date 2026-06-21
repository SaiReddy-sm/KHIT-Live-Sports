// ==========================================
// KHIT Live Sports Portal - Auth Routes
// ==========================================

const express = require('express');
const router = express.Router();

// Import controller handlers
const {
  registerUser,
  loginUser,
  getUserProfile
} = require('../controllers/authController');

// Define standard routing endpoints for /api/auth
router.post('/register', registerUser); // POST /api/auth/register -> Admin account registration
router.post('/login', loginUser);       // POST /api/auth/login -> Admin session login

// Note: Profiling route will be protected with authMiddleware in the upcoming step
router.get('/profile', getUserProfile); // GET /api/auth/profile -> Get current profile details

module.exports = router;