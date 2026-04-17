const User = require('../../shared/models/User');
const generateToken = require('../utils/generateToken');
const bcrypt = require('bcryptjs');
const { NODE_ENV } = require('../config/env');

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

/**
 * @desc   Register a new user (Creates user, but returns instruction to request OTP)
 * @route  POST /api/auth/register
 */
exports.register = async (req, res, next) => {
  try {
    const { name, phone, email } = req.body;

    if (!name || !phone || !email) {
      const err = new Error('Please provide name, phone, and email');
      err.statusCode = 400;
      throw err;
    }

    const digitsOnly = phone.replace(/\D/g, '');
    if (digitsOnly.length !== 10) {
      const err = new Error('Phone number must be exactly 10 digits.');
      err.statusCode = 400;
      throw err;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      const err = new Error('Please provide a valid email address.');
      err.statusCode = 400;
      throw err;
    }

    const phoneExists = await User.findOne({ phone });
    if (phoneExists) {
      const err = new Error('User with this phone number already exists');
      err.statusCode = 409;
      throw err;
    }

    const emailExists = await User.findOne({ email });
    if (emailExists) {
      const err = new Error('User with this email already exists');
      err.statusCode = 409;
      throw err;
    }

    const user = await User.create({ name, phone, email });

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Please request an OTP to login.',
      userId: user._id
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Request an OTP for login
 * @route  POST /api/auth/request-otp
 */
exports.requestOtp = async (req, res, next) => {
  try {
    const { phone } = req.body;

    if (!phone) {
      const err = new Error('Please provide a phone number');
      err.statusCode = 400;
      throw err;
    }

    const user = await User.findOne({ phone });
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    const otp = generateOTP();
    user.otp = await bcrypt.hash(otp, 10);
    user.otpExpiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes expiry
    await user.save();

    // In production, send OTP via SMS. In demo, return it to the frontend for ease.
    const response = {
      success: true,
      message: 'OTP generated. Use this to verify.',
      demo_otp: otp
    };
    res.json(response);
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Verify OTP and login
 * @route  POST /api/auth/verify-otp
 */
exports.verifyOtp = async (req, res, next) => {
  try {
    const { phone, otp } = req.body;

    if (!phone || !otp) {
      const err = new Error('Please provide phone and otp');
      err.statusCode = 400;
      throw err;
    }

    const user = await User.findOne({ phone });
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    if (!user.otp || !user.otpExpiresAt) {
      const err = new Error('No OTP was requested. Please request a new one.');
      err.statusCode = 400;
      throw err;
    }

    // Check expiry FIRST — prevents timing attack that leaks OTP correctness
    if (new Date() > user.otpExpiresAt) {
      const err = new Error('OTP expired. Please request a new one.');
      err.statusCode = 401;
      throw err;
    }

    if (!(await bcrypt.compare(otp, user.otp))) {
      const err = new Error('Invalid OTP');
      err.statusCode = 401;
      throw err;
    }

    // Clear OTP after successful login
    user.otp = undefined;
    user.otpExpiresAt = undefined;
    await user.save();

    res.json({
      success: true,
      _id: user._id,
      name: user.name,
      phone: user.phone,
      email: user.email,
      isPremium: user.isPremium,
      tier: user.tier,
      role: user.role,
      weeklyPremium: user.weeklyPremium,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};

/**
 * @desc   Upgrade user to Premium (Sentinel)
 * @route  POST /api/auth/subscribe
 */
exports.subscribe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      const err = new Error('User not found');
      err.statusCode = 404;
      throw err;
    }

    const { weeklyPremium } = req.body;

    user.isPremium = true;
    user.tier = 'sentinel';
    if (typeof weeklyPremium === 'number' && weeklyPremium > 0) {
      user.weeklyPremium = weeklyPremium;
    }
    await user.save();

    res.json({
      success: true,
      message: 'Subscribed to Sentinel successfully',
      isPremium: true,
      tier: 'sentinel',
      weeklyPremium: user.weeklyPremium,
    });
  } catch (err) {
    next(err);
  }
};
