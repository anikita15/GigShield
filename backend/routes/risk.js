const express = require('express');
const router = express.Router();

const { protect } = require('../middleware/authMiddleware');
const { computeRiskScore, getLatestRiskScore } = require('../controllers/riskController');

// POST /api/risk/score/:userId
router.post('/score/:userId', protect, computeRiskScore);

// GET /api/risk/latest/:userId
router.get('/latest/:userId', protect, getLatestRiskScore);

module.exports = router;
