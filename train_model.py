import os
import pandas as pd
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import OneHotEncoder
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import EarlyStopping
import joblib

# Define paths relative to src/
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATASET_FILE = os.path.join(BASE_DIR, "../logs/dataset.csv")
MODEL_FILE = os.path.join(BASE_DIR, "../models/ransomware_model.keras")
ENCODER_FILE = os.path.join(BASE_DIR, "../models/onehot_encoder.pkl")

# Load the dataset
df = pd.read_csv(DATASET_FILE)
if "timestamp" in df.columns:
    df = df.drop(columns=["timestamp"])

# Define categorical features for encoding
categorical_features = ["action", "file_extension", "process", "parent_process"]

# One-hot encode categorical features
encoder = OneHotEncoder(sparse_output=False, handle_unknown='ignore')
X_encoded = encoder.fit_transform(df[categorical_features])

# Save the encoder for later use
joblib.dump(encoder, ENCODER_FILE)
print(f"Encoder saved as: {ENCODER_FILE}")

# Define target variable
y = df["label"].values

# Split data into training (70%), validation (15%), and test (15%) sets
X_train, X_temp, y_train, y_temp = train_test_split(X_encoded, y, test_size=0.3, random_state=42)
X_val, X_test, y_val, y_test = train_test_split(X_temp, y_temp, test_size=0.5, random_state=42)

# Build a simple neural network model
model = Sequential([
    Dense(64, activation="relu", input_shape=(X_train.shape[1],)),
    Dropout(0.2),
    Dense(32, activation="relu"),
    Dense(1, activation="sigmoid")
])

# Compile the model
model.compile(optimizer=Adam(learning_rate=0.001), loss="binary_crossentropy", metrics=["accuracy"])

# Early stopping to prevent overfitting
early_stopping = EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True)

# Train the model
history = model.fit(X_train, y_train, epochs=20, batch_size=32, 
                    validation_data=(X_val, y_val), callbacks=[early_stopping])

# Evaluate the model
loss, accuracy = model.evaluate(X_test, y_test)
print(f"Test Accuracy: {accuracy:.2f}")

# Save the trained model in the models folder (using native Keras format)
model.save(MODEL_FILE)
print(f"Model saved as: {MODEL_FILE}")
