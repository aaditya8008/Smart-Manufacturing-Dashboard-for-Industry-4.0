# app/services/predictive_service.py
# Real-time IoT Predictive Maintenance Service using ThingSpeak + IsolationForest

import asyncio
import os
import httpx
from datetime import datetime, timezone
from collections import deque
import numpy as np
from app.models.live_anomaly_model import LiveAnomalyModel

# ===== Configuration =====
THINGSPEAK_CHANNEL = os.getenv("THINGSPEAK_CHANNEL", "1293177")
THINGSPEAK_API_KEY = os.getenv("THINGSPEAK_API_KEY", "")
REFRESH_INTERVAL = int(os.getenv("REFRESH_SECONDS", 30))
BOOTSTRAP_SAMPLES = 120  # number of past samples for initial training

# ===== Buffers =====
_live_buffer = deque(maxlen=500)
_running = False

# ===== Initialize IsolationForest Model =====
model = LiveAnomalyModel()


async def initialize_model():
    """
    Bootstrap model using real ThingSpeak historical data.
    Fallback to dummy data if ThingSpeak is unavailable.
    """
    try:
        base_url = f"https://api.thingspeak.com/channels/{THINGSPEAK_CHANNEL}/feeds.json"
        params = {"results": BOOTSTRAP_SAMPLES}
        if THINGSPEAK_API_KEY:
            params["api_key"] = THINGSPEAK_API_KEY

        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(base_url, params=params)
            resp.raise_for_status()
            data = resp.json()
            feeds = data.get("feeds", [])
            if not feeds:
                raise ValueError("No bootstrap data returned from ThingSpeak.")

            samples = []
            for f in feeds:
                try:
                    samples.append([
                        float(f.get("field1", 0)),  # temperature
                        float(f.get("field2", 0)),  # humidity
                        float(f.get("field3", 0)),  # pressure
                        float(f.get("field4", 0)),  # rain
                        float(f.get("field5", 0)),  # wind
                    ])
                except Exception:
                    continue

            X = np.array(samples)
            if len(X) > 10:
                model.fit(X)
                print(f"[Model] IsolationForest trained on {len(X)} real ThingSpeak samples.")
            else:
                raise ValueError("Insufficient valid samples for training.")

    except Exception as e:
        # Fallback to dummy initialization if ThingSpeak fails
        print(f"[Model Init] Failed to train on ThingSpeak data: {e}")
        dummy_data = np.random.rand(200, 5) * [30, 100, 1000, 10, 10]
        model.fit(dummy_data)
        print("[Model] IsolationForest initialized with dummy fallback data.")


async def fetch_from_thingspeak():
    """Fetch latest data feed from ThingSpeak and apply anomaly detection."""
    base_url = f"https://api.thingspeak.com/channels/{THINGSPEAK_CHANNEL}/feeds.json"
    params = {"results": 1}
    if THINGSPEAK_API_KEY:
        params["api_key"] = THINGSPEAK_API_KEY

    async with httpx.AsyncClient(timeout=10) as client:
        resp = await client.get(base_url, params=params)
        resp.raise_for_status()
        data = resp.json()
        feeds = data.get("feeds", [])
        if not feeds:
            return None
        f = feeds[-1]

        # Extract sensor data
        sample = {
            "timestamp": f.get("created_at", datetime.now(timezone.utc).isoformat()),
            "temperature": float(f.get("field1", 0)),
            "humidity": float(f.get("field2", 0)),
            "pressure": float(f.get("field3", 0)),
            "rain": float(f.get("field4", 0)),
            "wind": float(f.get("field5", 0)),
        }

        # Predict anomaly
        x = np.array([
            sample["temperature"],
            sample["humidity"],
            sample["pressure"],
            sample["rain"],
            sample["wind"],
        ])
        pred, score = model.predict_one(x)
        sample["anomaly_score"] = round(score, 3)
        sample["anomaly"] = True if pred == -1 else False
        return sample


async def live_data_loop():
    """Background loop for continuous ThingSpeak updates."""
    global _running
    _running = True
    while _running:
        try:
            sample = await fetch_from_thingspeak()
            if sample:
                _live_buffer.append(sample)
        except Exception as e:
            print(f"[ThingSpeak] Error fetching data: {e}")
        await asyncio.sleep(REFRESH_INTERVAL)


def start_dummy_live_feed():
    """Start background live data loop."""
    import threading

    async def starter():
        await initialize_model()
        await live_data_loop()

    def runner():
        asyncio.run(starter())

    t = threading.Thread(target=runner, daemon=True)
    t.start()


def get_latest():
    """Return latest sample."""
    if not _live_buffer:
        return {}
    return _live_buffer[-1]


def get_history(limit=100):
    """Return recent samples."""
    return list(_live_buffer)[-limit:]


def retrain_with_history():
    """Retrain model using buffer history."""
    if not _live_buffer:
        print("[Retrain] No data to retrain.")
        return False
    try:
        X = np.array([
            [r["temperature"], r["humidity"], r["pressure"], r["rain"], r["wind"]]
            for r in list(_live_buffer)
        ])
        model.fit(X)
        print(f"[Retrain] Model retrained on {len(X)} samples.")
        return True
    except Exception as e:
        print(f"[Retrain] Failed: {e}")
        return False
