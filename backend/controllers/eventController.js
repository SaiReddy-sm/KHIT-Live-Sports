// ==========================================
// KHIT Live Sports Portal - Event Controller
// ==========================================

const Event = require('../models/Event');

/**
 * @desc    Get all events (with optional category filter)
 * @route   GET /api/events
 * @access  Public
 */
const getEvents = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};

    // Filter by event category if provided in query parameters (e.g. Trials, Championship)
    if (category) query.category = category;

    const events = await Event.find(query);
    res.status(200).json({
      success: true,
      count: events.length,
      data: events
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not retrieve events",
      error: error.message
    });
  }
};

/**
 * @desc    Get a single event by ID
 * @route   GET /api/events/:id
 * @access  Public
 */
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    res.status(200).json({
      success: true,
      data: event
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
 * @desc    Create a new event
 * @route   POST /api/events
 * @access  Public (Will be protected later)
 */
const createEvent = async (req, res) => {
  try {
    const event = await Event.create(req.body);
    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Validation Error: Could not create event",
      error: error.message
    });
  }
};

/**
 * @desc    Update event details
 * @route   PUT /api/events/:id
 * @access  Public (Will be protected later)
 */
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Event records updated successfully",
      data: event
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating event records",
      error: error.message
    });
  }
};

/**
 * @desc    Delete an event
 * @route   DELETE /api/events/:id
 * @access  Public (Will be protected later)
 */
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Event deleted from records successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not delete event",
      error: error.message
    });
  }
};

module.exports = {
  getEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};