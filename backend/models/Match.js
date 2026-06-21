// ==========================================
// KHIT Live Sports Portal - Match Model
// ==========================================

const mongoose = require('mongoose');

// Define the player roster schema inline for use within the parent match
const rosterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Player name is required"],
    trim: true
  },
  rollNo: {
    type: String,
    required: [true, "Player roll number is required"],
    trim: true
  }
});

// Define the best performer / MVP spotlight schema for completed matches
const mvpSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "MVP player name is required"],
    trim: true
  },
  department: {
    type: String,
    required: [true, "MVP department code is required"],
    trim: true
  },
  statHighlight: {
    type: String,
    required: [true, "MVP performance highlight detail is required"],
    trim: true // e.g. "12 Raid Points" or "4 Wickets (3 Overs)"
  }
});

// Define the parent schema representing a match fixture or active game at KHIT
const matchSchema = new mongoose.Schema({
  sport: {
    type: String,
    required: [true, "Sport category is required"],
    trim: true
  },
  status: {
    type: String,
    required: [true, "Match status is required"],
    enum: ["Live", "Upcoming", "Completed"],
    default: "Upcoming"
  },
  tournament: {
    type: String,
    required: [true, "Tournament name is required"],
    trim: true,
    default: "Annual Sports Meet 2026"
  },
  venue: {
    type: String,
    required: [true, "Venue location is required"],
    trim: true
  },
  date: {
    type: String,
    required: [true, "Match date is required"],
    trim: true // e.g. "Today" or "Tomorrow"
  },
  time: {
    type: String,
    required: [true, "Match time is required"],
    trim: true // e.g. "02:00 PM"
  },
  statusDetail: {
    type: String,
    default: "", // e.g. "CSE won toss and elected to bat."
    trim: true
  },

  // Team A Properties
  teamA: {
    type: String,
    required: [true, "Team A name is required"],
    trim: true
  },
  captainA: {
    type: String,
    required: [true, "Team A leader/captain name is required"],
    trim: true
  },
  scoreA: {
    type: String,
    default: "" // e.g. "142/4 (16.2 Ov)"
  },
  teamA_roster: {
    type: [rosterSchema],
    default: []
  },

  // Team B Properties
  teamB: {
    type: String,
    required: [true, "Team B name is required"],
    trim: true
  },
  captainB: {
    type: String,
    required: [true, "Team B leader/captain name is required"],
    trim: true
  },
  scoreB: {
    type: String,
    default: "" // e.g. "138/10 (20 Ov)"
  },
  teamB_roster: {
    type: [rosterSchema],
    default: []
  },

  // Completed Match Spotlights (Empty for Upcoming/Live or Chess/Badminton)
  bestPerformers: {
    type: [mvpSchema],
    default: []
  }
}, {
  timestamps: true // Automatically tracks match creation and edits
});

module.exports = mongoose.model('Match', matchSchema);