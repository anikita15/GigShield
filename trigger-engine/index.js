/**
 * index.js — GigShield Trigger Engine Entry Point
 *
 * This is a standalone Node.js process that:
 *   1. Connects to the same MongoDB as the backend
 *   2. Runs a cron job to evaluate workers' risk scores
 *   3. Dispatches automated income-protection payouts via the Backend API
 *
 * Run:
 *   node index.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const { startScheduler } = require('./scheduler');

const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.error('FATAL: MONGO_URI is not set in .env');
  process.exit(1);
}

if (!process.env.INTERNAL_API_KEY) {
  console.error('FATAL: INTERNAL_API_KEY is not set in .env');
  process.exit(1);
}

async function start() {
  try {
    console.log('[ENGINE] Connecting to MongoDB...');
    await mongoose.connect(MONGO_URI);
    console.log('[ENGINE] MongoDB connected.');

    // Start the cron-based scheduler
    startScheduler();
  } catch (err) {
    console.error('[ENGINE] Failed to start:', err.message);
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n[ENGINE] Shutting down...');
  await mongoose.connection.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n[ENGINE] Shutting down...');
  await mongoose.connection.close();
  process.exit(0);
});

start();
