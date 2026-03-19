# Backend Dockerfile
FROM python:3.11-slim

WORKDIR /app

# Install system dependencies with robust mirror configuration
RUN apt-get clean && \
    rm -rf /var/lib/apt/lists/* && \
    sed -i 's|http://deb.debian.org|https://deb.debian.org|g' /etc/apt/sources.list.d/debian.sources || true && \
    apt-get update -o Acquire::Retries=3 && \
    apt-get install -y --no-install-recommends gcc curl && \
    rm -rf /var/lib/apt/lists/*

# Copy requirements
COPY requirements.txt .

# Install Python dependencies
RUN pip install --upgrade pip
RUN pip install --no-cache-dir --default-timeout=100 -r requirements.txt

# Copy application code
COPY . .

# Expose port
EXPOSE 8000

# Run application
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
