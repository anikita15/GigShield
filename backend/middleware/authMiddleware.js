const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { JWT_SECRET, INTERNAL_API_KEY } = require('../config/env');

/**
 * Middleware to protect routes that require authentication.
 * Supports two auth methods:
 *   1. Bearer JWT token (for users/admins)
 *   2. x-internal-api-key header (for trigger-engine service calls)
 */
const protect = async (req, res, next) => {
  // ── Internal Service Auth (Trigger Engine) ──
  const internalKey = req.headers['x-internal-api-key'];
  if (internalKey) {
    if (internalKey !== INTERNAL_API_KEY) {
      const err = new Error('Invalid internal API key');
      err.statusCode = 401;
      return next(err);
    }
    // Mark request as system-level; set a synthetic user object
    req.user = { id: 'system', role: 'admin', isSystem: true };
    return next();
  }

  // ── Standard JWT Auth ──
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, JWT_SECRET);

      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
        const err = new Error('Not authorized, user not found');
        err.statusCode = 401;
        return next(err);
      }

      next();
    } catch (err) {
      console.error('Token verification failed:', err.message);
      const error = new Error('Not authorized, token failed');
      error.statusCode = 401;
      return next(error);
    }
  } else {
    const err = new Error('Not authorized, no token');
    err.statusCode = 401;
    return next(err);
  }
};

/**
 * Middleware to restrict access based on user role
 * @param {...string} roles - Allowed roles
 */
const checkRole = (...roles) => {
  return (req, res, next) => {
    // System-level requests always pass role checks
    if (req.user && req.user.isSystem) {
      return next();
    }
    if (!req.user || !roles.includes(req.user.role)) {
      const err = new Error(`User role ${req.user ? req.user.role : 'unknown'} is not authorized to access this route`);
      err.statusCode = 403;
      return next(err);
    }
    next();
  };
};

module.exports = { protect, checkRole };
