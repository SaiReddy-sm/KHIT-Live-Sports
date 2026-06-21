// ==========================================
// KHIT Live Sports Portal - Event Routes
// ==========================================

const express = require('express');
const router = express.Router();

// Import controller handlers
const {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/eventController');

// Define standard routing endpoints for /api/events
router.route('/')
  .get(getEvents)       // GET /api/events -> Retrieve all registered events
  .post(createEvent);   // POST /api/events -> Create a new event

router.route('/:id')
  .get(getEventById)    // GET /api/events/:id -> Retrieve a single event by ID
  .put(updateEvent)     // PUT /api/events/:id -> Update event record details
  .delete(deleteEvent); // DELETE /api/events/:id -> Remove event from system records

module.exports = router;