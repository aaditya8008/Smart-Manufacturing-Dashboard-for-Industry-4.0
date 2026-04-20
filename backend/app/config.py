import os
from pathlib import Path
from dotenv import load_dotenv

# Load .env file
load_dotenv()

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"

# ================= GENERAL =================
THINGSPEAK_CHANNEL = os.getenv("THINGSPEAK_CHANNEL", "1293177")

NEWS_RSS_TEMPLATE = "https://news.google.com/rss/search?q={q}&hl=en-US&gl=US&ceid=US:en"

# ================= MODEL PATHS =================
MODEL_PATH = BASE_DIR / "models" / "supply_risk_model.pkl"
PREPROCESSOR_PATH = BASE_DIR / "models" / "supply_preprocessor.pkl"
DATA_CSV = DATA_DIR / "supply_chain_risk_dataset.csv"

RETRAIN_SECRET = os.getenv("RETRAIN_SECRET", "changeme")

# ================= TWILIO CONFIG =================
TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_VERIFY_SERVICE_SID = os.getenv("TWILIO_VERIFY_SERVICE_SID")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")