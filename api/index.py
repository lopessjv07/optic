from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from PIL import Image
import numpy as np
import io
import os
import httpx

app = FastAPI(title="Optic API", description="API for Optic Content Moderation")

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global cache for model
_model = None
_interpreter = None

def get_model():
    """Lazy-load model from external URL or local path."""
    global _model, _interpreter
    
    if _interpreter is not None:
        return _interpreter
    
    model_url = os.environ.get("MODEL_URL")
    
    if not model_url:
        raise HTTPException(status_code=503, detail="MODEL_URL not configured")
    
    try:
        # Download model to /tmp (Vercel writable directory)
        tmp_path = "/tmp/model.tflite"
        
        if not os.path.exists(tmp_path):
            print(f"Downloading model from {model_url}...")
            with httpx.Client(timeout=60.0) as client:
                response = client.get(model_url)
                response.raise_for_status()
                with open(tmp_path, "wb") as f:
                    f.write(response.content)
            print("Model downloaded successfully")
        
        # Load TFLite model
        import tflite_runtime.interpreter as tflite
        _interpreter = tflite.Interpreter(model_path=tmp_path)
        _interpreter.allocate_tensors()
        
        return _interpreter
    
    except Exception as e:
        print(f"Error loading model: {e}")
        raise HTTPException(status_code=503, detail=f"Failed to load model: {str(e)}")


def prepare_image(image_bytes):
    """Process image for model input."""
    try:
        img = Image.open(io.BytesIO(image_bytes))
        img = img.resize((64, 64))
        img = img.convert('RGB')
        img_array = np.array(img, dtype=np.float32)
        img_array = np.expand_dims(img_array, axis=0)
        img_array /= 255.0  # Normalize
        return img_array
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid image: {e}")


@app.get("/")
async def root():
    return {"message": "Optic API is running"}


@app.get("/api/health")
@app.get("/health")
async def health():
    return {"status": "ok"}


@app.post("/api/predict")
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # Lazy load model
    interpreter = get_model()
    
    # Read and process image
    contents = await file.read()
    processed_image = prepare_image(contents)
    
    # Get input/output details
    input_details = interpreter.get_input_details()
    output_details = interpreter.get_output_details()
    
    # Set input tensor
    interpreter.set_tensor(input_details[0]['index'], processed_image)
    
    # Run inference
    interpreter.invoke()
    
    # Get prediction
    prediction = interpreter.get_tensor(output_details[0]['index'])[0][0]
    
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
