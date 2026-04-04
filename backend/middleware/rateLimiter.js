const rateLimit = require('express-rate-limit');

/**
 * General auth rate limiter: 10 requests per 15 minutes per IP
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many requests. Please try again later.' },
});

/**
 * Strict OTP rate limiter: 5 requests per 10 minutes per IP
 * Prevents brute-force OTP guessing
 */
const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000,
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, error: 'Too many OTP attempts. Please wait before retrying.' },
});

module.exports = { authLimiter, otpLimiter };
