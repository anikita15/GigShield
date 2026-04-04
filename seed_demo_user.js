/**
 * seed_demo_user.js
 * Robust seeding script that resolves its own paths.
 */
const path = require('path');
const fs = require('fs');
const mongoose = require('mongoose');

// Manually load dotenv from backend folder
const backendPath = path.resolve(__dirname, 'backend');
const envPath = path.join(backendPath, '.env');
const envContent = fs.readFileSync(envPath, 'utf8');

const env = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) env[key.trim()] = value.trim();
});

const MONGO_URI = env.MONGO_URI;
const User = require('./backend/models/User');

const DEMO_USER_ID = "6605a2e5c1d2e3f4a5b6c7d8";

async function seed() {
  if (!MONGO_URI) {
    console.error("❌ MONGO_URI not found in backend/.env");
    process.exit(1);
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB...");

    let user = await User.findById(DEMO_USER_ID);
    if (!user) {
      user = new User({
        _id: new mongoose.Types.ObjectId(DEMO_USER_ID),
        name: "Alex Courier",
        email: "alex@gigshield.ai",
        phone: "+15550123",
        trustScore: 0.98,
        role: "worker"
      });
      await user.save();
      console.log(`✅ Demo User created with ID: ${DEMO_USER_ID}`);
    } else {
      console.log(`ℹ️ Demo User already exists.`);
    }

    process.exit(0);
  } catch (err) {
    console.error("❌ Seeding failed:", err.message);
    process.exit(1);
  }
}

seed();
