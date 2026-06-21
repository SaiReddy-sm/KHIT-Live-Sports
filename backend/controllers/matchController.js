// ==========================================
// KHIT Live Sports Portal - Match Controller
// ==========================================

const Match = require('../models/Match');

/**
 * @desc    Get all matches (with optional filters)
 * @route   GET /api/matches
 * @access  Public
 */
const getMatches = async (req, res) => {
  try {
    const { status, sport } = req.query;
    let query = {};

    // Apply filters if provided in the query parameters
    if (status) query.status = status; // e.g., Live, Upcoming, Completed
    if (sport && sport !== 'All') query.sport = sport;

    const matches = await Match.find(query);
    res.status(200).json({
      success: true,
      count: matches.length,
      data: matches
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not retrieve matches",
      error: error.message
    });
  }
};

/**
 * @desc    Get a single match by ID
 * @route   GET /api/matches/:id
 * @access  Public
 */
const getMatchById = async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found"
      });
    }

    res.status(200).json({
      success: true,
      data: match
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
 * @desc    Create a new match fixture
 * @route   POST /api/matches
 * @access  Public (Will be protected later)
 */
const createMatch = async (req, res) => {
  try {
    const match = await Match.create(req.body);
    res.status(201).json({
      success: true,
      message: "Match created successfully",
      data: match
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Validation Error: Could not create match",
      error: error.message
    });
  }
};

/**
 * @desc    Update match details or scores
 * @route   PUT /api/matches/:id
 * @access  Public (Will be protected later)
 */
const updateMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Match records updated successfully",
      data: match
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating match records",
      error: error.message
    });
  }
};

/**
 * @desc    Delete a match
 * @route   DELETE /api/matches/:id
 * @access  Public (Will be protected later)
 */
const deleteMatch = async (req, res) => {
  try {
    const match = await Match.findByIdAndDelete(req.params.id);

    if (!match) {
      return res.status(404).json({
        success: false,
        message: "Match not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Match deleted from records successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not delete match",
      error: error.message
    });
  }
};

module.exports = {
  getMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch
};