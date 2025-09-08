import os
import time
import random
import string
import subprocess

def generate_random_string(length=8):
    """Generate a random string of lowercase letters."""
    letters = string.ascii_lowercase
    return ''.join(random.choice(letters) for _ in range(length))

# Generate a unique filename for the ex.py file (to be created on Desktop)
ex_filename = f"ex_{generate_random_string()}.py"

# Generate a unique filename for the honeypot file (e.g., python_test_<random>.txt)
honeypot_filename = f"python_test_{generate_random_string()}.txt"

# Path to the honeypot folder (adjust if needed)
honeypot_folder = r"C:\Users\HP\Desktop\Final_year_project\ransomware_detection\honeypot"

# Prepare the code to be written into the ex.py file.
# This code opens a file in the honeypot folder, writes text, flushes, waits for 10 seconds, and then randomly deletes the file.
ex_code = f'''import os
import time
import random

# Open the file for writing (this will keep the file open)
file_path = r"{os.path.join(honeypot_folder, honeypot_filename)}"
f = open(file_path, "w")
f.write("Hello from Python!")
f.flush()  # Ensure data is written to disk

# Hold the file open for 10 seconds so that the file monitor can detect the open file handle
time.sleep(10)

# Now close the file
f.close()

# Randomly decide to delete the file
if random.choice([True, False]):
    try:
        os.remove(file_path)
        print(f"File {{file_path}} deleted successfully.")
    except Exception as e:
        print(f"Error deleting file {{file_path}}: {{e}}")
else:
    print(f"File {{file_path}} retained.")

print("Finished executing ex file.")
'''

# Determine the Desktop path for the current user
desktop_path = os.path.join(os.path.expanduser("~"), "Desktop")
ex_filepath = os.path.join(desktop_path, ex_filename)

# Write the ex_code into the ex.py file on the Desktop
with open(ex_filepath, "w") as f:
    f.write(ex_code)

print(f"Created simulation file: {ex_filepath}")

# Launch the ex.py file in a new CMD window so that the process is python.exe.
# Using the "start" command with shell=True opens a new CMD window.
cmd = f'start python "{ex_filepath}"'
subprocess.run(cmd, shell=True)