# create_dataset.py
import os
import pickle
import mediapipe as mp
import cv2
import numpy as np
from sklearn.model_selection import train_test_split

mp_hands = mp.solutions.hands
hands = mp_hands.Hands(static_image_mode=True, min_detection_confidence=0.3, max_num_hands=2)

DATA_DIR = './data'
SEQUENCE_LENGTH = 10  # Sequence length for LSTM classifier

def process_images(data_dir):
    data = []
    labels = []

    if not os.path.exists(data_dir):
        print(f"Error: Data directory '{data_dir}' not found. Please run collect_img_from_video.py first.")
        return None, None

    for class_id_str in sorted(os.listdir(data_dir)):
        class_dir = os.path.join(data_dir, class_id_str)
        if not os.path.isdir(class_dir):
            continue

        print(f"Extracting landmarks for class ID: {class_id_str}...")
        
        # Loop through sequence directories (e.g., seq_0, seq_1, ...)
        for seq_dir_name in sorted(os.listdir(class_dir)):
            seq_dir = os.path.join(class_dir, seq_dir_name)
            if not os.path.isdir(seq_dir):
                continue
                
            sequence_features = []
            last_valid_features = [0] * 84  # Fallback if hand is not detected in a frame
            
            # Read all frames of the sequence in order
            for frame_idx in range(SEQUENCE_LENGTH):
                img_path = os.path.join(seq_dir, f"{frame_idx}.jpg")
                img = cv2.imread(img_path)
                if img is None:
                    # Pad with last valid features if frame file is missing
                    sequence_features.append(last_valid_features)
                    continue
                    
                img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
                results = hands.process(img_rgb)

                if results.multi_hand_landmarks:
                    hands_data = []

                    for hand_landmarks in results.multi_hand_landmarks:
                        hand_data = []
                        hand_x, hand_y = [], []
                        
                        for landmark in hand_landmarks.landmark:
                            hand_x.append(landmark.x)
                            hand_y.append(landmark.y)

                        # Normalize coordinates relative to each hand bounding box independently
                        for landmark in hand_landmarks.landmark:
                            hand_data.append(landmark.x - min(hand_x))
                            hand_data.append(landmark.y - min(hand_y))

                        hands_data.append(hand_data)

                    # Concatenate 2 hands coordinates (each hand has 42 coordinates, total 84)
                    if len(hands_data) == 2:
                        data_aux = hands_data[0] + hands_data[1]
                    else:
                        # Pad with zeros for second hand if only one hand is visible
                        data_aux = hands_data[0] + ([0] * 42)
                        
                    last_valid_features = data_aux
                    sequence_features.append(data_aux)
                else:
                    # Hand not detected in this frame, use last valid frame's landmarks
                    sequence_features.append(last_valid_features)
            
            # Only append if we successfully collected a sequence of SEQUENCE_LENGTH frames
            if len(sequence_features) == SEQUENCE_LENGTH:
                data.append(sequence_features)
                labels.append(int(class_id_str))
    
    return np.array(data), np.array(labels)

data, labels = process_images(DATA_DIR)

if data is not None and len(data) > 0:
    # Perform automatic stratified train-test split (80% train, 20% validation)
    train_data, test_data, train_labels, test_labels = train_test_split(
        data, labels, test_size=0.2, random_state=42, stratify=labels
    )
    
    with open('data.pickle', 'wb') as f:
        pickle.dump({
            'train_data': train_data, 
            'train_labels': train_labels,
            'test_data': test_data, 
            'test_labels': test_labels
        }, f)
    print(f"\nSuccessfully generated data.pickle!")
    print(f"Total samples: {len(data)}")
    print(f"Training samples: {len(train_data)}")
    print(f"Validation samples: {len(test_data)}")
else:
    print("Error: No hand landmarks detected in any images.")
