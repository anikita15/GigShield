/**
 * evaluator.js — Core Trigger Engine Logic
 *
 * Evaluates which users are eligible for an automated income-protection payout.
 *
 * Rules:
 *   1. Read the latest RiskScore from the DB (NOT from the live API).
 *   2. If risk_score >= THRESHOLD, the user qualifies for a payout.
 *   3. GUARD: Skip if user has an open/investigating FraudFlag.
 *   4. GUARD: Skip if user received a payout within the cooldown window.
 *   5. GUARD: Skip if an idempotency key for this cycle already exists.
 *   6. On failure, do NOT retry — wait for next cron cycle.
 */

const mongoose = require('mongoose');
const RiskScore = require('../models/RiskScore');
const FraudFlag = require('../models/FraudFlag');
const Payout = require('../models/Payout');
const User = require('../models/User');

const THRESHOLD = parseFloat(process.env.RISK_PAYOUT_THRESHOLD) || 0.5;
const COOLDOWN_MS = parseInt(process.env.PAYOUT_COOLDOWN_MS) || 86400000; // 24h

/**
 * Build an idempotency key from userId + date slot.
 * This ensures the same user cannot receive two payouts in the same cron cycle.
 * Format: "trigger_<userId>_<YYYY-MM-DD_HH:MM>"
 */
function buildIdempotencyKey(userId, now) {
  const slot = now.toISOString().slice(0, 16); // "2026-03-29T10:30"
  return `trigger_${userId}_${slot}`;
}

/**
 * Evaluate all users and return a list of eligible payout actions.
 * @returns {Array<{ userId, riskScore, idempotencyKey }>}
 */
async function evaluate() {
  const results = [];
  const now = new Date();
  const cooldownLimit = new Date(now.getTime() - COOLDOWN_MS);

  // 1. Get all users
  const users = await User.find({}).select('_id').lean();

  for (const user of users) {
    const userId = user._id.toString();

    try {
      // 2. Get the LATEST risk score from DB
      const latestRisk = await RiskScore.findOne({ userId: user._id })
        .sort({ createdAt: -1 })
        .lean();

      if (!latestRisk || latestRisk.score < THRESHOLD) {
        // Risk not high enough — skip
        continue;
      }

      // 3. FRAUD CHECK: Skip if user has active fraud flags
      const activeFraud = await FraudFlag.findOne({
        userId: user._id,
        status: { $in: ['open', 'investigating'] },
      }).lean();

      if (activeFraud) {
        console.log(`[SKIP] User ${userId}: Active fraud flag (${activeFraud.status})`);
        continue;
      }

      // 4. COOLDOWN CHECK: Skip if user was paid recently
      const recentPayout = await Payout.findOne({
        userId: user._id,
        createdAt: { $gte: cooldownLimit },
      }).lean();

      if (recentPayout) {
        console.log(`[SKIP] User ${userId}: Payout cooldown active (last: ${recentPayout.createdAt})`);
        continue;
      }

      // 5. IDEMPOTENCY CHECK: Skip if this cycle already processed
      const idempotencyKey = buildIdempotencyKey(userId, now);
      const existingPayout = await Payout.findOne({ idempotencyKey }).lean();

      if (existingPayout) {
        console.log(`[SKIP] User ${userId}: Idempotency key already exists for this cycle`);
        continue;
      }

      // All guards passed — user is eligible
      results.push({
        userId,
        riskScore: latestRisk.score,
        idempotencyKey,
      });
    } catch (err) {
      // On failure, log and skip — retry on next cron cycle
      console.error(`[ERROR] Failed to evaluate user ${userId}:`, err.message);
    }
  }

  return results;
}

module.exports = { evaluate, buildIdempotencyKey };
