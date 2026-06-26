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

try:
    import torch
    import torch.nn as nn
    import torch.nn.functional as F

    # Define the PyTorch LSTM network model structure
    class SignLanguageLSTM(nn.Module):
        def __init__(self, input_size=84, hidden_size=128, num_layers=2, num_classes=60):
            super(SignLanguageLSTM, self).__init__()
            self.hidden_size = hidden_size
            self.num_layers = num_layers
            self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True, dropout=0.2 if num_layers > 1 else 0.0)
            self.fc = nn.Linear(hidden_size, num_classes)
            
        def forward(self, x):
            # Input shape: [batch, sequence_length, input_size]
            out, _ = self.lstm(x)
            # Classification based on output of the last time step
            out = self.fc(out[:, -1, :])
            return out
    TORCH_AVAILABLE = True
except ImportError:
    TORCH_AVAILABLE = False

# Define alternative loading paths for PyTorch and Random Forest models
BASE_MODELS_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "models")
PT_MODEL_PATH = os.path.join(BASE_MODELS_DIR, "dl_model.pth")
SCALER_PATH = os.path.join(BASE_MODELS_DIR, "scaler.pickle")
RF_MODEL_PATH = os.path.join(BASE_MODELS_DIR, "model.p")

# Class labels for sign language gestures - matching your reference code
labels_dict = {
    0: 'College', 1: 'Doctor', 2: 'Food', 3: 'Friend', 4: 'Go', 
    5: 'Good Morning', 6: 'Good Night', 7: 'Good', 8: 'Happy', 9: 'He', 
    10: 'Hello', 11: 'Help', 12: 'Home', 13: 'Hospital', 14: 'I', 
    15: 'Namaste', 16: 'No', 17: 'She', 18: 'Sleep', 19: 'Sorry', 
    20: 'Thank You', 21: 'Today', 22: 'Want', 23: 'Water', 24: 'Welcome', 
    25: 'What', 26: 'When', 27: 'Who', 28: 'Yes', 29: 'You'
}

# Dynamically load labels.json if it is placed in the models directory
import json
LABELS_PATH = os.path.join(BASE_MODELS_DIR, "labels.json")
if os.path.exists(LABELS_PATH):
    try:
        with open(LABELS_PATH, 'r') as lf:
            loaded_labels = json.load(lf)
            # Convert JSON string keys to integers
            labels_dict = {int(k): v for k, v in loaded_labels.items()}
            logger.info(f"Dynamically loaded labels.json with {len(labels_dict)} class mappings")
    except Exception as lf_err:
        logger.error(f"Failed to load dynamic labels.json: {lf_err}")

model = None
model_type = None
scaler = None

# Attempt to load PyTorch model first
if TORCH_AVAILABLE and os.path.exists(PT_MODEL_PATH) and os.path.exists(SCALER_PATH):
    try:
        logger.info(f"Attempting to load PyTorch model from: {PT_MODEL_PATH}")
        # Build neural net model matching labels count
        num_classes = len(labels_dict)
        model = SignLanguageLSTM(input_size=84, hidden_size=128, num_layers=2, num_classes=num_classes)
        model.load_state_dict(torch.load(PT_MODEL_PATH, map_location=torch.device('cpu'), weights_only=False))
        model.eval()
        
        with open(SCALER_PATH, 'rb') as sf:
            scaler = pickle.load(sf)
            
        model_type = "pytorch"
        logger.info("Successfully loaded PyTorch classifier and StandardScaler")
    except Exception as pt_err:
        logger.error(f"Failed to load PyTorch model: {pt_err}")
        model = None

# Fall back to Random Forest model
if model is None:
    alternative_rf_paths = [
        RF_MODEL_PATH,
        os.path.join(os.path.dirname(__file__), "model.p"),
        os.path.join(os.path.dirname(os.path.dirname(__file__)), "model.p"),
        os.path.join(os.getcwd(), "model.p"),
    ]
    
    for alt_path in alternative_rf_paths:
        if os.path.exists(alt_path):
            try:
                logger.info(f"Attempting to load Random Forest from: {alt_path}")
                with open(alt_path, 'rb') as f:
                    model_dict = pickle.load(f)
                    model = model_dict['model']
                    model_type = "rf"
                    logger.info("Successfully loaded Random Forest classifier")
                    break
            except Exception as rf_err:
                logger.error(f"Failed to load RF model from {alt_path}: {rf_err}")

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

# Rolling buffer of landmarks for real-time sliding window predictions (Option B)
SEQUENCE_LENGTH = 10
landmark_buffer = []
active_hand_flags = []
last_request_time = 0.0

@router.post("/predict-gesture")
async def predict_gesture(frame: UploadFile = File(...)):
    """Predict gesture from uploaded frame using rolling sequence buffer (Option B)"""
    global landmark_buffer, active_hand_flags, last_request_time
    import time
    try:
        logger.info("Received prediction request")
        
        if not model:
            logger.error("Model not loaded")
            raise HTTPException(status_code=500, detail="Model not loaded")
        
        # Reset buffer if there is a gap of > 2.0s between requests (indicates camera restart/tab switch)
        current_time = time.time()
        if current_time - last_request_time > 2.0:
            landmark_buffer = []
            active_hand_flags = []
            logger.info("Cleared landmark buffer due to inactivity (>2.0s)")
        last_request_time = current_time
        
        # Validate file type
        if not frame.content_type.startswith('image/'):
            logger.error(f"Invalid file type: {frame.content_type}")
            raise HTTPException(status_code=400, detail="File must be an image")
        
        # Read the uploaded image
        contents = await frame.read()
        image = Image.open(BytesIO(contents))
        if image.mode != 'RGB':
            image = image.convert('RGB')
        
        image_rgb = np.array(image)
        
        # Extract hand landmarks
        landmarks, landmarks_data = extract_hand_landmarks(image_rgb)
        
        # Append landmarks and active flag to the rolling sequence buffer
        if landmarks is not None and len(landmarks) == 84:
            landmark_buffer.append(landmarks)
            active_hand_flags.append(True)
        else:
            active_hand_flags.append(False)
            # If hands are not detected in the current frame, carry over the last frame's landmarks
            # to maintain continuity and prevent gaps. If buffer is empty, pad with zeros.
            if len(landmark_buffer) > 0:
                landmark_buffer.append(landmark_buffer[-1])
            else:
                landmark_buffer.append([0] * 84)
                
        # GHOST FILTER: Reset buffer and return 'No gesture detected' if hands have been missing
        # for 2 or more consecutive frames. This prevents predicting stale hand positions when hands go out of view.
        if len(active_hand_flags) >= 2 and active_hand_flags[-2:] == [False, False]:
            landmark_buffer = []
            active_hand_flags = []
            logger.info("Hands out of frame (2 consecutive missing). Resetting landmark buffer.")
            return JSONResponse(content={
                "gesture": "No gesture detected",
                "confidence": 0.0,
                "landmarks": landmarks_data or []
            })
            
        # Keep buffer length at exactly SEQUENCE_LENGTH frames
        if len(landmark_buffer) > SEQUENCE_LENGTH:
            landmark_buffer.pop(0)
            active_hand_flags.pop(0)
            
        # Return buffering message until we have SEQUENCE_LENGTH frames
        if len(landmark_buffer) < SEQUENCE_LENGTH:
            logger.info(f"Landmark buffer filling: {len(landmark_buffer)}/{SEQUENCE_LENGTH} frames")
            return JSONResponse(content={
                "gesture": "Buffering...",
                "confidence": 0.0,
                "landmarks": landmarks_data or []
            })
            
        # If hands are active in fewer than 5 of the 10 frames (~50% of the sequence),
        # return 'No gesture detected' instead of letting the model guess on static/empty frames.
        if sum(active_hand_flags) < 5:
            logger.info(f"Hands inactive in sequence ({sum(active_hand_flags)}/{SEQUENCE_LENGTH} frames). Ignoring prediction.")
            return JSONResponse(content={
                "gesture": "No gesture detected",
                "confidence": 0.0,
                "landmarks": landmarks_data or []
            })
            
        # Make sequence prediction
        try:
            if model_type == "pytorch":
                if scaler is None:
                    raise Exception("Scaler not loaded for PyTorch LSTM classifier")
                
                # Transform landmarks using scaler (fit on 2D)
                # landmark_buffer shape is [30, 84]. Fit scaler, transform it, then reshape to [1, 30, 84]
                landmarks_scaled = scaler.transform(landmark_buffer)
                input_tensor = torch.FloatTensor([landmarks_scaled])
                
                with torch.no_grad():
                    prediction_logits = model(input_tensor)
                    prediction_probs = F.softmax(prediction_logits, dim=1)
                    predicted_class = torch.argmax(prediction_logits, dim=1).item()
                    confidence = float(prediction_probs[0][predicted_class].item())
            else:
                # Fallback prediction using Random Forest (trained on flattened sequences)
                flat_landmarks = np.asarray(landmark_buffer).flatten()
                prediction = model.predict([flat_landmarks])
                predicted_class = int(prediction[0])
                
                try:
                    probabilities = model.predict_proba([flat_landmarks])
                    confidence = float(np.max(probabilities))
                except Exception:
                    confidence = 1.0
            
            gesture_label = labels_dict.get(predicted_class, "Unknown")
            logger.info(f"LSTM Prediction success. Predicted: {gesture_label} (Class: {predicted_class}, Conf: {confidence:.2f})")
            
            return JSONResponse(content={
                "gesture": gesture_label,
                "confidence": confidence,
                "class_id": predicted_class,
                "landmarks": landmarks_data or []
            })
            
        except Exception as pred_e:
            logger.error(f"Prediction execution failed: {pred_e}")
            raise HTTPException(status_code=500, detail=f"Prediction execution failed: {str(pred_e)}")
            
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Unexpected error in predict_gesture: {e}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")

@router.post("/predict-gesture-video")
async def predict_gesture_video(video: UploadFile = File(...)):
    """Predict gesture sequence from uploaded video clip (Option A)"""
    import uuid
    import shutil
    temp_path = None
    try:
        logger.info("Received prediction request from video clip")
        if not model:
            logger.error("Model not loaded")
            raise HTTPException(status_code=500, detail="Model not loaded")
            
        # Create temp folder inside workspace static dir if not exists
        temp_dir = os.path.join(os.path.dirname(os.path.dirname(__file__)), "static", "temp")
        os.makedirs(temp_dir, exist_ok=True)
        
        # Save uploaded video file
        unique_filename = f"video_{uuid.uuid4().hex}.webm"
        temp_path = os.path.join(temp_dir, unique_filename)
        
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(video.file, buffer)
            
        # Open video and extract 30 frames
        cap = cv2.VideoCapture(temp_path)
        if not cap.isOpened():
            raise Exception("Failed to open uploaded video stream.")
            
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        if total_frames <= 0:
            raise Exception("Uploaded video contains no frames.")
            
        # Calculate 30 frame indices to sample evenly
        SEQUENCE_LENGTH = 30
        if total_frames >= SEQUENCE_LENGTH:
            sampled_indices = set(np.linspace(0, total_frames - 1, SEQUENCE_LENGTH, dtype=int))
        else:
            sampled_indices = set(range(total_frames))
            
        sequence_landmarks = []
        last_valid_landmarks = [0] * 84
        
        frame_idx = 0
        saved_count = 0
        
        while saved_count < SEQUENCE_LENGTH:
            ret, frame = cap.read()
            if not ret:
                break
                
            if frame_idx in sampled_indices and saved_count < SEQUENCE_LENGTH:
                # Convert frame to RGB for MediaPipe
                frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                landmarks_data, _ = extract_hand_landmarks(frame_rgb)
                
                if landmarks_data is not None:
                    last_valid_landmarks = landmarks_data
                    sequence_landmarks.append(landmarks_data)
                else:
                    # Hand not detected, fall back to last valid frame landmarks
                    sequence_landmarks.append(last_valid_landmarks)
                saved_count += 1
            frame_idx += 1
            
        cap.release()
        
        # Pad sequence if total frames read was less than SEQUENCE_LENGTH
        while len(sequence_landmarks) < SEQUENCE_LENGTH:
            sequence_landmarks.append(last_valid_landmarks)
            
        # Clean up temp file immediately
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception as rm_e:
                logger.warning(f"Failed to delete temp video file {temp_path}: {rm_e}")
            
        # Now run LSTM model prediction
        try:
            if model_type == "pytorch":
                if scaler is None:
                    raise Exception("Scaler not loaded for PyTorch LSTM classifier")
                
                # Transform landmarks using scaler fit on 2D
                # Reshape sequence_landmarks [30, 84] to 2D for transform, then back to [1, 30, 84]
                sequence_landmarks_scaled_2d = scaler.transform(sequence_landmarks)
                input_tensor = torch.FloatTensor([sequence_landmarks_scaled_2d])
                
                with torch.no_grad():
                    prediction_logits = model(input_tensor)
                    prediction_probs = F.softmax(prediction_logits, dim=1)
                    predicted_class = torch.argmax(prediction_logits, dim=1).item()
                    confidence = float(prediction_probs[0][predicted_class].item())
            else:
                # Fallback prediction using Random Forest (trained on flattened sequences)
                flat_landmarks = np.asarray(sequence_landmarks).flatten()
                prediction = model.predict([flat_landmarks])
                predicted_class = int(prediction[0])
                
                try:
                    probabilities = model.predict_proba([flat_landmarks])
                    confidence = float(np.max(probabilities))
                except Exception:
                    confidence = 1.0
                    
            gesture_label = labels_dict.get(predicted_class, "Unknown")
            logger.info(f"LSTM Prediction success. Predicted: {gesture_label} (Class: {predicted_class}, Conf: {confidence:.2f})")
            
            return JSONResponse(content={
                "gesture": gesture_label,
                "confidence": confidence,
                "class_id": predicted_class
            })
            
        except Exception as pred_e:
            logger.error(f"Prediction execution failed: {pred_e}")
            raise HTTPException(status_code=500, detail=f"Prediction execution failed: {str(pred_e)}")
            
    except Exception as e:
        logger.error(f"Error in predict_gesture_video: {e}", exc_info=True)
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass
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


@router.post("/contribute-gesture")
async def contribute_gesture_endpoint(
    label: str,
    video: UploadFile = File(...)
):
    """
    Accept an uploaded video contribution for custom gesture training, extract frames/landmarks,
    save the frames to the training dataset directory, and return skeleton coordinates for frontend preview.
    """
    import uuid
    import shutil
    import json
    
    temp_path = None
    try:
        logger.info(f"Received contribution for label: '{label}'")
        
        # 1. Resolve paths
        backend_dir = os.path.dirname(os.path.dirname(__file__))
        training_model_dir = os.path.abspath(os.path.join(backend_dir, "..", "training-model"))
        training_data_dir = os.path.join(training_model_dir, "data")
        
        # Verify training data dir exists
        os.makedirs(training_data_dir, exist_ok=True)
        
        training_labels_path = os.path.join(training_model_dir, "labels.json")
        backend_labels_path = os.path.join(backend_dir, "static", "models", "labels.json")
        
        # 2. Get or create class ID for this label
        class_id = None
        global labels_dict
        
        # Read labels from training model if exists
        current_labels = {}
        if os.path.exists(training_labels_path):
            try:
                with open(training_labels_path, 'r') as lf:
                    current_labels = json.load(lf)
            except Exception as e:
                logger.error(f"Failed to read labels file: {e}")
        
        # Search for existing label (case-insensitive)
        for cid, val in current_labels.items():
            if val.strip().lower() == label.strip().lower():
                class_id = str(cid)
                # Keep original case from labels mapping
                label = val
                break
                
        if class_id is None:
            # Create a new class ID
            if current_labels:
                numeric_keys = [int(k) for k in current_labels.keys() if k.isdigit()]
                next_id = max(numeric_keys) + 1 if numeric_keys else 0
            else:
                next_id = 0
            class_id = str(next_id)
            current_labels[class_id] = label
            
            # Save labels back to both training-model and backend locations
            for path in [training_labels_path, backend_labels_path]:
                try:
                    os.makedirs(os.path.dirname(path), exist_ok=True)
                    with open(path, 'w') as lf:
                        json.dump(current_labels, lf, indent=4)
                    logger.info(f"Updated labels file at {path} with new label '{label}' (ID: {class_id})")
                except Exception as lf_e:
                    logger.error(f"Error saving updated labels to {path}: {lf_e}")
            
            # Dynamically update the active in-memory labels dictionary
            labels_dict[int(class_id)] = label
            
        # 3. Create target directory for new sequence
        class_dir = os.path.join(training_data_dir, class_id)
        os.makedirs(class_dir, exist_ok=True)
        
        # Find next sequence index
        existing_seqs = [d for d in os.listdir(class_dir) if d.startswith("seq_") and os.path.isdir(os.path.join(class_dir, d))]
        seq_indices = []
        for d in existing_seqs:
            try:
                seq_indices.append(int(d.split("_")[1]))
            except ValueError:
                pass
        next_seq_idx = max(seq_indices) + 1 if seq_indices else 0
        new_seq_dir = os.path.join(class_dir, f"seq_{next_seq_idx}")
        os.makedirs(new_seq_dir, exist_ok=True)
        
        # 4. Save uploaded video to temp file
        temp_dir = os.path.join(backend_dir, "static", "temp")
        os.makedirs(temp_dir, exist_ok=True)
        unique_filename = f"contrib_{uuid.uuid4().hex}.webm"
        temp_path = os.path.join(temp_dir, unique_filename)
        
        with open(temp_path, "wb") as buffer:
            shutil.copyfileobj(video.file, buffer)
            
        # 5. Open video stream and sample exactly 10 frames
        cap = cv2.VideoCapture(temp_path)
        if not cap.isOpened():
            raise Exception("Failed to open uploaded video stream.")
            
        total_frames = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        if total_frames <= 0:
            raise Exception("Uploaded video contains no frames.")
            
        SEQUENCE_LENGTH = 10
        if total_frames >= SEQUENCE_LENGTH:
            sampled_indices = np.linspace(0, total_frames - 1, SEQUENCE_LENGTH, dtype=int).tolist()
        else:
            # Duplicate last index if video is too short
            sampled_indices = list(range(total_frames))
            while len(sampled_indices) < SEQUENCE_LENGTH:
                sampled_indices.append(total_frames - 1)
                
        frames_to_save = []
        frame_idx = 0
        saved_count = 0
        
        while len(frames_to_save) < SEQUENCE_LENGTH:
            ret, frame = cap.read()
            if not ret:
                break
            if frame_idx in sampled_indices:
                frames_to_save.append(frame)
            frame_idx += 1
            
        cap.release()
        
        # Ensure we have exactly SEQUENCE_LENGTH frames
        while len(frames_to_save) < SEQUENCE_LENGTH and len(frames_to_save) > 0:
            frames_to_save.append(frames_to_save[-1])
            
        if not frames_to_save:
            raise Exception("Failed to read frames from video.")
            
        # 6. Process frames, extract coordinates for skeleton, and save images
        skeleton_playback = []  # Contains [ [{x, y, z}, ...], [] ] landmark arrays for each frame
        hands_detected_count = 0
        
        for idx, frame in enumerate(frames_to_save):
            # Save frame image to the new sequence directory
            frame_path = os.path.join(new_seq_dir, f"{idx}.jpg")
            cv2.imwrite(frame_path, frame)
            
            # Extract landmarks for skeleton playback representation
            frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
            _, landmarks_data = extract_hand_landmarks(frame_rgb)
            
            if landmarks_data:
                hands_detected_count += 1
                skeleton_playback.append(landmarks_data)
            else:
                # Return empty list if no hand landmarks detected in this frame
                skeleton_playback.append([])
                
        # Clean up temp file
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception as rm_e:
                logger.warning(f"Failed to delete temp video file {temp_path}: {rm_e}")
                
        return JSONResponse(content={
            "success": True,
            "message": f"Successfully ingested gesture video. Added sequence 'seq_{next_seq_idx}' under class '{label}' (ID: {class_id}).",
            "class_id": class_id,
            "label": label,
            "sequence_index": next_seq_idx,
            "total_frames_saved": len(frames_to_save),
            "hands_detected_frames": hands_detected_count,
            "skeleton_data": skeleton_playback
        })
        
    except Exception as e:
        logger.error(f"Error in contribute_gesture_endpoint: {e}", exc_info=True)
        if temp_path and os.path.exists(temp_path):
            try:
                os.remove(temp_path)
            except Exception:
                pass
        raise HTTPException(status_code=500, detail=f"Failed to process contributed video: {str(e)}")

