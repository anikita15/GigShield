const ActivityLog = require('../models/ActivityLog');
const RiskScore = require('../models/RiskScore');
const { getRiskScore } = require('../services/mlService');

/**
 * @desc   Compute and store risk score for a user
 * @route  POST /api/risk/score/:userId
 */
exports.computeRiskScore = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // 1. Retrieve activity count for the user
    const activityCount = await ActivityLog.countDocuments({ userId });

    // 2. Mock external data
    const mockData = {
      weather: 'clear',   // placeholder value
      traffic: 'moderate', // placeholder value
      pollution: 'low',    // placeholder value
      history: activityCount,
    };

    // 3. Call ML service
    const mlResult = await getRiskScore({
      userId,
      ...mockData,
    });

    const { risk_score } = mlResult;

    // 4. Store result in RiskScore collection
    const riskRecord = await RiskScore.create({
      userId,
      score: risk_score,
      factors: mockData,
    });

    // 5. Return response
    res.json({ success: true, risk_score: riskRecord.score });
  } catch (err) {
    next(err);
  }
};
