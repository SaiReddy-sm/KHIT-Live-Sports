// ==========================================
// KHIT Live Sports Portal - Player Routes
// ==========================================

const express = require('express');
const router = express.Router();

// Import controller handlers
const {
  getPlayers,
  getPlayerById,
  createPlayer,
  updatePlayer,
  deletePlayer
} = require('../controllers/playerController');

// Define standard routing endpoints for /api/players
router.route('/')
  .get(getPlayers)       // GET /api/players -> Retrieve all player records
  .post(createPlayer);   // POST /api/players -> Register a new player record

router.route('/:id')
  .get(getPlayerById)    // GET /api/players/:id -> Retrieve a single player by ID
  .put(updatePlayer)     // PUT /api/players/:id -> Update player record details
  .delete(deletePlayer); // DELETE /api/players/:id -> Remove player from system records

module.exports = router;