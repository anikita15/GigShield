/**
 * auditLogger.js — Logs trigger engine actions for admin visibility
 *
 * Stores a record of every evaluation cycle: who was evaluated,
 * what decision was made, and whether the payout succeeded.
 */

const TriggerEvent = require('../shared/models/TriggerEvent');

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
