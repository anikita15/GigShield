const ActivityLog = require('../models/ActivityLog');

/**
 * @desc   Create a new activity log
 * @route  POST /api/activity
 */
exports.createActivity = async (req, res, next) => {
  try {
    const { userId, location, deliveriesCompleted } = req.body;

    // Simple validation
    if (!userId) {
      const err = new Error('userId is required');
      err.statusCode = 400;
      throw err;
    }
    if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
      const err = new Error('location with numeric lat and lng is required');
      err.statusCode = 400;
      throw err;
    }

    const activity = await ActivityLog.create({
      userId,
      location,
      deliveriesCompleted,
    });

    res.status(201).json({ success: true, data: activity });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Get all activity logs for a user
 * @route  GET /api/activity/:userId
 */
exports.getUserActivities = async (req, res, next) => {
  try {
    const { userId } = req.params;

    const logs = await ActivityLog.find({ userId })
      .sort({ timestamp: -1 })
      .exec();

    res.json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    next(err);
  }
};
