from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from tensorflow.keras.models import load_model
from tensorflow.keras.preprocessing.image import img_to_array
from PIL import Image
import numpy as np
import io
import os

app = FastAPI(title="Optic API", description="API for Optic Content Moderation")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development, allow all. In production, specify domain.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load Model
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, 'meu_modelo.h5')
model = None

try:
    if os.path.exists(MODEL_PATH):
        model = load_model(MODEL_PATH)
        print(f"Model loaded from {MODEL_PATH}")
    else:
        print(f"WARNING: Model not found at {MODEL_PATH}")
except Exception as e:
    print(f"Error loading model: {e}")

@app.get("/")
async def root():
    return {"message": "Optic API is running"}

def prepare_image(image_bytes):
    try:
        img = Image.open(io.BytesIO(image_bytes))
        img = img.resize((64, 64))
        img = img.convert('RGB')
        img = img_to_array(img)
        img = np.expand_dims(img, axis=0)
        img /= 255.0  # Normalize
        return img
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image: {e}")

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    if model is None:
        raise HTTPException(status_code=503, detail="Model not loaded")
    
    # Read and process image
    contents = await file.read()
    processed_image = prepare_image(contents)
    
    # Predict
    prediction = model.predict(processed_image)[0][0]
    
    # Result
    is_licit = prediction > 0.5
    confidence = float(prediction) if is_licit else float(1 - prediction)
    label = "Licit" if is_licit else "Illicit"
    
    return {
        "filename": file.filename,
        "label": label,
        "is_licit": bool(is_licit),
        "confidence": confidence,
        "raw_score": float(prediction)
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
