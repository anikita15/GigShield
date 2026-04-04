# ─────────────────────────────────────────────
# STAGE 1: Build Stage
# ─────────────────────────────────────────────
FROM node:20-alpine AS build-stage

WORKDIR /app

# Copy package files relative to new root context
COPY frontend/package*.json ./frontend/

# Install dependencies
RUN cd frontend && npm install

# Copy all source (provides ./frontend)
COPY . .

# Build the Vite application
RUN cd frontend && npm run build

# ─────────────────────────────────────────────
# STAGE 2: Production Stage
# ─────────────────────────────────────────────
FROM nginx:stable-alpine AS production-stage

# Copy custom Nginx configuration
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy build output from build-stage to Nginx public directory
COPY --from=build-stage /app/frontend/dist /usr/share/nginx/html

# Expose port (Nginx listens on 80)
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
