// ==========================================
// KHIT Live Sports Portal - Event Model
// ==========================================

const mongoose = require('mongoose');

// Define the schema representing a sports event, tournament, or selection trial at KHIT
const eventSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Event title is required"],
    trim: true
  },
  category: {
    type: String,
    required: [true, "Event category is required"],
    enum: ["Championship", "Trials", "Workshop", "Tournament", "Inter-Collegiate"],
    default: "Tournament"
  },
  date: {
    type: String,
    required: [true, "Event date schedule is required"],
    trim: true // e.g. "12 Nov - 15 Nov 2025"
  },
  time: {
    type: String,
    required: [true, "Event timing is required"],
    trim: true // e.g. "09:00 AM onwards"
  },
  venue: {
    type: String,
    required: [true, "Event venue location is required"],
    trim: true // e.g. "Main Athletic Turf & Indoor Complex"
  },
  description: {
    type: String,
    required: [true, "Event description is required"],
    trim: true
  },
  registrationDeadline: {
    type: String,
    default: "N/A" // e.g. "05 Nov 2025" or "N/A" if open event
  },
  isFlagship: {
    type: Boolean,
    default: false // Set to true to highlight main flagship events (like Annual Athletic Meet)
  }
}, {
  timestamps: true // Automatically tracks event creation and updates
});

module.exports = mongoose.model('Event', eventSchema);