// ==========================================
// KHIT Live Sports Portal - Match Routes
// ==========================================

const express = require('express');
const router = express.Router();

// Import controller handlers
const {
  getMatches,
  getMatchById,
  createMatch,
  updateMatch,
  deleteMatch
} = require('../controllers/matchController');

// Define standard routing endpoints for /api/matches
router.route('/')
  .get(getMatches)       // GET /api/matches -> Retrieve all matches
  .post(createMatch);   // POST /api/matches -> Create a new match

router.route('/:id')
  .get(getMatchById)    // GET /api/matches/:id -> Retrieve a single match by ID
  .put(updateMatch)     // PUT /api/matches/:id -> Update match details or score
  .delete(deleteMatch); // DELETE /api/matches/:id -> Delete a match from system records

module.exports = router;