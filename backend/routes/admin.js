const express = require('express');
const router = express.Router();

const { protect, checkRole } = require('../middleware/authMiddleware');
const {
  getAllUsers,
  getFraudFlags,
  overrideRiskScore,
  getDashboardStats,
  getAllPayouts,
} = require('../controllers/adminController');

// All admin routes require authentication + admin role
router.use(protect);
router.use(checkRole('admin'));

// GET /api/admin/stats
router.get('/stats', getDashboardStats);

// GET /api/admin/payouts
router.get('/payouts', getAllPayouts);

// GET /api/admin/users
router.get('/users', getAllUsers);

// GET /api/admin/fraud-flags
router.get('/fraud-flags', getFraudFlags);

// POST /api/admin/risk-override/:userId
router.post('/risk-override/:userId', overrideRiskScore);

module.exports = router;
