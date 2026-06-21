// ==========================================
// KHIT Live Sports Portal - Gallery Routes
// ==========================================

const express = require('express');
const router = express.Router();

// Import controller handlers
const {
  getGalleryItems,
  getGalleryItemById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem
} = require('../controllers/galleryController');

// Define standard routing endpoints for /api/gallery
router.route('/')
  .get(getGalleryItems)       // GET /api/gallery -> Retrieve all gallery media
  .post(createGalleryItem);   // POST /api/gallery -> Add a new media item to gallery

router.route('/:id')
  .get(getGalleryItemById)    // GET /api/gallery/:id -> Retrieve a single media item by ID
  .put(updateGalleryItem)     // PUT /api/gallery/:id -> Update media details
  .delete(deleteGalleryItem); // DELETE /api/gallery/:id -> Delete media from system records

module.exports = router;