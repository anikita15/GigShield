const mongoose = require('mongoose');
const ActivityLog = require('../models/ActivityLog');

/**
 * @desc   Create a new activity log
 * @route  POST /api/activity
 */
exports.createActivity = async (req, res, next) => {
  try {
    const { userId, location, deliveriesCompleted } = req.body;

    // Validate userId is a valid ObjectId
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      const err = new Error('userId must be a valid ObjectId');
      err.statusCode = 400;
      throw err;
    }

    // Validate location
    if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
      const err = new Error('location with numeric lat and lng is required');
      err.statusCode = 400;
      throw err;
    }

    // Validate deliveriesCompleted if provided
    if (deliveriesCompleted !== undefined) {
      if (typeof deliveriesCompleted !== 'number') {
        const err = new Error('deliveriesCompleted must be a number');
        err.statusCode = 400;
        throw err;
      }
      if (deliveriesCompleted < 0) {
        const err = new Error('deliveriesCompleted cannot be negative');
        err.statusCode = 400;
        throw err;
      }
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

    // Validate userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const err = new Error('userId must be a valid ObjectId');
      err.statusCode = 400;
      throw err;
    }

    const logs = await ActivityLog.find({ userId })
      .sort({ timestamp: -1 })
      .exec();

    res.json({ success: true, count: logs.length, data: logs });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Create multiple activity logs (Bulk Ingest)
 * @route  POST /api/activity/bulk
 */
exports.bulkCreateActivity = async (req, res, next) => {
  try {
    const { activities } = req.body;

    if (!Array.isArray(activities) || activities.length === 0) {
      const err = new Error('activities must be a non-empty array');
      err.statusCode = 400;
      throw err;
    }

    const validatedActivities = activities.map(item => {
      const { userId, location, deliveriesCompleted } = item;

      if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error(`userId must be a valid ObjectId for all items`);
      }
      if (!location || typeof location.lat !== 'number' || typeof location.lng !== 'number') {
        throw new Error('location with numeric lat and lng is required for all items');
      }
      if (deliveriesCompleted !== undefined) {
        if (typeof deliveriesCompleted !== 'number' || deliveriesCompleted < 0) {
          throw new Error('deliveriesCompleted must be a positive number if provided');
        }
      }

      return { userId, location, deliveriesCompleted };
    });

    const inserted = await ActivityLog.insertMany(validatedActivities);

    res.status(201).json({ success: true, count: inserted.length, data: inserted });
  } catch (err) {
    if (!err.statusCode) err.statusCode = 400; // Map mapping throw to 400
    next(err);
  }
};
