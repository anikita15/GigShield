const express = require('express');
const router = express.Router();

const { computeRiskScore } = require('../controllers/riskController');

// POST /api/risk/score/:userId
router.post('/score/:userId', computeRiskScore);

module.exports = router;
