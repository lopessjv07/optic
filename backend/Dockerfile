# Use slim python image
FROM python:3.9-slim

# Install system dependencies (needed for OpenCV/TensorFlow)
RUN apt-get update && apt-get install -y \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy API requirements
COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Copy model from root context to /app/meu_modelo.h5
COPY meu_modelo.h5 .

# Copy API code
COPY backend/ ./backend/

# Expose port
EXPOSE 8000

# Run FastAPI with Uvicorn
CMD ["uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"]
