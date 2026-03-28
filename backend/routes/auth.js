const express = require('express');
const router = express.Router();
const { register, requestOtp, verifyOtp } = require('../controllers/authController');

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/request-otp
router.post('/request-otp', requestOtp);

// POST /api/auth/verify-otp
router.post('/verify-otp', verifyOtp);

module.exports = router;
