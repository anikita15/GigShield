# ─────────────────────────────────────────────
# GigShield AI — Unified Zero-Cost Monolith
# Optimized for Hugging Face Spaces (No CC)
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

# Set workdir
WORKDIR /app

# Install Backend Dependencies in root for shared model access
COPY backend/package*.json ./
RUN npm install --omit=dev

# Copy all source code (Backend, Trigger, Shared)
COPY . .

# Copy build frontend to Nginx public dir
COPY --from=frontend-build /app/frontend/dist /usr/share/nginx/html

# Copy configurations
COPY supervisord.conf /etc/supervisord.conf
COPY frontend/nginx.conf /etc/nginx/http.d/default.conf

# Setup logs and permissions
RUN mkdir -p /var/log && \
    touch /var/log/backend.err.log /var/log/backend.out.log \
          /var/log/trigger.err.log /var/log/trigger.out.log \
          /var/log/nginx.err.log /var/log/nginx.out.log && \
    chmod -R 777 /var/log /var/lib/nginx /run/nginx

# Port 7860 is the default for Hugging Face Spaces
EXPOSE 7860

# Point Nginx to listen on 7860 and proxy to Backend on 3000
RUN sed -i 's/listen 80/listen 7860/g' /etc/nginx/http.d/default.conf && \
    sed -i 's/localhost:3000/127.0.0.1:3000/g' /etc/nginx/http.d/default.conf

# Start all processes via Supervisor
CMD ["/usr/bin/supervisord", "-c", "/etc/supervisord.conf"]
