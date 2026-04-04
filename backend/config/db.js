const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');
const dns = require('dns');
const { MONGO_URI } = require('./env');

// Force IPv4 first for Alpine/musl SRV resolution
dns.setDefaultResultOrder('ipv4first');

let mongoServer;

const connectDB = async () => {
  try {
    // Mask the password part of the URI for safe logging
    // Replaces the part between : and @ with ****
    const maskedUri = MONGO_URI ? MONGO_URI.replace(/:\/\/([^:]+):([^@]+)@/, '://$1:****@') : 'MISSING';
    console.log(`📡 Attempting connection: ${maskedUri}`);
    
    // 1. Attempt connection with provided URI
    await mongoose.connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 });
    console.log('✅ MongoDB connected');
  } catch (err) {
    if (MONGO_URI.includes('localhost') || MONGO_URI.includes('127.0.0.1')) {
      console.log('⚠️ Local MongoDB not found. Initializing In-Memory Database for Audit...');
      
      const { MongoMemoryServer } = require('mongodb-memory-server');
      if (!mongoServer) {
        mongoServer = await MongoMemoryServer.create();
      }
      const uri = mongoServer.getUri();
      
      await mongoose.connect(uri);
      console.log('🔥 In-Memory MongoDB active:', uri);

      // 🔄 SYNC: Write this ephemeral URI to a root .env.local for Trigger Engine
      const rootEnvLocal = path.join(__dirname, '../../.env.local');
      console.log('🔄 SYNCING .env.local with:', uri);
      fs.writeFileSync(rootEnvLocal, `MONGO_URI=${uri}\n`);
    } else {
      console.error('❌ MongoDB connection error:', err);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
