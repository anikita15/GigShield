/**
 * paymentGateway.js - Simulated payout processing via mock external gateway
 */
const crypto = require('crypto');

const simulatePayout = async (userId, amount, idempotencyKey = null) => {
  return new Promise((resolve) => {
    // Simulate gateway delay
    setTimeout(() => {
      let txSeed;
      if (idempotencyKey) {
        // Create a short hash of the idempotency key for determinism
        const hash = crypto.createHash('md5').update(idempotencyKey).digest('hex');
        txSeed = hash.substring(0, 8).toUpperCase();
      } else {
        txSeed = Math.floor(Math.random()*100000000).toString().padStart(8, '0');
      }

      const transactionId = `TXN_GS_${txSeed}_${userId.slice(-4)}`;
      resolve({
        success: true,
        transactionId,
        status: 'paid'
      });
    }, 800); // 800ms mock delay
  });
};

module.exports = { simulatePayout };
