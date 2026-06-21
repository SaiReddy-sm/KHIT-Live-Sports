// ==========================================
// KHIT Live Sports Portal - Upload Routes
// ==========================================

const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware'); // Import our multer configuration

/**
 * @route   POST /api/upload
 * @desc    Upload an image file (from gallery or camera) and return its static path
 * @access  Public (Will be protected later)
 */
router.post('/', upload.single('image'), (req, res) => {
  try {
    // If no file was selected or uploaded
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "Please upload an image file."
      });
    }

    // Format the file path for database entry (standardizing slashes for web usage)
    const filePath = `/uploads/${req.file.filename}`;

    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      filePath: filePath, // e.g. "/uploads/image-171853245.png"
      fullUrl: `${req.protocol}://${req.get('host')}${filePath}` // e.g. "http://localhost:5000/uploads/image-171853245.png"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not complete file upload",
      error: error.message
    });
  }
});

module.exports = router;