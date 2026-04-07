import json
from pathlib import Path
from datetime import datetime, timedelta

STORE_FILE = Path("notifications.json")

def load_numbers():
    if not STORE_FILE.exists():
        return {}
    return json.loads(STORE_FILE.read_text())

def save_numbers(data):
    STORE_FILE.write_text(json.dumps(data, indent=2))

def add_number(phone):
    data = load_numbers()
    data[phone] = {
        "enabled": True,
        "last_sent": None
    }
    save_numbers(data)

def remove_number(phone):
    data = load_numbers()
    if phone in data:
        del data[phone]
    save_numbers(data)

def get_all():
    return load_numbers()

def should_send(phone):
    data = load_numbers()
    entry = data.get(phone)
    if not entry:
        return False

    last = entry.get("last_sent")
    if not last:
        return True

    last_time = datetime.fromisoformat(last)
    return datetime.utcnow() - last_time > timedelta(hours=1)

def update_last_sent(phone):
    data = load_numbers()
    if phone in data:
        data[phone]["last_sent"] = datetime.utcnow().isoformat()
        save_numbers(data)