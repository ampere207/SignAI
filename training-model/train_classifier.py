# train_classifier.py
import pickle
import numpy as np
import torch
import torch.nn as nn
import torch.optim as optim
import torch.nn.functional as F
from torch.utils.data import DataLoader, TensorDataset
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score

# 1. Load the processed dataset
print("Loading dataset from data.pickle...")
with open('data.pickle', 'rb') as f:
    data_dict = pickle.load(f)

x_train = data_dict['train_data']
y_train = data_dict['train_labels']
x_test = data_dict['test_data']
y_test = data_dict['test_labels']

print(f"Loaded training samples: {x_train.shape}")
print(f"Loaded validation samples: {x_test.shape}")

# ----------------- RANDOM FOREST TRAINING (FLATTENED) -----------------
print("\n--- Training Scikit-Learn Random Forest Classifier (on Flattened Sequences) ---")
N_train, seq_len, num_features = x_train.shape
N_test = x_test.shape[0]

x_train_flat = x_train.reshape(N_train, -1)
x_test_flat = x_test.reshape(N_test, -1)

rf_model = RandomForestClassifier(n_estimators=100, random_state=42)
rf_model.fit(x_train_flat, y_train)

# Evaluate Random Forest
y_pred_rf = rf_model.predict(x_test_flat)
rf_acc = accuracy_score(y_test, y_pred_rf) * 100
print(f"Random Forest Validation Accuracy: {rf_acc:.2f}%")

# Save Random Forest Model
with open('model.p', 'wb') as f:
    pickle.dump({'model': rf_model}, f)
print("Saved Random Forest model as 'model.p'")

# ------------------- PYTORCH LSTM TRAINING ---------------------
print("\n--- Training PyTorch LSTM Sequence Classifier ---")

# Normalize data for LSTM (fit scaler on features across all time steps)
x_train_2d = x_train.reshape(-1, num_features)
x_test_2d = x_test.reshape(-1, num_features)

scaler = StandardScaler()
x_train_scaled_2d = scaler.fit_transform(x_train_2d)
x_test_scaled_2d = scaler.transform(x_test_2d)

# Reshape back to sequence format [N, seq_len, num_features]
x_train_scaled = x_train_scaled_2d.reshape(N_train, seq_len, num_features)
x_test_scaled = x_test_scaled_2d.reshape(N_test, seq_len, num_features)

# Convert to tensors
x_train_tensor = torch.FloatTensor(x_train_scaled)
y_train_tensor = torch.LongTensor(y_train)
x_test_tensor = torch.FloatTensor(x_test_scaled)
y_test_tensor = torch.LongTensor(y_test)

# Create loaders
train_loader = DataLoader(TensorDataset(x_train_tensor, y_train_tensor), batch_size=16, shuffle=True)
test_loader = DataLoader(TensorDataset(x_test_tensor, y_test_tensor), batch_size=16, shuffle=False)

# Define PyTorch LSTM Network
class SignLanguageLSTM(nn.Module):
    def __init__(self, input_size=84, hidden_size=128, num_layers=2, num_classes=60):
        super(SignLanguageLSTM, self).__init__()
        self.hidden_size = hidden_size
        self.num_layers = num_layers
        self.lstm = nn.LSTM(input_size, hidden_size, num_layers, batch_first=True, dropout=0.2 if num_layers > 1 else 0.0)
        self.fc = nn.Linear(hidden_size, num_classes)
        
    def forward(self, x):
        # x shape: [batch_size, sequence_length, input_size]
        out, _ = self.lstm(x)
        # Take hidden state output of the last time step for classification
        out = self.fc(out[:, -1, :])
        return out

num_classes = len(np.unique(y_train))
# Fallback to len(set(labels)) if training with fewer classes during test
if num_classes == 0:
    num_classes = 60

pt_model = SignLanguageLSTM(input_size=num_features, hidden_size=128, num_layers=2, num_classes=num_classes)

criterion = nn.CrossEntropyLoss()
optimizer = optim.Adam(pt_model.parameters(), lr=0.001)

# Training loop
num_epochs = 80
pt_model.train()
for epoch in range(num_epochs):
    running_loss = 0.0
    correct = 0
    total = 0
    for inputs, labels in train_loader:
        optimizer.zero_grad()
        outputs = pt_model(inputs)
        loss = criterion(outputs, labels)
        loss.backward()
        optimizer.step()
        
        running_loss += loss.item()
        _, predicted = torch.max(outputs.data, 1)
        total += labels.size(0)
        correct += (predicted == labels).sum().item()
        
    if (epoch + 1) % 10 == 0 or epoch == 0:
        epoch_loss = running_loss / len(train_loader)
        epoch_acc = 100 * correct / total
        print(f'Epoch [{epoch+1}/{num_epochs}], Loss: {epoch_loss:.4f}, Accuracy: {epoch_acc:.2f}%')

# Evaluate PyTorch Model
pt_model.eval()
correct = 0
total = 0
with torch.no_grad():
    for inputs, labels in test_loader:
        outputs = pt_model(inputs)
        _, predicted = torch.max(outputs, 1)
        total += labels.size(0)
        correct += (predicted == labels).sum().item()

pt_acc = 100 * correct / total
print(f"PyTorch LSTM Validation Accuracy: {pt_acc:.2f}%")

# Save PyTorch state dict and scaler
torch.save(pt_model.state_dict(), 'dl_model.pth')
with open('scaler.pickle', 'wb') as f:
    pickle.dump(scaler, f)
    
print("Saved PyTorch LSTM model as 'dl_model.pth' and scaler as 'scaler.pickle'")

print("\n=== Model training completed! All files saved successfully ===")
