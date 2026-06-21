// ==========================================
// KHIT Live Sports Portal - Gallery Controller
// ==========================================

const Gallery = require('../models/Gallery');

/**
 * @desc    Get all gallery items (with optional category filter)
 * @route   GET /api/gallery
 * @access  Public
 */
const getGalleryItems = async (req, res) => {
  try {
    const { category } = req.query;
    let query = {};

    // Filter by sport category if provided in query parameters (e.g., Cricket)
    if (category && category !== 'All') query.category = category;

    const galleryItems = await Gallery.find(query);
    res.status(200).json({
      success: true,
      count: galleryItems.length,
      data: galleryItems
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not retrieve gallery items",
      error: error.message
    });
  }
};

/**
 * @desc    Get a single gallery item by ID
 * @route   GET /api/gallery/:id
 * @access  Public
 */
const getGalleryItemById = async (req, res) => {
  try {
    const galleryItem = await Gallery.findById(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found"
      });
    }

    res.status(200).json({
      success: true,
      data: galleryItem
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
 * @desc    Add a new media item to the gallery
 * @route   POST /api/gallery
 * @access  Public (Will be protected later)
 */
const createGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.create(req.body);
    res.status(201).json({
      success: true,
      message: "Media item added to gallery successfully",
      data: galleryItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Validation Error: Could not add media item",
      error: error.message
    });
  }
};

/**
 * @desc    Update gallery item details
 * @route   PUT /api/gallery/:id
 * @access  Public (Will be protected later)
 */
const updateGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Gallery item details updated successfully",
      data: galleryItem
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Error updating gallery records",
      error: error.message
    });
  }
};

/**
 * @desc    Remove a media item from the gallery
 * @route   DELETE /api/gallery/:id
 * @access  Public (Will be protected later)
 */
const deleteGalleryItem = async (req, res) => {
  try {
    const galleryItem = await Gallery.findByIdAndDelete(req.params.id);

    if (!galleryItem) {
      return res.status(404).json({
        success: false,
        message: "Gallery item not found"
      });
    }

    res.status(200).json({
      success: true,
      message: "Media item removed from gallery successfully"
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server Error: Could not delete gallery item",
      error: error.message
    });
  }
};

module.exports = {
  getGalleryItems,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
};