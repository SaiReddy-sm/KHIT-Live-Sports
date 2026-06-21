// ==========================================
// KHIT Live Sports Portal - Team Routes
// ==========================================

const express = require('express');
const router = express.Router();

// Import controller handlers
const {
  getTeams,
  getTeamById,
  createTeam,
  updateTeam,
  deleteTeam
} = require('../controllers/teamController');

// Define standard routing endpoints for /api/teams
router.route('/')
  .get(getTeams)       // GET /api/teams -> Retrieve all registered teams
  .post(createTeam);   // POST /api/teams -> Register a new team record

router.route('/:id')
  .get(getTeamById)    // GET /api/teams/:id -> Retrieve a single team by ID
  .put(updateTeam)     // PUT /api/teams/:id -> Update team record details
  .delete(deleteTeam); // DELETE /api/teams/:id -> Remove team from system records

module.exports = router;