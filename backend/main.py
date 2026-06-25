from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import tensorflow as tf
from PIL import Image
import numpy as np
import io
import json
import os

app = FastAPI()

# CORS allow karo — React Native se request aayegi
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─── Model load ───────────────────────────────────────────────────────────────
# best_model.h5 same folder mein hona chahiye (backend/)
# Agar .keras bhi hai toh wo old model hai — use mat karo
MODEL_PATH = os.path.join(os.path.dirname(__file__), "best_model.h5")
if not os.path.exists(MODEL_PATH):
    # Fallback: try .keras
    MODEL_PATH = os.path.join(os.path.dirname(__file__), "crop_disease_model.keras")

model = tf.keras.models.load_model(MODEL_PATH)

# ─── Class names load ─────────────────────────────────────────────────────────
# class_names.json project root mein hai (backend ke ek level upar)
CLASS_NAMES_PATH = os.path.join(os.path.dirname(__file__), "..", "class_names.json")
with open(CLASS_NAMES_PATH, "r") as f:
    class_names = json.load(f)

print(f"✅ Model loaded: {MODEL_PATH}")
print(f"✅ Classes: {class_names}")

# ─── Helper: label se crop aur disease alag karo ─────────────────────────────
def parse_label(label: str):
    """
    'banana_yb_sigatoka' → crop='Banana', disease='Yb Sigatoka'
    'groundnut_healthy'  → crop='Groundnut', disease='Healthy'
    """
    parts = label.split("_", 1)  # sirf pehle underscore pe split
    crop = parts[0].capitalize() if parts else label
    disease_raw = parts[1] if len(parts) > 1 else "unknown"
    # underscore ko space mein badlo, title case karo
    disease = disease_raw.replace("_", " ").title()
    return crop, disease


# ─── /predict endpoint ────────────────────────────────────────────────────────
@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    # 1. Image padho aur preprocess karo
    contents = await file.read()
    img = Image.open(io.BytesIO(contents)).convert("RGB").resize((224, 224))
    img_array = np.array(img, dtype=np.float32) / 255.0   # normalize [0,1]
    img_array = np.expand_dims(img_array, axis=0)           # (1, 224, 224, 3)

    # 2. Model se predict karo
    preds = model.predict(img_array, verbose=0)             # shape: (1, 15)
    idx = int(np.argmax(preds[0]))
    confidence = float(preds[0][idx])
    label = class_names[idx]

    # 3. Crop aur disease alag karo
    crop, disease = parse_label(label)
    is_healthy = "healthy" in label.lower()

    # 4. Top-3 results bhi bhejo (optional, frontend ke liye)
    top_indices = np.argsort(preds[0])[::-1][:3]
    all_results = [
        {"name": class_names[i].replace("_", " ").title(), "probability": float(preds[0][i])}
        for i in top_indices
    ]

    return {
        "label": label,               # raw: "banana_yb_sigatoka"
        "crop": crop,                 # "Banana"
        "disease": disease,           # "Yb Sigatoka"
        "confidence": confidence,     # 0.94 (float)
        "isHealthy": is_healthy,      # True/False
        "allResults": all_results     # top-3 predictions
    }


# ─── Health check ─────────────────────────────────────────────────────────────
@app.get("/")
def health():
    return {"status": "ok", "classes": len(class_names)}