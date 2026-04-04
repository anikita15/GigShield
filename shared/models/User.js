const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true, unique: true },
  trustScore: { type: Number, default: 0.8 },
  isPremium: { type: Boolean, default: false },
  tier: { type: String, enum: ['basic', 'sentinel'], default: 'basic' },
  role: { type: String, enum: ['worker', 'admin'], default: 'worker' },
  weeklyPremium: { type: Number, default: null }, // Stored from questionnaire calculation
  otp: { type: String },
  otpExpiresAt: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('User', UserSchema);
