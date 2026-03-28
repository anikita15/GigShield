const mongoose = require('mongoose');

const PayoutSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  status: {
    type: String,
    enum: ['pending', 'approved', 'paid'],
    default: 'pending',
  },
  triggerType: { type: String },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Payout', PayoutSchema);
