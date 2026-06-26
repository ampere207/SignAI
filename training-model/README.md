# SignAI Gesture Model Training Pipeline

Follow these steps to train your gesture classification models from scratch.

## 1. Setup
Install the necessary python dependencies:
```bash
pip install -r requirements.txt
```

## 2. Collect Images (Option A: Live Webcam)
If your Python environment can access your physical webcam, run `collect_img.py`:
```bash
python collect_img.py
```
- It will prompt you to enter the list of sign/gesture names (e.g. `Good, Morning, Yes, No`).
- The camera window will display the name of the gesture you are currently recording.
- Position your hand in the frame and press **Q** to start the automatic 200-frame image capture loop for each gesture.

## 2.5 Collect Images (Option B: From Video Recordings - Recommended)
Record a short video clip for each sign containing **multiple repeated executions** of the sign:
1. Create a `videos/` folder:
   ```bash
   mkdir videos
   ```
2. Record a single 10-15 second video for each gesture, rename it with the gesture word (e.g., `Hello.mp4`, `Yes.mp4`, `No.mp4`), and place it in the `videos/` folder. In the video, **repeat the gesture/word 4-5 times** continuously.
3. Run the frame extractor script:
   ```bash
   python collect_img_from_video.py
   ```
   This will auto-generate `labels.json` and extract overlapping sequences of 30 consecutive frames from the videos using a sliding window into `./data/`.

## 3. Prepare Dataset
Process all sequence images to extract MediaPipe coordinates and split the data (80% train, 20% validation).
```bash
python create_dataset.py
```
This generates `data.pickle` containing sequence tensors of shape `[N, 30, 84]`.

## 4. Train Model
Train both a Scikit-Learn **Random Forest Classifier** (on flattened sequences) and a PyTorch **LSTM (Long Short-Term Memory) Network**.
```bash
python train_classifier.py
```
This script evaluates both models and saves:
- `model.p` (Random Forest)
- `dl_model.pth` and `scaler.pickle` (PyTorch LSTM)

## 5. Deploy to Backend
Choose your preferred model format and copy the files to the backend models folder at `backend/static/models/`:

### Option A: PyTorch LSTM (Highly Recommended for real-time streaming)
Copy the following files into `backend/static/models/`:
- `dl_model.pth`
- `scaler.pickle`
- `labels.json`

*(Make sure you run `pip install torch` in your backend virtual environment).*

### Option B: Random Forest
Copy the following files into `backend/static/models/`:
- `model.p`
- `labels.json`

## 6. Restart Server
Restart your FastAPI backend server:
```bash
uvicorn main:app --port 8000
```
The backend automatically detects the model files and dynamically loads the class mappings from `labels.json` without needing any code edits!
