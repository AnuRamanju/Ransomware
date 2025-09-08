import os
import json
import pandas as pd

# Define file paths relative to the src directory
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
LOG_FILE = os.path.join(BASE_DIR, "../logs/file_activity_logs.json")
OUTPUT_FILE = os.path.join(BASE_DIR, "../logs/dataset.csv")

def load_logs(log_file):
    """Load log entries from a file that contains either a JSON array or line-by-line JSON objects."""
    if not os.path.exists(log_file):
        print(f"[ERROR] Log file {log_file} does not exist!")
        return []

    try:
        with open(log_file, 'r') as f:
            content = f.read().strip()
            
            # Check if it's a JSON array
            if content.startswith("[") and content.endswith("]"):
                return json.loads(content)
            
            # Otherwise, assume line-by-line JSON
            data = []
            for i, line in enumerate(content.split("\n"), start=1):
                try:
                    data.append(json.loads(line))
                except json.JSONDecodeError as e:
                    print(f"[WARNING] Skipping malformed line {i}: {e}")
            return data
    except json.JSONDecodeError as e:
        print(f"[ERROR] Could not parse JSON file: {e}")
        return []


def preprocess_logs(logs):
    """Convert log entries into a structured DataFrame and apply labeling."""
    data = []
    for entry in logs:
        # Extract file extension if possible
        file_ext = os.path.splitext(entry.get("file", ""))[-1].lower() if entry.get("file") else ""
        data.append({
            "timestamp": entry.get("timestamp", ""),
            "action": entry.get("action", ""),
            "file_extension": file_ext,
            "process": entry.get("process", "").lower(),
            "parent_process": entry.get("parent_process", "").lower()
        })
    df = pd.DataFrame(data)

    # Define safe processes (lowercase for normalization)
    SAFE_PROCS = ["code.exe", "explorer.exe", "cmd.exe", "powershell.exe", "python.exe"]

    # Label: 0 for safe/benign, 1 for suspicious/malicious.
    df["label"] = df["process"].apply(lambda x: 0 if x in SAFE_PROCS else 1)
    return df

def main():
    logs = load_logs(LOG_FILE)
    if not logs:
        print("[WARNING] No logs were loaded. Please ensure file_monitor.py has generated logs.")
        return

    df = preprocess_logs(logs)
    df.to_csv(OUTPUT_FILE, index=False)
    print(f"[INFO] Dataset saved to {OUTPUT_FILE}")
    print()

if __name__ == "__main__":
    main()
