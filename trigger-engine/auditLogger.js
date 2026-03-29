/**
 * auditLogger.js — Logs trigger engine actions for admin visibility
 *
 * Stores a record of every evaluation cycle: who was evaluated,
 * what decision was made, and whether the payout succeeded.
 */

const mongoose = require('mongoose');

const TriggerEventSchema = new mongoose.Schema({
  cycleId: { type: String, required: true, index: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  riskScore: { type: Number, required: true },
  decision: {
    type: String,
    enum: ['payout_initiated', 'payout_failed', 'blocked_fraud', 'skipped_cooldown', 'skipped_idempotency'],
    required: true,
  },
  idempotencyKey: { type: String },
  payoutId: { type: String },
  errorMessage: { type: String },
}, { timestamps: true });

const TriggerEvent = mongoose.model('TriggerEvent', TriggerEventSchema);

/**
 * Log a trigger event to the database.
 */
async function logTriggerEvent(data) {
  try {
    await TriggerEvent.create(data);
  } catch (err) {
    // Audit logging should never crash the engine
    console.error('[AUDIT] Failed to log trigger event:', err.message);
  }
}

module.exports = { logTriggerEvent, TriggerEvent };
