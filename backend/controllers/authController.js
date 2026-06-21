// ==========================================
// KHIT Live Sports Portal - Auth Controller
// ==========================================

const User = require('../models/User');
const jwt = require('jsonwebtoken');

/**
 * Helper function to generate a JSON Web Token (JWT)
 * @param {string} id - The MongoDB User ObjectId
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'khit_sports_secret_key_2025', {
    expiresIn: '30d' // Token remains active for 30 days
  });
};

/**
 * @desc    Register a new admin/staff user
 * @route   POST /api/auth/register
 * @access  Public (Will be restricted in production)
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password, role, department } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({
        success: false,
        message: "An account with this email address already exists."
      });
    }

    // Create the user (Pre-save hashing middleware inside User.js automatically hashes the password)
    const user = await User.create({
      name,
      email,
      password,
      role,
      department
    });

    res.status(201).json({
      success: true,
      message: "Administrator registered successfully",
      token: generateToken(user._id),
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Registration failed: Invalid user data",
      error: error.message
    });
  }
};

/**
 * @desc    Authenticate user & get token (Login)
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Locate the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    // 2. Compare the plain password with the stored hashed password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password."
      });
    }

    res.status(200).json({
      success: true,
      message: "Login successful",
      token: generateToken(user._id),
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        department: user.department
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not complete login",
      error: error.message
    });
  }
};

/**
 * @desc    Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private (Requires authentication middleware check)
 */
const getUserProfile = async (req, res) => {
  try {
    // req.user will be populated by our upcoming authMiddleware
    const user = await User.findById(req.user.id).select('-password'); // Exclude password hash from response

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User profile not found"
      });
    }

    res.status(200).json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not retrieve profile",
      error: error.message
    });
  }
};

module.exports = {
  registerUser,
  loginUser,
  getUserProfile
};