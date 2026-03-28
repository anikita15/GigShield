const axios = require('axios');

/**
 * Calls the external ML service to compute a risk score.
 * @param {Object} payload - Data to send to the ML endpoint.
 * @returns {Promise<Object>} - Resolves with the response body from the ML service.
 */
const getRiskScore = async (payload) => {
  const response = await axios.post('http://localhost:8000/risk-score', payload);
  return response.data;
};

module.exports = { getRiskScore };
