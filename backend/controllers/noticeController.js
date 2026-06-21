// ==========================================
// KHIT Live Sports Portal - Notice Controller
// ==========================================

const Notice = require('../models/Notice');

/**
 * @desc    Get all notices (with optional category filter)
 * @route   GET /api/notices
 * @access  Public
 */
const getNotices = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};

    // Filter by notice category if provided in query parameters (e.g., Trials, Circulars)
    if (category) query.category = category;

    const notices = await Notice.find(query);
    res.status(200).json({
      success: true,
      count: notices.length,
      data: notices
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not retrieve notices",
      error: error.message
    });
  }
};

/**
 * @desc    Get a single notice by ID
 * @route   GET /api/notices/:id
 * @access  Public
 */
const getNoticeById = async (req, res) => {
  try {
    const notice = await Notice.findById(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found"
      });
    }

    res.status(200).json({
      success: true,
      data: notice
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Invalid ID or database error",
      error: error.message
    });
  }
};

/**
 * @desc    Create a new sports notice
 * @route   POST /api/notices
 * @access  Public (Will be protected later)
 */
const createNotice = async (req, res) => {
  try {
    const { refNo } = req.body;

    // Check if notice with same Reference Number already exists
    const existingNotice = await Notice.findOne({ refNo: refNo.toUpperCase() });
    if (existingNotice) {
      return res.status(400).json({
        success: false,
        message: `A notice with Reference Number ${refNo} is already registered.`
      });
    }

    const notice = await Notice.create(req.body);
    res.status(201).json({
      success: true,
      message: "Notice created successfully",
      data: notice
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Validation Error: Could not create notice",
      error: error.message
    });
  }
};

/**
 * @desc    Update notice details
 * @route   PUT /api/notices/:id
 * @access  Public (Will be protected later)
 */
const updateNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Notice updated successfully",
      data: notice
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating notice records",
      error: error.message
    });
  }
};

/**
 * @desc    Delete a notice
 * @route   DELETE /api/notices/:id
 * @access  Public (Will be protected later)
 */
const deleteNotice = async (req, res) => {
  try {
    const notice = await Notice.findByIdAndDelete(req.params.id);

    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Notice removed from records successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not delete notice",
      error: error.message
    });
  }
};

module.exports = {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice
};