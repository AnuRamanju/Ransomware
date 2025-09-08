import os
import time
import string
import random
import subprocess

def generate_random_filename(extension="txt", length=8):
    """Generate a random filename with the given extension."""
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for _ in range(length)) + '.' + extension

# Set the honeypot directory (adjust if necessary)
HONEYPOT_DIR = os.path.abspath(os.path.join(os.getcwd(), "honeypot"))

# Ensure the honeypot directory exists
if not os.path.exists(HONEYPOT_DIR):
    os.makedirs(HONEYPOT_DIR)

def create_file_with_notepad():
    """Creates a file using Notepad, writes text, and saves it to the honeypot folder."""
    filename = generate_random_filename()
    file_path = os.path.join(HONEYPOT_DIR, filename)
    
    # Create the file using Notepad
    with open(file_path, "w") as f:
        f.write("This file was created using Notepad.")
    
    print(f"[SIMULATION] (Notepad) Created file: {file_path}")
    -
    # Open the file in Notepad
    subprocess.Popen(["notepad.exe", file_path])
    
    # Wait for a few seconds before closing to allow detection
    time.sleep(5)
    print(f"[SIMULATION] (Notepad) Triggering alert for: {file_path}")
    
    return file_path

def modify_file_with_notepad(file_path):
    """Modifies an existing file using Notepad."""
    print(f"[SIMULATION] (Notepad) Modifying file: {file_path}")
    subprocess.Popen(["notepad.exe", file_path])
    time.sleep(5)
    print(f"[SIMULATION] (Notepad) Modified: {file_path}")

def delete_file_randomly(file_path):
    """Deletes the file with a 50% probability."""
    if random.random() < 0.5:
        os.remove(file_path)
        print(f"[SIMULATION] Deleted: {file_path}")
    else:
        print(f"[SIMULATION] Keeping file: {file_path}")

def trigger_alert(file_path):
    """Simulates triggering an alert when Notepad creates, modifies, or deletes a file."""
    print(f"[ALERT] Unauthorized modification detected: {file_path}")

def simulate_notepad_events():
    """Continuously creates, modifies, and randomly deletes files in an infinite loop."""
    while True:
        file_path = create_file_with_notepad()
        trigger_alert(file_path)
        
        time.sleep(3)
        modify_file_with_notepad(file_path)
        trigger_alert(file_path)
        
        time.sleep(3)
        delete_file_randomly(file_path)
        
        time.sleep(5)  # Wait before the next iteration

if __name__ == "__main__":
    print("Simulating Notepad file events in the honeypot folder...")
    simulate_notepad_events()