const express = require('express');
const router = express.Router();
const { register, requestOtp, verifyOtp, subscribe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { authLimiter, otpLimiter } = require('../middleware/rateLimiter');
const TokenBlacklist = require('../../shared/models/TokenBlacklist');
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');

// POST /api/auth/register
router.post('/register', authLimiter, register);

// POST /api/auth/request-otp
router.post('/request-otp', otpLimiter, requestOtp);

// POST /api/auth/verify-otp
router.post('/verify-otp', otpLimiter, verifyOtp);

// POST /api/auth/subscribe (Protected)
router.post('/subscribe', protect, subscribe);

// POST /api/auth/logout (Protected)
router.post('/logout', protect, async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      const decoded = jwt.decode(token);
      const expiresAt = decoded?.exp ? new Date(decoded.exp * 1000) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
      await TokenBlacklist.create({ token, expiresAt });
    }
    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
});

module.exports = router;
