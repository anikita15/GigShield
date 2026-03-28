const User = require('../models/User');
const generateToken = require('../utils/generateToken');

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
    user.otp = otp;
    user.otpExpiresAt = new Date(Date.now() + 10 * 60000); // 10 minutes expiry
    await user.save();

    // In a real app, send OTP via SMS here.
    // For demo/simulated purposes, we return it in the response.
    res.json({
      success: true,
      message: 'OTP generated. Use this to verify.',
      demo_otp: otp 
    });
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

    if (!user.otp || user.otp !== otp) {
      const err = new Error('Invalid OTP');
      err.statusCode = 401;
      throw err;
    }

    if (new Date() > user.otpExpiresAt) {
      const err = new Error('OTP expired');
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
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (err) {
    next(err);
  }
};
