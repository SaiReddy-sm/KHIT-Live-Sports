// ==========================================
// KHIT Live Sports Portal - Team Model
// ==========================================

const mongoose = require('mongoose');

// Define the schema representing a departmental sports team at KHIT
const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Team name is required"],
    unique: true, // Prevents duplicate team names (e.g., "CSE Strikers")
    trim: true
  },
  department: {
    type: String,
    required: [true, "Department is required"],
    enum: ["CSE", "AIML", "AIDS", "IT", "ECE", "EEE", "MECH", "CIVIL", "MCA", "MBA", "Diploma"]
  },
  sport: {
    type: String,
    required: [true, "Sport discipline is required"],
    trim: true
  },
  category: {
    type: String,
    enum: ["Boys", "Girls", "Mixed"],
    default: "Boys" // Optional default prevents validation failures during frontend submissions
  },
  captain: {
    type: String,
    required: [true, "Captain's name is required"],
    trim: true
  },
  viceCaptain: {
    type: String,
    trim: true
  },
  squadSize: {
    type: Number,
    required: [true, "Squad size is required"],
    min: [1, "Squad must contain at least 1 player"],
    default: 1
  },
  winRatio: {
    type: Number,
    min: [0, "Win ratio cannot be negative"],
    max: [100, "Win ratio cannot exceed 100%"],
    default: 0
  },
  achievement: {
    type: String,
    trim: true
  },
  colorTheme: {
    type: String,
    default: "from-[#7A1E2D] to-[#8B1F2F]" // Default premium maroon gradient
  }
}, {
  timestamps: true // Automatically tracks team creation and updates
});

module.exports = mongoose.model('Team', teamSchema);