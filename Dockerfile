# Use slim python image to save space
FROM python:3.9-slim

# Install system dependencies
# tesseract-ocr: for reading text from images
# libgl1-mesa-glx & libglib2.0-0: required for OpenCV
RUN apt-get update && apt-get install -y \
    tesseract-ocr \
    tesseract-ocr-por \
    libgl1-mesa-glx \
    libglib2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /app

# Copy requirements and install dependencies first (caching layer)
COPY botia/requirements.txt ./botia/requirements.txt
RUN pip install --no-cache-dir -r botia/requirements.txt

# Copy the model file to the root of WORKDIR (so it's at /app/meu_modelo.h5)
COPY meu_modelo.h5 .

# Copy the bot code
COPY botia/ ./botia/

# Set environment variable for unbuffered output
ENV PYTHONUNBUFFERED=1

# Command to run the bot
CMD ["python", "botia/bot_discord.py"]
