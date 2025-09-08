from flask import Flask, request, jsonify, render_template
import pandas as pd
import joblib
from tensorflow.keras.models import load_model
import os

# Initialize Flask app
app = Flask(__name__)

# Define paths (adjust these if necessary)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "../models/ransomware_model.keras")
ENCODER_PATH = os.path.join(BASE_DIR, "../models/onehot_encoder.pkl")

# Load the trained model and encoder at startup
model = load_model(MODEL_PATH)
encoder = joblib.load(ENCODER_PATH)

# Define the categorical features (must match your training features)
CATEGORICAL_FEATURES = ["action", "file_extension", "process", "parent_process"]

@app.route("/")
def index():
    # Render a simple home page (you can later create a template for this)
    return "Ransomware Detection API. Use the /predict endpoint to get predictions."

@app.route("/predict", methods=["POST"])
def predict():
    """
    Expects JSON input with key-value pairs for each categorical feature.
    For example:
    {
      "action": ["Created", "Modified"],
      "file_extension": [".txt", ".txt"],
      "process": ["python.exe", "notepad.exe"],
      "parent_process": ["python.exe", "notepad.exe"]
    }
    The API will output a list of predicted labels (0 for safe, 1 for alert).
    """
    try:
        # Get JSON data from the request
        data = request.get_json(force=True)
        # Convert input data to a DataFrame
        input_df = pd.DataFrame(data)
        
        # Ensure all required features are present
        for feature in CATEGORICAL_FEATURES:
            if feature not in input_df.columns:
                return jsonify({"error": f"Missing feature: {feature}"}), 400

        # One-hot encode the input using the pre-fitted encoder
        X_input = encoder.transform(input_df[CATEGORICAL_FEATURES])
        
        # Get predictions from the model
        predictions = model.predict(X_input)
        # Convert probabilities to binary labels
        predicted_labels = (predictions > 0.5).astype(int).flatten().tolist()
        
        # Return the predictions as JSON
        return jsonify({"predicted_labels": predicted_labels})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    # Run the Flask app on port 5000 (default)
    app.run(debug=True)
