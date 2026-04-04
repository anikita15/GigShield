# ─────────────────────────────────────────────
# GigShield AI — ML Risk Scoring Service
# ─────────────────────────────────────────────
FROM python:3.10-slim

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    NODE_ENV=production

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y --no-install-recommends \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Install python dependencies
COPY ml-service/requirements.txt ./ml-service/
RUN pip install --no-cache-dir -r ml-service/requirements.txt

# Copy all source
COPY . .

# Adjust working directory
WORKDIR /app/ml-service

# Expose FastAPI port
EXPOSE 8000

# Health check using curl
HEALTHCHECK --interval=30s --timeout=10s --retries=3 \
  CMD curl -f http://localhost:8000/health || exit 1

# Run the application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000", "--no-access-log"]
