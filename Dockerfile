# ─────────────────────────────────────────────
# GigShield AI — Cloud-Native Monolith
# Optimized for Hugging Face Spaces (UID 1000)
# ─────────────────────────────────────────────

# STAGE 1: Build React Frontend
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm install
COPY frontend/ ./
RUN npm run build

# STAGE 2: Final Monolith Container
FROM node:20-alpine

# Install system dependencies (Nginx, Supervisor)
RUN apk add --no-cache nginx supervisor

WORKDIR /app

# 1. Install Backend Dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install --omit=dev

# 2. Install Trigger Engine Dependencies
COPY trigger-engine/package*.json ./trigger-engine/
RUN cd trigger-engine && npm install --omit=dev

# 3. Install Root Dependencies (shared modules)
COPY package*.json ./
RUN npm install --omit=dev

# 4. Copy Source Code
COPY . .

# 5. Populate Frontend Build
RUN rm -rf /usr/share/nginx/html/*
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

# 6. Configure Services
COPY supervisord.conf /etc/supervisord.conf
COPY frontend/nginx.hf.conf /etc/nginx/http.d/default.conf

# 7. Huging Face Permissions (Run as UID 1000)
# We must ensure all runtime directories are writable by user 1000
RUN mkdir -p /var/lib/nginx /var/log/nginx /run/nginx /tmp/supervisor /app/shared && \
    chown -R 1000:1000 /app /usr/share/nginx/html /var/lib/nginx /var/log/nginx /run/nginx /tmp

USER 1000
EXPOSE 7860

# Start all processes via Supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
