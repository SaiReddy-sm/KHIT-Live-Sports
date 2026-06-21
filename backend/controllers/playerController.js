// ==========================================
// KHIT Live Sports Portal - Player Controller
// ==========================================

const Player = require('../models/Player');

/**
 * @desc    Get all players (with optional filters)
 * @route   GET /api/players
 * @access  Public
 */
const getPlayers = async (req, res) => {
  try {
    const { department, sport, gender } = req.query;
    let query = {};

    // Apply filters if provided in the URL query string
    if (department && department !== 'All') query.department = department;
    if (sport && sport !== 'All') query.sport = sport;
    if (gender && gender !== 'All') query.gender = gender;

    const players = await Player.find(query);
    res.status(200).json({
      success: true,
      count: players.length,
      data: players
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not retrieve players",
      error: error.message
    });
  }
};

/**
 * @desc    Get a single player by ID
 * @route   GET /api/players/:id
 * @access  Public
 */
const getPlayerById = async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found"
      });
    }

    res.status(200).json({
      success: true,
      data: player
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
 * @desc    Create a new player
 * @route   POST /api/players
 * @access  Public (Will be protected later)
 */
const createPlayer = async (req, res) => {
  try {
    const { rollNo } = req.body;

    // Check if player with the same roll number already exists
    const existingPlayer = await Player.findOne({ rollNo: rollNo.toUpperCase() });
    if (existingPlayer) {
      return res.status(400).json({
        success: false,
        message: `A player with Roll Number ${rollNo} is already registered.`
      });
    }

    const player = await Player.create(req.body);
    res.status(201).json({
      success: true,
      message: "Player registered successfully",
      data: player
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Validation Error: Could not register player",
      error: error.message
    });
  }
};

/**
 * @desc    Update a player's details
 * @route   PUT /api/players/:id
 * @access  Public (Will be protected later)
 */
const updatePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } // Return updated document & execute validation checks
    );

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Player details updated successfully",
      data: player
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating player records",
      error: error.message
    });
  }
};

/**
 * @desc    Delete a player
 * @route   DELETE /api/players/:id
 * @access  Public (Will be protected later)
 */
const deletePlayer = async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);

    if (!player) {
      return res.status(404).json({
        success: false,
        message: "Player not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Player removed from records successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not delete player",
      error: error.message
    });
  }
};

module.exports = {
  getPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer
};