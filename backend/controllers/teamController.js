// ==========================================
// KHIT Live Sports Portal - Team Controller
// ==========================================

const Team = require('../models/Team');

/**
 * @desc    Get all teams (with optional filters)
 * @route   GET /api/teams
 * @access  Public
 */
const getTeams = async (req, res) => {
  try {
    const { department, sport } = req.query;
    let query = {};

    if (department && department !== 'All') query.department = department;
    if (sport && sport !== 'All') query.sport = sport;

    const teams = await Team.find(query);
    res.status(200).json({
      success: true,
      count: teams.length,
      data: teams
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not retrieve teams",
      error: error.message
    });
  }
};

/**
 * @desc    Get a single team by ID
 * @route   GET /api/teams/:id
 * @access  Public
 */
const getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found"
      });
    }

    res.status(200).json({
      success: true,
      data: team
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
 * @desc    Create a new team
 * @route   POST /api/teams
 * @access  Public
 */
const createTeam = async (req, res) => {
  try {
    const { name } = req.body;

    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      return res.status(400).json({
        success: false,
        message: `A team named "${name}" is already registered.`
      });
    }

    const team = await Team.create(req.body);
    res.status(201).json({
      success: true,
      message: "Team created successfully",
      data: team
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Validation Error: Could not create team",
      error: error.message
    });
  }
};

/**
 * @desc    Update team details
 * @route   PUT /api/teams/:id
 * @access  Public
 */
const updateTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Team details updated successfully",
      data: team
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating team records",
      error: error.message
    });
  }
};

/**
 * @desc    Delete a team
 * @route   DELETE /api/teams/:id
 * @access  Public
 */
const deleteTeam = async (req, res) => {
  try {
    const team = await Team.findByIdAndDelete(req.params.id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Team removed from records successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not delete team",
      error: error.message
    });
  }
};

// Ensure all 5 functions are exported correctly here:
module.exports = {
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam
};