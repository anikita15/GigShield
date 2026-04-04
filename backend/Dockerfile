# ─────────────────────────────────────────────
# GigShield AI — Backend API Service
# ─────────────────────────────────────────────
FROM node:20-alpine

# Set production environment
ENV NODE_ENV=production

WORKDIR /app

# Install dependencies in the ROOT /app directory
# This ensures that both /backend and /shared can resolve them
COPY backend/package*.json ./
RUN npm install --omit=dev

# Copy the ENTIRE project source (provides ./backend and ./shared)
COPY . .

# Adjust working directory to backend folder for the start command
WORKDIR /app/backend

# Expose API port
EXPOSE 3000

# Health check using wget
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

# Start the server
CMD ["node", "server.js"]
