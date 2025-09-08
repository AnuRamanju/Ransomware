import psutil
import os
import json
import time
import hashlib
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler
from src.notifier import show_notification

# Define trusted processes (by name) – do not include notepad.exe here
SAFE_PROCESSES = {
    "explorer.exe",
    "cmd.exe",
    "powershell.exe",
    "python.exe",
    "code.exe",   # VS Code
    "Code.exe"
}

# Define trusted process paths (to prevent impersonation)
SAFE_PROCESS_PATHS = {
    "C:\\Users\\raman\\AppData\\Local\\Programs\\Microsoft VS Code\\bin\\code.cmd",
    "C:\\Users\\raman\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe",
    "C:\\Program Files\\Python311\\python.exe",
    "C:\\WINDOWS\\explorer.exe"
}

# Base directories and file paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
HONEYPOT_DIR = os.path.abspath(os.path.join(BASE_DIR, "../honeypot"))
LOGS_DIR = os.path.abspath(os.path.join(BASE_DIR, "../logs"))
LOG_FILE = os.path.join(LOGS_DIR, "file_activity_logs.json")
ATTACK_LOG_FILE = os.path.join(LOGS_DIR, "attack_logs.json")

# Ensure logs directory exists
os.makedirs(LOGS_DIR, exist_ok=True)

# Store last known file hashes to detect real modifications
file_hashes = {}

# Global log cache (will store log entries in memory)
log_cache = []

class FileMonitorHandler(FileSystemEventHandler):

    def on_any_event(self, event):
        """Handles all file events and filters duplicate modifications."""
        if not event.is_directory:
            action = event.event_type.capitalize()
            # For "Modified" events, check if the file's content truly changed
            if action == "Modified":
                if not self.is_real_modification(event.src_path):
                    return  # Ignore duplicate modification
            self.log_activity(action, event.src_path)

    def get_process_info(self, file_path):
        """
        Detects the process modifying the given file.
        First, it checks for any process that has the file open.
        If none is found, it falls back to checking the active window title.
        Returns a tuple: (process_name, process_path, parent_name)
        """
        try:
            # Attempt 1: Look for a process that has the file open.
            for proc in psutil.process_iter(['pid', 'name']):
                try:
                    open_files = proc.open_files()
                    for f in open_files:
                        if f.path == file_path:
                            process_name = proc.info['name']
                            process_path = proc.exe() if proc.exe() else "Unknown Path"
                            parent_proc = proc.parent()
                            parent_name = parent_proc.name() if parent_proc else "Unknown Parent"
                            print(f"[DEBUG] Detected process: {process_name} ({process_path}) - Parent: {parent_name}")
                            return process_name, process_path, parent_name
                except (psutil.NoSuchProcess, psutil.AccessDenied, psutil.ZombieProcess):
                    continue

            # Attempt 2 (Fallback): No process was found via open_files.
            try:
                import pygetwindow as gw
                active_title = gw.getActiveWindowTitle() or ""
                print(f"[DEBUG] Active window title: {active_title}")
            except Exception as e:
                print(f"[DEBUG] Failed to get active window title: {e}")
                active_title = ""
            
            # Define safe keywords mapping (all keys in lowercase)
            safe_keywords = {
                "visual studio code": ("Code.exe", "C:\\Users\\raman\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe"),
                "vs code": ("Code.exe", "C:\\Users\\raman\\AppData\\Local\\Programs\\Microsoft VS Code\\Code.exe"),
                "command prompt": ("cmd.exe", "C:\\WINDOWS\\System32\\cmd.exe"),
                "cmd": ("cmd.exe", "C:\\WINDOWS\\System32\\cmd.exe"),
                "powershell": ("powershell.exe", "C:\\WINDOWS\\System32\\WindowsPowerShell\\v1.0\\powershell.exe"),
                "python": ("python.exe", "C:\\Program Files\\Python311\\python.exe"),
                "explorer": ("explorer.exe", "C:\\WINDOWS\\explorer.exe")
            }
            active_title_lower = active_title.lower()
            for keyword, (proc_name, proc_path) in safe_keywords.items():
                if keyword in active_title_lower:
                    print(f"[DEBUG] Fallback: Active window indicates {proc_name}. Marking as safe.")
                    return proc_name, proc_path, proc_name  # Use process name as parent as well
            print("[DEBUG] Fallback: No process found; active window not safe.")
            return "Unknown Process", "Unknown Path", "Unknown Parent"
        except Exception as e:
            print(f"[ERROR] Process detection failed: {e}")
            return "Error", "Unknown Path", "Unknown Parent"

    def is_real_modification(self, file_path):
        """Checks if file content has changed (prevents false alerts) by comparing MD5 hashes."""
        global file_hashes
        if not os.path.exists(file_path):
            return False  # File was deleted before checking
        try:
            with open(file_path, "rb") as f:
                new_hash = hashlib.md5(f.read()).hexdigest()
            if file_path in file_hashes and file_hashes[file_path] == new_hash:
                return False  # No real change detected
            file_hashes[file_path] = new_hash
            return True  # Real change detected
        except Exception as e:
            print(f"[ERROR] Hashing file failed: {e}")
            return True  # Assume modification if error occurs

    def log_activity(self, action, file_path):
        """Logs file activity and differentiates between safe and suspicious modifications."""
        process_name, process_path, parent_name = self.get_process_info(file_path)

        log_entry = {
            "action": action,
            "file": file_path,
            "timestamp": time.ctime(),
            "process": process_name,
            "path": process_path,
            "parent_process": parent_name
        }

        global log_cache
        log_cache.append(log_entry)

        # Decision logic for printing safe or alert message:
        if process_name in SAFE_PROCESSES or process_path in SAFE_PROCESS_PATHS:
            print(f"[SAFE] {action}: {file_path} by {process_name}")
        else:
            print(f"[ALERT] {action}: {file_path} by {process_name}")
            show_notification("Ransomware Alert!",
                              f"Suspicious {action}: {file_path}\nProcess: {process_name}\nPath: {process_path}")

    def flush_logs(self):
        """Flushes the global log cache to the log file in a properly formatted JSON list."""
        global log_cache
        if log_cache:
            if os.path.exists(LOG_FILE):
                try:
                    with open(LOG_FILE, "r") as f:
                        existing_logs = json.load(f)
                except Exception as e:
                    print(f"[ERROR] Could not load existing logs: {e}")
                    existing_logs = []
            else:
                existing_logs = []
            existing_logs.extend(log_cache)
            try:
                with open(LOG_FILE, "w") as f:
                    json.dump(existing_logs, f, indent=4)
            except Exception as e:
                print(f"[ERROR] Failed to flush logs: {e}")
            log_cache = []

if __name__ == "__main__":
    print(f"[*] Monitoring directory: {HONEYPOT_DIR}")
    event_handler = FileMonitorHandler()
    observer = Observer()
    observer.schedule(event_handler, HONEYPOT_DIR, recursive=True)
    observer.start()
    try:
        while True:
            time.sleep(0.2)
            event_handler.flush_logs()
    except KeyboardInterrupt:
        observer.stop()
    observer.join()
