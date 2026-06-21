// ==========================================
// KHIT Live Sports Portal - Gallery Model
// ==========================================

const mongoose = require('mongoose');

// Define the schema representing a media item (photo/video link) in the KHIT sports gallery
const gallerySchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, "Media type is required"],
    enum: ["Photo", "Video"],
    default: "Photo"
  },
  category: {
    type: String,
    required: [true, "Sport category is required"],
    trim: true // e.g. "Cricket", "Volleyball", "Annual Meet"
  },
  title: {
    type: String,
    required: [true, "Media title is required"],
    trim: true
  },
  event: {
    type: String,
    required: [true, "Event associated is required"],
    trim: true // e.g. "Inter-Department Trophy Final 2024"
  },
  placeholderText: {
    type: String,
    trim: true,
    default: "KHIT Sports Image" // Used when no active image URL is loaded
  },
  caption: {
    type: String,
    trim: true
  },
  mediaUrl: {
    type: String,
    default: "" // Future-proofing: used to store local file upload paths or cloud URLs (e.g., Cloudinary)
  }
}, {
  timestamps: true // Automatically tracks media creation and edits
});

module.exports = mongoose.model('Gallery', gallerySchema);