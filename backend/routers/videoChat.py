from fastapi import APIRouter, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse, StreamingResponse, FileResponse
import pickle
import os
import cv2
import numpy as np

# Suppress noisy MediaPipe C++ logging / warnings
os.environ['GLOG_minloglevel'] = '2'

import mediapipe as mp
from io import BytesIO
from PIL import Image
import logging
from datetime import datetime

# Import modular services
from services.gemini_service import correct_isl_grammar, generate_conversation_summary
from services.translation_service import translate_to_kannada
from services.tts_service import generate_kannada_audio
from services.pdf_service import generate_session_pdf

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load the pre-trained gesture recognition model
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "models", "model.p")

# Add debugging for model path
logger.info(f"Looking for model at: {MODEL_PATH}")
logger.info(f"Model file exists: {os.path.exists(MODEL_PATH)}")

# Also check the current directory structure
current_dir = os.path.dirname(__file__)
parent_dir = os.path.dirname(current_dir)
logger.info(f"Current file directory: {current_dir}")
logger.info(f"Parent directory: {parent_dir}")
logger.info(f"Parent directory contents: {os.listdir(parent_dir) if os.path.exists(parent_dir) else 'Not found'}")

try:
    if os.path.exists(MODEL_PATH):
        with open(MODEL_PATH, 'rb') as f:
            model_dict = pickle.load(f)
            model = model_dict['model']
            logger.info("Model loaded successfully")
    else:
        # Try alternative paths
        alternative_paths = [
            os.path.join(os.path.dirname(__file__), "model.p"),
            os.path.join(os.path.dirname(os.path.dirname(__file__)), "model.p"),
            os.path.join(os.getcwd(), "model.p"),
            os.path.join(os.getcwd(), "static", "models", "model.p"),
            os.path.join(os.getcwd(), "backend", "static", "models", "model.p"),
        ]
        
        model = None
        for alt_path in alternative_paths:
            logger.info(f"Trying alternative path: {alt_path}")
            if os.path.exists(alt_path):
                try:
                    with open(alt_path, 'rb') as f:
                        model_dict = pickle.load(f)
                        model = model_dict['model']
                        logger.info(f"Model loaded successfully from: {alt_path}")
                        MODEL_PATH = alt_path
                        break
                except Exception as e:
                    logger.error(f"Failed to load model from {alt_path}: {e}")
        
        if model is None:
            logger.error(f"Model file not found. Tried paths: {[MODEL_PATH] + alternative_paths}")
            
except Exception as e:
    logger.error(f"Error loading model: {e}")
    model = None

# Class labels for sign language gestures - matching your reference code
labels_dict = {
    0: 'Good', 1: 'Morning', 2: 'Head', 3: 'Headaches', 4: 'And', 
    5: 'Dizziness', 6: 'Two', 7: 'Days', 8: 'Medium', 9: 'Sounds', 
    10: 'No', 11: 'Light', 12: 'Yes', 13: 'Too Much', 14: 'Work', 
    15: 'Sleep', 16: 'Okay', 17: 'Thank You!', 18: 'Severe', 19: 'Bearable'
}

router = APIRouter(
    prefix="/video",
    tags=["video"],
)

# Initialize MediaPipe
mp_hands = mp.solutions.hands
mp_drawing = mp.solutions.drawing_utils
mp_drawing_styles = mp.solutions.drawing_styles

def extract_hand_landmarks(image_rgb):
    """Extract hand landmarks from an image using MediaPipe - matching reference code logic"""
    try:
        with mp_hands.Hands(
            static_image_mode=True,
            min_detection_confidence=0.3,
            max_num_hands=2
        ) as hands:
            results = hands.process(image_rgb)
            
            data_aux = []
            landmarks_data = []
            
            if results.multi_hand_landmarks:
                hands_data = []
                
                for hand_landmarks in results.multi_hand_landmarks:
                    hand_data = []
                    
                    # Convert landmarks to list for JSON serialization
                    hand_landmarks_list = []
                    for landmark in hand_landmarks.landmark:
                        hand_landmarks_list.append({
                            'x': landmark.x,
                            'y': landmark.y,
                            'z': landmark.z
                        })
                    landmarks_data.append(hand_landmarks_list)
                    
                    # First pass: collect all coordinates for this hand
                    hand_x, hand_y = [], []
                    for landmark in hand_landmarks.landmark:
                        hand_x.append(landmark.x)
                        hand_y.append(landmark.y)
                    
                    # Second pass: normalize coordinates relative to hand's bounding box
                    for landmark in hand_landmarks.landmark:
                        hand_data.append(landmark.x - min(hand_x))
                        hand_data.append(landmark.y - min(hand_y))
                    
                    hands_data.append(hand_data)
                
                # Handle different numbers of detected hands
                if len(hands_data) == 2:
                    # Two hands detected - concatenate both hands' data
                    data_aux.extend(hands_data[0])
                    data_aux.extend(hands_data[1])
                elif len(hands_data) == 1:
                    # One hand detected - pad with zeros for the second hand
                    data_aux.extend(hands_data[0])
                    data_aux.extend([0] * len(hands_data[0]))  # 42 zeros for missing hand
                
                logger.info(f"Extracted {len(data_aux)} features from {len(hands_data)} hands")
                return data_aux if len(data_aux) > 0 else None, landmarks_data
            
            return None, []
                
    except Exception as e:
        logger.error(f"Error in extract_hand_landmarks: {e}")
        return None, []

@router.post("/predict-gesture")
async def predict_gesture(frame: UploadFile = File(...)):
    """Predict gesture from uploaded frame"""
    try:
        logger.info("Received prediction request")
        
        if not model:
            logger.error("Model not loaded")
            raise HTTPException(status_code=500, detail="Model not loaded")
        
        # Validate file type
        if not frame.content_type.startswith('image/'):
            logger.error(f"Invalid file type: {frame.content_type}")
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read the uploaded image
        contents = await frame.read()
        logger.info(f"Read {len(contents)} bytes from uploaded file")
        
        # Convert to PIL Image and then to OpenCV format
        image = Image.open(BytesIO(contents))
        logger.info(f"Image opened successfully: {image.size}, mode: {image.mode}")
        
        # Convert to RGB if necessary
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        # Convert PIL to numpy array (RGB format for MediaPipe)
        image_rgb = np.array(image)
        logger.info(f"Image array shape: {image_rgb.shape}")
        
        # Extract hand landmarks
        logger.info("Extracting hand landmarks...")
        landmarks, landmarks_data = extract_hand_landmarks(image_rgb)
        
        if landmarks is None or len(landmarks) == 0:
            logger.info("No valid hand landmarks detected")
            return JSONResponse(content={
                "gesture": "No gesture detected",
                "confidence": 0.0,
                "landmarks": []
            })
        
        logger.info(f"Extracted {len(landmarks)} landmark features")
        
        # Make prediction
        try:
            prediction = model.predict([np.asarray(landmarks)])
            predicted_class = int(prediction[0])
            logger.info(f"Predicted class: {predicted_class}")
            
            # Get confidence if available
            try:
                probabilities = model.predict_proba([np.asarray(landmarks)])
                confidence = float(np.max(probabilities))
                logger.info(f"Confidence: {confidence}")
            except Exception as conf_e:
                logger.warning(f"Could not get confidence: {conf_e}")
                confidence = 1.0
            
            # Get gesture label
            gesture_label = labels_dict.get(predicted_class, "Unknown")
            logger.info(f"Gesture label: {gesture_label}")
            
            return JSONResponse(content={
                "gesture": gesture_label,
                "confidence": confidence,
                "class_id": predicted_class,
                "landmarks": landmarks_data
            })
            
        except Exception as pred_e:
            logger.error(f"Prediction error: {pred_e}")
            raise HTTPException(status_code=500, detail=f"Prediction failed: {str(pred_e)}")
        
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in predict_gesture: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.get("/gestures")
async def get_available_gestures():
    """Get list of available gesture classes"""
    try:
        return JSONResponse(content={
            "gestures": labels_dict,
            "total_classes": len(labels_dict)
        })
    except Exception as e:
        logger.error(f"Error getting gestures: {e}")
        raise HTTPException(status_code=500, detail="Failed to get gesture list")

@router.get("/health")
async def health_check():
    """Health check endpoint to verify model status"""
    return JSONResponse(content={
        "status": "healthy" if model else "model_not_loaded",
        "model_loaded": model is not None,
        "available_gestures": len(labels_dict),
        "model_path": MODEL_PATH,
        "model_exists": os.path.exists(MODEL_PATH) if MODEL_PATH else False
    })

@router.post("/correct-grammar")
async def correct_grammar_endpoint(payload: dict):
    """Correct raw sign language text using Gemini"""
    try:
        raw_text = payload.get("raw_text", "")
        corrected = correct_isl_grammar(raw_text)
        return {"raw_text": raw_text, "corrected_text": corrected}
    except Exception as e:
        logger.error(f"Error in grammar correction route: {e}")
        return {"raw_text": payload.get("raw_text", ""), "corrected_text": payload.get("raw_text", "")}

@router.post("/translate-kannada")
async def translate_kannada_endpoint(payload: dict):
    """Translate text to Kannada using Gemini"""
    try:
        text = payload.get("text", "")
        translated = translate_to_kannada(text)
        return {"text": text, "translated_text": translated}
    except Exception as e:
        logger.error(f"Error in Kannada translation route: {e}")
        return {"text": payload.get("text", ""), "translated_text": ""}

@router.get("/tts")
async def tts_endpoint(text: str):
    """Generate audio files for Kannada text using gTTS and return as file"""
    try:
        if not text or not text.strip():
            raise HTTPException(status_code=400, detail="Text parameter is required")
        
        file_path = generate_kannada_audio(text)
        return FileResponse(
            file_path,
            media_type="audio/mpeg",
            filename=os.path.basename(file_path)
        )
    except Exception as e:
        logger.error(f"Error in TTS route: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to generate TTS: {str(e)}")

@router.post("/export-pdf")
async def export_pdf_endpoint(payload: dict):
    """Export conversation session as a beautifully styled PDF report"""
    try:
        chat_history = payload.get("chat_history", [])
        session_id = payload.get("session_id", "SESSION-" + datetime.now().strftime("%Y%m%d%H%M%S"))
        
        # Build prompt input conversation
        conversation_lines = []
        for entry in chat_history:
            speaker = str(entry.get("speaker", "deaf")).upper()
            raw = entry.get("raw_text") or entry.get("rawText") or ""
            corrected = entry.get("corrected_text") or entry.get("correctedText") or ""
            kannada = entry.get("kannada_text") or entry.get("kannadaText") or entry.get("translated_text") or entry.get("translatedText") or ""
            timestamp = entry.get("timestamp") or entry.get("time") or ""
            
            line = f"[{timestamp}] {speaker}:"
            if raw:
                line += f"\n  Raw: {raw}"
            if corrected:
                line += f"\n  Corrected: {corrected}"
            if kannada:
                line += f"\n  Kannada: {kannada}"
            conversation_lines.append(line)
            
        conversation_text = "\n\n".join(conversation_lines)
        
        # Generate summary using Gemini
        summary = ""
        if conversation_text.strip():
            summary = generate_conversation_summary(conversation_text)
            
        pdf_bytes = generate_session_pdf(chat_history, session_id, summary)
        
        return StreamingResponse(
            BytesIO(pdf_bytes),
            media_type="application/pdf",
            headers={"Content-Disposition": f"attachment; filename=signai_session_{session_id}.pdf"}
        )
    except Exception as e:
        logger.error(f"Error exporting PDF: {e}")
        raise HTTPException(status_code=500, detail=f"Failed to export PDF: {str(e)}")

