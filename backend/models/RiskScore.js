const mongoose = require('mongoose');

const RiskScoreSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  factors: { type: Object },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('RiskScore', RiskScoreSchema);
