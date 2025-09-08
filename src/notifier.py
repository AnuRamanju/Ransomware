from plyer import notification #install plyer

def show_notification(title, message):
    """Show a pop-up notification on Windows."""
    notification.notify(
        title=title,
        message=message,
        app_name="Ransomware Detector",
        timeout=5  # Notification disappears after 5 seconds
    )

# Test the notifier
if __name__ == "__main__":
    show_notification("Test Alert", "This is a test notification.")
