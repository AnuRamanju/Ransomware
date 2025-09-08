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

def simulate_cmd_event(file_path):
    """Simulates file creation/modification via Command Prompt (cmd.exe)."""
    cmd = f'cmd.exe /c "echo Hello from CMD > {file_path}"'
    subprocess.run(cmd, shell=True)
    print(f"[SIMULATION] (CMD) Created/Modified: {file_path}")

def simulate_powershell_event(file_path):
    """Simulates file creation/modification via PowerShell."""
    cmd = f'powershell.exe -Command "Set-Content -Path \'{file_path}\' -Value \'Hello from PowerShell\'"'
    subprocess.run(cmd, shell=True)
    print(f"[SIMULATION] (PowerShell) Created/Modified: {file_path}")

def simulate_python_event(file_path):
    """Simulates file modification via Python (safe process)."""
    cmd = f'python -c "with open(r\'{file_path}\', \'a\') as f: f.write(\'Hello from Python\\n\')"'
    subprocess.run(cmd, shell=True)
    print(f"[SIMULATION] (Python) Modified: {file_path}")

def simulate_notepad_event(file_path):
    """Simulates a file event using Notepad (alert process)."""
    p = subprocess.Popen(["notepad.exe", file_path])
    print(f"[SIMULATION] (Notepad) Opened: {file_path}")
    time.sleep(5)  # Hold the file open for detection
    p.terminate()
    print(f"[SIMULATION] (Notepad) Closed: {file_path}")

def simulate_explorer_event(file_path):
    """Simulates a file event using Windows Explorer (alert process)."""
    cmd = f'explorer.exe /select,"{file_path}"'
    subprocess.run(cmd, shell=True)
    print(f"[SIMULATION] (Explorer) Opened Explorer for: {file_path}")

def simulate_honeypot_events(interval=3):
    """
    Continuously simulates file events by:
      1. Creating a file.
      2. Waiting for 'interval' seconds.
      3. Randomly performing one of the following actions on the file:
         - Simulate a CMD event.
         - Simulate a PowerShell event.
         - Simulate a Python event.
         - Simulate a Notepad event.
         - Simulate an Explorer event.
      4. Optionally, delete the file with a certain probability.
      5. Wait for 'interval' seconds before starting the next cycle.
    """
    process_simulations = [
        ("cmd", simulate_cmd_event),
        ("powershell", simulate_powershell_event),
        ("python", simulate_python_event),
        ("notepad", simulate_notepad_event),
        ("explorer", simulate_explorer_event)
    ]
    while True:
        file_path = simulate_file_creation()
        time.sleep(interval)
        # Randomly choose one simulation function
        proc_type, simulation_func = random.choice(process_simulations)
        simulation_func(file_path)
        time.sleep(interval)
        # With 50% probability, delete the file; otherwise, keep it
        if random.random() < 0.5:
            os.remove(file_path)
            print(f"[SIMULATION] Deleted: {file_path}")
        else:
            print(f"[SIMULATION] Keeping file: {file_path}")
        time.sleep(interval)

if __name__ == "__main__":
    print(f"Simulating honeypot events in {HONEYPOT_DIR} ...")
    simulate_honeypot_events(interval=3)
