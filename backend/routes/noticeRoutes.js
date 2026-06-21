// ==========================================
// KHIT Live Sports Portal - Notice Routes
// ==========================================

const express = require('express');
const router = express.Router();

// Import controller handlers
const {
  getNotices,
  getNoticeById,
  createNotice,
  updateNotice,
  deleteNotice
} = require('../controllers/noticeController');

// Define standard routing endpoints for /api/notices
router.route('/')
  .get(getNotices)       // GET /api/notices -> Retrieve all registered notices
  .post(createNotice);   // POST /api/notices -> Post a new notice/announcement

router.route('/:id')
  .get(getNoticeById)    // GET /api/notices/:id -> Retrieve a single notice by ID
  .put(updateNotice)     // PUT /api/notices/:id -> Update notice record details
  .delete(deleteNotice); // DELETE /api/notices/:id -> Remove notice from system records

module.exports = router;