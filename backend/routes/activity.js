const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const {
  createActivity,
  getUserActivities,
  bulkCreateActivity,
} = require('../controllers/activityController');

// POST /api/activity
router.post('/', protect, createActivity);

// POST /api/activity/bulk
router.post('/bulk', protect, bulkCreateActivity);

// GET /api/activity/:userId
router.get('/:userId', protect, getUserActivities);

module.exports = router;
