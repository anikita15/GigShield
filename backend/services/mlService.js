const axios = require('axios');
const { ML_SERVICE_URL } = require('../config/env');
const { computeLiteRiskScore } = require('./liteRiskService');

/**
 * Calls the ML service or falls back to lite logic if unconfigured.
 */
const getRiskScore = async (payload) => {
  // 1. If ML_SERVICE_URL is missing, use the Lite Evaluator (Free Tier Mode)
  if (!ML_SERVICE_URL) {
    const score = computeLiteRiskScore(payload);
    return { risk_score: score, userId: payload.userId };
  }

  // 2. Otherwise, attempt to call the external Python ML service
  try {
    const response = await axios.post(`${ML_SERVICE_URL}/risk-score`, payload);
    return response.data;
  } catch (err) {
    // If external ML fails, we log it and throw 503
    const error = new Error('ML service unavailable');
    error.statusCode = 503;
    error.cause = err.message;
    throw error;
  }
};

module.exports = { getRiskScore };
