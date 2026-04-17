const mongoose = require('mongoose');
const User = require('../../shared/models/User');
const FraudFlag = require('../../shared/models/FraudFlag');
const RiskScore = require('../../shared/models/RiskScore');
const { sendNotification } = require('../services/notificationService');

exports.getAllPayouts = async (req, res, next) => {
  try {
    const Payout = require('../../shared/models/Payout');
    const payouts = await Payout.find().populate('userId', 'name email').sort({ createdAt: -1 }).limit(50);
    res.json({ success: true, data: payouts });
  } catch (err) {
    next(err);
  }
};

exports.getDashboardStats = async (req, res, next) => {
  try {
    const Payout = require('../../shared/models/Payout');
    const FraudFlag = require('../../shared/models/FraudFlag');

    const totalPayouts = await Payout.countDocuments({ status: 'paid' });
    const totalPayoutValueObj = await Payout.aggregate([{ $match: { status: 'paid' } }, { $group: { _id: null, total: { $sum: '$amount' } } }]);
    const totalPayoutValue = totalPayoutValueObj[0]?.total || 0;

    const blockedPayouts = await FraudFlag.countDocuments({ status: { $in: ['open', 'investigating'] } });
    const allUsersCount = await User.countDocuments();

    // Logic: lossRatio is Paid Out / (Paid Out + Blocked Potential Loss)
    const preventedPotentialLoss = blockedPayouts * 500;
    const lossRatio = totalPayoutValue || preventedPotentialLoss 
      ? ((totalPayoutValue / (totalPayoutValue + preventedPotentialLoss)) * 100).toFixed(1) + '%'
      : '0%';

    const fraudRate = allUsersCount ? ((blockedPayouts / allUsersCount) * 100).toFixed(1) : 0;
    const todayProtected = totalPayoutValue + preventedPotentialLoss;

    res.json({
      success: true,
      data: {
        totalPayouts,
        totalPayoutValue,
        blockedPayouts,
        fraudRate: `${fraudRate}%`,
        lossRatio,
        todayProtected
      }
    });

  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Get all users (paginated)
 * @route  GET /api/admin/users
 * @access Admin only
 */
exports.getAllUsers = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const total = await User.countDocuments();
    const users = await User.find()
      .select('-otp -otpExpiresAt')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: users.length,
      pagination: { total, page, pages: Math.ceil(total / limit) },
      data: users,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Get all fraud flags (with optional status filter)
 * @route  GET /api/admin/fraud-flags
 * @access Admin only
 */
exports.getFraudFlags = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.status) {
      const allowed = ['open', 'investigating', 'resolved', 'dismissed'];
      if (!allowed.includes(req.query.status)) {
        const err = new Error(`status must be one of: ${allowed.join(', ')}`);
        err.statusCode = 400;
        throw err;
      }
      filter.status = req.query.status;
    }

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 20;
    const skip = (page - 1) * limit;

    const total = await FraudFlag.countDocuments(filter);
    const flags = await FraudFlag.find(filter)
      .populate('userId', 'name email phone')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      success: true,
      count: flags.length,
      pagination: { total, page, pages: Math.ceil(total / limit) },
      data: flags,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Admin override: manually set a user's risk score
 * @route  POST /api/admin/risk-override/:userId
 * @access Admin only
 */
exports.overrideRiskScore = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { newScore, reason } = req.body;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      const err = new Error('userId must be a valid ObjectId');
      err.statusCode = 400;
      throw err;
    }

    if (typeof newScore !== 'number' || newScore < 0 || newScore > 1) {
      const err = new Error('newScore must be a decimal between 0 and 1 (e.g. 0.75)');
      err.statusCode = 400;
      throw err;
    }

    if (!reason || typeof reason !== 'string' || reason.trim().length === 0) {
      const err = new Error('reason is required');
      err.statusCode = 400;
      throw err;
    }

    const riskRecord = await RiskScore.create({
      userId,
      score: newScore,
      factors: {
        source: 'admin_override',
        reason: reason.trim(),
        adminId: req.user._id || req.user.id,
      },
    });

    // Notify the user about the score change
    await sendNotification(
      userId,
      'Risk Score Updated',
      `Your risk score has been updated to ${newScore} by an administrator. Reason: ${reason.trim()}`,
      'system'
    );

    res.json({ success: true, data: riskRecord });
  } catch (err) {
    next(err);
  }
};
