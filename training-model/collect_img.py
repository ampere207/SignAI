# collect_img.py
import os
import cv2
import time
import json

DATA_DIR = './data'
dataset_size = 200  # 200 frames per class is highly optimal for landmarks classification

# Ask the user for gesture names to train from scratch
print("=== SignAI Data Collection ===")
print("Starting from class index 0 (completely new dataset)")
default_gestures = [
    "College", "Doctor", "Food", "Friend", "Go", "Good Morning", "Good Night", "Good", "Happy", "He",
    "Hello", "Help", "Home", "Hospital", "I", "Namaste", "No", "She", "Sleep", "Sorry",
    "Thank You", "Today", "Want", "Water", "Welcome", "What", "When", "Who", "Yes", "You",
    "Ache", "Bad", "Beautiful", "Book", "Brother", "Cold", "Come", "Deaf", "Eat", "Family",
    "Father", "Fever", "Give", "Hearing", "How", "Love", "Medicine", "Mother", "Name", "Please",
    "School", "Sister", "Stop", "Teacher", "Thankful", "Time", "Tomorrow", "Understand", "Wash", "Where"
]
print("Target vocabulary contains 60 common words.")
gestures_input = input("Enter gesture names separated by commas,\nor press Enter to use the default 60 target words:\n")

if not gestures_input.strip():
    gestures = default_gestures
else:
    gestures = [x.strip() for x in gestures_input.split(",") if x.strip()]

if not gestures:
    print("No gestures entered. Exiting.")
    exit()

# Build and save mapping
labels_dict = {i: name for i, name in enumerate(gestures)}
os.makedirs(DATA_DIR, exist_ok=True)
with open('labels.json', 'w') as f:
    json.dump(labels_dict, f, indent=4)
print(f"Saved gesture mapping to labels.json: {labels_dict}")

cap = cv2.VideoCapture(0)
if not cap.isOpened():
    raise Exception("Error: Webcam not detected.")

for index, name in labels_dict.items():
    class_dir = os.path.join(DATA_DIR, str(index))
    os.makedirs(class_dir, exist_ok=True)

    print(f"\n--- Get ready to collect images for gesture: '{name}' (Class ID: {index}) ---")

    # Ready phase
    while True:
        ret, frame = cap.read()
        if not ret:
            continue
        # Display guidelines
        cv2.putText(frame, f'Get ready for "{name}". Press "Q" to start capture!', 
                    (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 255, 0), 2, cv2.LINE_AA)
        cv2.imshow('frame', frame)
        if cv2.waitKey(25) & 0xFF == ord('q'):
            time.sleep(1)
            break

    # Recording phase
    for i in range(dataset_size):
        ret, frame = cap.read()
        if not ret:
            continue

        file_path = os.path.join(class_dir, f'{i}.jpg')
        cv2.imwrite(file_path, frame)

        # Draw progress indicators on frame
        cv2.putText(frame, f'Recording "{name}": {i+1}/{dataset_size}', 
                    (20, 50), cv2.FONT_HERSHEY_SIMPLEX, 0.8, (0, 0, 255), 2, cv2.LINE_AA)
        cv2.imshow('frame', frame)
        cv2.waitKey(15)  # Fast frame capture interval

cap.release()
cv2.destroyAllWindows()
print("\n=== Data collection complete! all class images are inside './data/' ===")
