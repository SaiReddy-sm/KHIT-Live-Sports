// ==========================================
// KHIT Live Sports Portal - Notice Model
// ==========================================

const mongoose = require('mongoose');

// Define the schema representing official sports notices or announcements at KHIT
const noticeSchema = new mongoose.Schema({
  refNo: {
    type: String,
    required: [true, "Notice Reference Number is required"],
    unique: true, // e.g. "KHIT/PED/2025/Circular-12"
    trim: true,
    uppercase: true
  },
  category: {
    type: String,
    required: [true, "Notice category is required"],
    enum: ["Trials", "Circulars", "Announcements"],
    default: "Announcements"
  },
  title: {
    type: String,
    required: [true, "Notice title is required"],
    trim: true
  },
  date: {
    type: String,
    required: [true, "Notice issue date is required"],
    trim: true // e.g. "22 Oct 2025"
  },
  description: {
    type: String,
    required: [true, "Notice details/description is required"],
    trim: true
  },
  venue: {
    type: String,
    default: "N/A",
    trim: true // e.g. "Main Turf Ground"
  },
  time: {
    type: String,
    default: "N/A",
    trim: true // e.g. "03:15 PM onwards"
  },
  isPinned: {
    type: Boolean,
    default: false // Pin to highlight important notices on the noticeboard
  }
}, {
  timestamps: true // Automatically tracks notice publication and changes
});

module.exports = mongoose.model('Notice', noticeSchema);