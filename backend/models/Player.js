// ==========================================
// KHIT Live Sports Portal - Player Model
// ==========================================

const mongoose = require('mongoose');

// Define the schema representing an athlete at KHIT
const playerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Player name is required"],
    trim: true
  },
  rollNo: {
    type: String,
    required: [true, "Student Roll Number is required"],
    unique: true, // Prevents duplicate registrations
    trim: true,
    uppercase: true
  },
  department: {
    type: String,
    required: [true, "Department is required"],
    enum: ["CSE", "AIML", "AIDS", "IT", "ECE", "EEE", "MECH", "CIVIL", "MCA", "MBA", "Diploma"]
  },
  year: {
    type: String,
    required: [true, "Academic year is required"],
    enum: ["1st Year", "2nd Year", "3rd Year", "4th Year"]
  },
  sport: {
    type: String,
    required: [true, "Sport category is required"],
    trim: true
  },
  position: {
    type: String,
    default: "Player" // e.g., Keeper, Spiker, Raider
  },
  isCaptain: {
    type: Boolean,
    default: false
  },
  gender: {
    type: String,
    required: [true, "Gender classification is required"],
    enum: ["Boys", "Girls", "Mixed"]
  },
  image: {
    type: String,
    default: "/logo.jpg" // Stores the player's photo/avatar path
  },
  achievementsCount: {
    type: Number,
    default: 0
  },
  medalsCount: {
    type: Number,
    default: 0
  },
  mvpCount: {
    type: Number,
    default: 0
  },
  matchesPlayed: {
    type: Number,
    default: 0
  },
  wins: {
    type: Number,
    default: 0
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  achievementText: {
    type: String,
    trim: true
  }
}, {
  timestamps: true // Automatically tracks createdAt and updatedAt fields
});

module.exports = mongoose.model('Player', playerSchema);