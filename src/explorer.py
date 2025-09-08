import os
import time
import random
import string
import subprocess

# Set the honeypot directory (adjust if necessary)
HONEYPOT_DIR = os.path.abspath(os.path.join(os.getcwd(), "honeypot"))

# Ensure the honeypot directory exists
if not os.path.exists(HONEYPOT_DIR):
    os.makedirs(HONEYPOT_DIR)

def generate_random_filename(extension="txt", length=8):
    """Generate a random filename with the given extension."""
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for _ in range(length)) + '.' + extension

def simulate_file_creation():
    """Creates a new file with initial content and returns its path."""
    filename = generate_random_filename()
    file_path = os.path.join(HONEYPOT_DIR, filename)
    with open(file_path, "w") as f:
        f.write("Initial content.\n")
    print(f"[SIMULATION] Created: {file_path}")
    return file_path

def simulate_explorer_open(file_path):
    """Simulates opening a file location in Explorer."""
    cmd = f'explorer.exe /select,"{file_path}"'
    subprocess.run(cmd, shell=True)
    print(f"[SIMULATION] (Explorer) Opened Explorer for: {file_path}")

def simulate_explorer_modify(file_path):
    """Simulates modifying a file using Explorer (via a script)."""
    with open(file_path, "a") as f:
        f.write("Modified by Explorer simulation.\n")
    print(f"[SIMULATION] (Explorer) Modified: {file_path}")

def simulate_explorer_rename(file_path):
    """Simulates renaming a file using Explorer."""
    new_file_path = file_path.replace(".", "_renamed.")
    os.rename(file_path, new_file_path)
    print(f"[SIMULATION] (Explorer) Renamed: {file_path} -> {new_file_path}")
    return new_file_path

def simulate_explorer_delete(file_path):
    """Simulates deleting a file using Explorer."""
    os.remove(file_path)
    print(f"[SIMULATION] (Explorer) Deleted: {file_path}")

def simulate_explorer_events(interval=3):
    """
    Continuously simulates file events via Windows Explorer:
      1. Creates a file.
      2. Waits for 'interval' seconds.
      3. Modifies the file.
      4. Randomly performs one of the following actions:
         - Open file location in Explorer.
         - Rename file using Explorer.
         - Delete file using Explorer (random chance).
         - Keep the file unchanged.
      5. Waits for 'interval' seconds before the next cycle.
    """
    explorer_actions = [
        ("open", simulate_explorer_open),
        ("rename", simulate_explorer_rename),
    ]
    
    while True:
        file_path = simulate_file_creation()
        time.sleep(interval)
        
        # Always modify before renaming, deleting, or keeping
        simulate_explorer_modify(file_path)
        time.sleep(interval)

        # 50% chance to delete the file
        if random.random() < 0.5:
            simulate_explorer_delete(file_path)
        else:
            action, explorer_func = random.choice(explorer_actions)
            file_path = explorer_func(file_path)  # Update file path if renamed
            print(f"[SIMULATION] Keeping file: {file_path}")

        time.sleep(interval)

if __name__ == "__main__":
    print(f"Simulating honeypot events via Explorer in {HONEYPOT_DIR} ...")
    simulate_explorer_events(interval=3)
