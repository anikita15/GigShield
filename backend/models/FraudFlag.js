const mongoose = require('mongoose');

const FraudFlagSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  score: { type: Number, required: true },
  reason: { type: String },
  status: {
    type: String,
    enum: ['open', 'resolved'],
    default: 'open',
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('FraudFlag', FraudFlagSchema);
