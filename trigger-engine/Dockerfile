# ─────────────────────────────────────────────
# GigShield AI — Autonomous Trigger Engine
# ─────────────────────────────────────────────
FROM node:20-alpine

# Set environment variables
ENV NODE_ENV=production

WORKDIR /app

# Install dependencies in the ROOT /app directory
# This ensures that both /trigger-engine and /shared can resolve them
COPY trigger-engine/package*.json ./
RUN npm install --omit=dev

# Copy the ENTIRE project source (provides ./trigger-engine and ./shared)
COPY . .

# Adjust working directory to trigger-engine folder for the start command
WORKDIR /app/trigger-engine

# Start the engine
CMD ["node", "index.js"]
