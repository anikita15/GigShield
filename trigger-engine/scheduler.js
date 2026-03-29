/**
 * scheduler.js — Cron-based job scheduler
 *
 * Runs the evaluation + dispatch cycle on a configurable interval.
 * Includes a mutex lock to prevent overlapping executions if a cycle
 * takes longer than the cron interval.
 */

const cron = require('node-cron');
const { evaluate } = require('./evaluator');
const { dispatchPayout } = require('./dispatcher');
const { logTriggerEvent } = require('./auditLogger');

const CRON_SCHEDULE = process.env.CRON_SCHEDULE || '*/15 * * * *';

let isRunning = false;

/**
 * Generate a unique cycle ID for audit trail grouping.
 */
function generateCycleId() {
  const now = new Date();
  return `cycle_${now.toISOString().replace(/[:.]/g, '-')}`;
}

/**
 * Execute one full evaluation + dispatch cycle.
 */
async function runCycle() {
  if (isRunning) {
    console.log('[SCHEDULER] Previous cycle still running — skipping this interval.');
    return;
  }

  isRunning = true;
  const cycleId = generateCycleId();
  console.log(`\n========================================`);
  console.log(`[CYCLE START] ${cycleId}`);
  console.log(`========================================`);

  try {
    // Phase 1: Evaluate
    const eligibleUsers = await evaluate();
    console.log(`[EVALUATE] Found ${eligibleUsers.length} eligible user(s) for payout.`);

    if (eligibleUsers.length === 0) {
      console.log('[CYCLE END] No payouts to process.');
      return;
    }

    // Phase 2: Dispatch payouts
    let successCount = 0;
    let failCount = 0;

    for (const action of eligibleUsers) {
      const result = await dispatchPayout(action);

      // Phase 3: Audit log
      let decision;
      if (result.success) {
        decision = 'payout_initiated';
        successCount++;
      } else if (result.blocked) {
        decision = 'blocked_fraud';
        failCount++;
      } else {
        decision = 'payout_failed';
        failCount++;
      }

      await logTriggerEvent({
        cycleId,
        userId: action.userId,
        riskScore: action.riskScore,
        decision,
        idempotencyKey: action.idempotencyKey,
        payoutId: result.payoutId || null,
        errorMessage: result.error || null,
      });
    }

    console.log(`[CYCLE END] Success: ${successCount}, Failed: ${failCount}`);
  } catch (err) {
    console.error(`[CYCLE FATAL] ${err.message}`);
  } finally {
    isRunning = false;
  }
}

/**
 * Start the cron scheduler.
 */
function startScheduler() {
  console.log(`[SCHEDULER] Trigger engine scheduled: "${CRON_SCHEDULE}"`);
  console.log(`[SCHEDULER] Risk threshold: ${process.env.RISK_PAYOUT_THRESHOLD || 0.5}`);
  console.log(`[SCHEDULER] Cooldown: ${process.env.PAYOUT_COOLDOWN_MS || 86400000}ms`);

  cron.schedule(CRON_SCHEDULE, () => {
    runCycle();
  });

  // Run immediately on startup for testing
  console.log('[SCHEDULER] Running initial cycle...');
  runCycle();
}

module.exports = { startScheduler, runCycle };
