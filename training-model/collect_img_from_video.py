# collect_img_from_video.py
import os
import cv2
import json
import numpy as np

VIDEO_DIR = './videos'
DATA_DIR = './data'
SEQUENCE_LENGTH = 10  # Sequence length for LSTM classifier

if not os.path.exists(VIDEO_DIR):
    os.makedirs(VIDEO_DIR)
    print(f"\nCreated '{VIDEO_DIR}/' directory.")
    print("Please record 5-10 second video clips for each gesture.")
    print("Name files like 'GestureName_0.mp4', 'GestureName_1.mp4', etc.,")
    print(f"and place them inside the '{VIDEO_DIR}/' folder.")
    print("Once done, run this script again to extract the sequences automatically!")
    exit()

# Scan videos
video_files = [f for f in os.listdir(VIDEO_DIR) if f.lower().endswith(('.mp4', '.mov', '.avi', '.mkv'))]

if not video_files:
    print(f"\nNo video files found inside '{VIDEO_DIR}/'.")
    print("Please record short videos for your signs (e.g. 'Hello_0.mp4', 'Hello_1.mp4'),")
    print(f"place them in '{VIDEO_DIR}/', and run this script again.")
    exit()

# Parse gesture names from video filenames (part before the first underscore or dot)
gesture_groups = {}
for vf in video_files:
    # Handle files with underscore (e.g. Hello_0.mp4) or without (e.g. Hello.mp4)
    base_name = os.path.splitext(vf)[0]
    gesture_name = base_name.split('_')[0].strip()
    if gesture_name not in gesture_groups:
        gesture_groups[gesture_name] = []
    gesture_groups[gesture_name].append(vf)

# Build and save label mappings alphabetically
unique_gestures = sorted(list(gesture_groups.keys()))
labels_dict = {i: name for i, name in enumerate(unique_gestures)}

with open('labels.json', 'w') as f:
    json.dump(labels_dict, f, indent=4)
print(f"\nGenerated labels.json mapping: {labels_dict}")

# Extract frame sequences
for index, gesture_name in labels_dict.items():
    videos = gesture_groups[gesture_name]
    class_dir = os.path.join(DATA_DIR, str(index))
    os.makedirs(class_dir, exist_ok=True)
    
    print(f"\nProcessing gesture class '{gesture_name}' (Class {index}) with {len(videos)} videos...")
    
    global_seq_idx = 0
    for video_file in videos:
        video_path = os.path.join(VIDEO_DIR, video_file)
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            print(f"  Error: Could not open video file {video_file}")
            continue
            
        fps = cap.get(cv2.CAP_PROP_FPS) or 30.0
        step = max(1, int(fps * 0.1))  # Sample frame every 100ms (10 FPS target)
        span = (SEQUENCE_LENGTH - 1) * step + 1
            
        # Read all frames into memory
        frames = []
        while True:
            ret, frame = cap.read()
            if not ret:
                break
            frames.append(frame)
        cap.release()
        
        # Slide window of size SEQUENCE_LENGTH with dynamic step, stride 10
        if len(frames) >= span:
            seq_extracted = 0
            for start in range(0, len(frames) - span + 1, 10):
                seq_dir = os.path.join(class_dir, f"seq_{global_seq_idx}")
                os.makedirs(seq_dir, exist_ok=True)
                for i in range(SEQUENCE_LENGTH):
                    cv2.imwrite(os.path.join(seq_dir, f"{i}.jpg"), frames[start + i * step])
                global_seq_idx += 1
                seq_extracted += 1
            print(f"  Extracted {seq_extracted} sequences of {SEQUENCE_LENGTH} frames (step: {step}) from '{video_file}' (sliding window).")
        else:
            # Video is too short, interpolate/pad to make 1 sequence of SEQUENCE_LENGTH frames
            seq_dir = os.path.join(class_dir, f"seq_{global_seq_idx}")
            os.makedirs(seq_dir, exist_ok=True)
            saved_count = 0
            for i in range(SEQUENCE_LENGTH):
                frame_idx = min(len(frames) - 1, i * step)
                if frame_idx >= 0 and frame_idx < len(frames):
                    cv2.imwrite(os.path.join(seq_dir, f"{saved_count}.jpg"), frames[frame_idx])
                    saved_count += 1
                else:
                    if saved_count > 0:
                        last_frame = cv2.imread(os.path.join(seq_dir, f"{saved_count - 1}.jpg"))
                        cv2.imwrite(os.path.join(seq_dir, f"{saved_count}.jpg"), last_frame)
                    else:
                        black_frame = np.zeros((480, 640, 3), dtype=np.uint8)
                        cv2.imwrite(os.path.join(seq_dir, f"{saved_count}.jpg"), black_frame)
                    saved_count += 1
            global_seq_idx += 1
            print(f"  Extracted 1 padded sequence of {SEQUENCE_LENGTH} frames from short video '{video_file}'.")

print(f"\n=== All sequences extracted successfully! Now run 'python create_dataset.py' ===")
