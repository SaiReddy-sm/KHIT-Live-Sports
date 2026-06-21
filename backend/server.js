// ==========================================
// KHIT Live Sports Portal - Backend Server
// ==========================================

// Import core dependencies
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config(); // Load environment variables from .env file

// Import database connection configuration
const connectDB = require('./config/db');

// Import routing files
const playerRoutes = require('./routes/playerRoutes');
const teamRoutes = require('./routes/teamRoutes'); // Added Team Routes
const matchRoutes = require('./routes/matchRoutes');
const eventRoutes = require('./routes/eventRoutes'); // Added Event Routes
const noticeRoutes = require('./routes/noticeRoutes');
const galleryRoutes = require('./routes/galleryRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Initialize the Express application
const app = express();

// Establish connection to MongoDB Atlas or Local Database
connectDB();

// Set the port to use from environment variables or fall back to 5000
const PORT = process.env.PORT || 5000;

// ==========================================
// Middleware Configurations
// ==========================================

// Enable CORS to allow cross-origin requests from the React frontend
app.use(cors());

// Parse incoming request bodies containing JSON payloads
app.use(express.json());

// Serve the 'uploads' folder statically so the React frontend can access the uploaded images
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================
// API Routes
// ==========================================

// Register resource endpoints
app.use('/api/players', playerRoutes);
app.use('/api/teams', teamRoutes); // Registered Team routes
app.use('/api/matches', matchRoutes); // Registered Match routes
app.use('/api/events', eventRoutes); // Registered Event routes
app.use('/api/notices', noticeRoutes); // Registered Notice routes
app.use('/api/gallery', galleryRoutes); // Registered Gallery routes
app.use('/api/auth', authRoutes);
app.use('/api/upload', uploadRoutes); // Registered Upload routes

/**
 * @route   GET /
 * @desc    Test route to verify if the server is accessible and running
 * @access  Public
 */
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: "KHIT Sports API Running"
  });
});

/**
 * @route   GET /api/health
 * @desc    Health check endpoint to monitor server uptime status
 * @access  Public
 */
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: "OK"
  });
});

// ==========================================
// Server Initialization
// ==========================================
app.listen(PORT, () => {
  console.log(`Server is running in environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`API is listening on address: http://localhost:${PORT}`);
});