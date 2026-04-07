# app/services/predictive_service.py
# Real-time IoT Monitoring + Predictive Analytics
# ThingSpeak Live Data + Simulation Fallback + Anomaly Detection + Notifications

import asyncio
import os
import httpx
from datetime import datetime, timezone
from collections import deque
import numpy as np
import random
from app.models.live_anomaly_model import LiveAnomalyModel


from app.services.notification_service import send_anomaly_alert

# ================= CONFIG =================

THINGSPEAK_CHANNEL = os.getenv("THINGSPEAK_CHANNEL", "1293177")
THINGSPEAK_API_KEY = os.getenv("THINGSPEAK_API_KEY", "")
REFRESH_INTERVAL = int(os.getenv("REFRESH_SECONDS", 15))
BOOTSTRAP_SAMPLES = 120

# ================= STATE =================

_live_buffer = deque(maxlen=500)
_running = False

model = LiveAnomalyModel()

# ================= SIMULATION =================

def simulate_weather(last=None):
    if not last or last.get("status") != "active":
        return {
            "temperature": round(random.uniform(22, 30), 2),
            "humidity": round(random.uniform(50, 85), 2),
            "pressure": round(random.uniform(990, 1025), 2),
            "rain": 0.0,
            "wind": round(random.uniform(1, 8), 2)
        }

    return {
        "temperature": round(last["temperature"] + random.uniform(-0.3, 0.3), 2),
        "humidity": round(last["humidity"] + random.uniform(-1.0, 1.0), 2),
        "pressure": round(last["pressure"] + random.uniform(-0.6, 0.6), 2),
        "rain": 0.0,
        "wind": round(max(0, last["wind"] + random.uniform(-0.5, 0.5)), 2)
    }


# ================= MODEL INIT =================

async def initialize_model():
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

            samples = []
            for f in feeds:
                try:
                    samples.append([
                        float(f.get("field1", 0)),
                        float(f.get("field2", 0)),
                        float(f.get("field3", 0)),
                        float(f.get("field4", 0)),
                        float(f.get("field5", 0)),
                    ])
                except Exception:
                    continue

            X = np.array(samples)

            if len(X) > 10:
                model.fit(X)
                print(f"[Model] Trained on {len(X)} real samples")
                return

        raise Exception("Insufficient data")

    except Exception as e:
        print(f"[Model Init] Fallback mode: {e}")
        dummy = np.random.rand(200, 5) * [30, 100, 1000, 10, 10]
        model.fit(dummy)
        print("[Model] Initialized using synthetic dataset")


# ================= NOTIFICATION HELPER =================

def trigger_notification(sample):
    """
    Send notification ONLY if anomaly detected.
    Anti-spam handled in notification_service (1 hour rule)
    """
    if not sample.get("anomaly"):
        return

    try:
        message = (
            f"⚠️ Anomaly Detected!\n\n"
            f"Temp: {sample['temperature']}°C\n"
            f"Humidity: {sample['humidity']}%\n"
            f"Pressure: {sample['pressure']} hPa\n"
            f"Wind: {sample['wind']} m/s\n\n"
            f"Time: {sample['timestamp']}"
        )

        send_anomaly_alert(message)

    except Exception as e:
        print(f"[Notification Error] {e}")


# ================= FETCH LOGIC =================

async def fetch_from_thingspeak():

    base_url = f"https://api.thingspeak.com/channels/{THINGSPEAK_CHANNEL}/feeds.json"
    params = {"results": 1}
    if THINGSPEAK_API_KEY:
        params["api_key"] = THINGSPEAK_API_KEY

    try:
        async with httpx.AsyncClient(timeout=10) as client:
            resp = await client.get(base_url, params=params)
            resp.raise_for_status()
            data = resp.json()
            feeds = data.get("feeds", [])

            if feeds:
                f = feeds[-1]

                created_at = f.get("created_at")
                if created_at:
                    created_time = datetime.fromisoformat(
                        created_at.replace("Z", "+00:00")
                    )

                    diff = (datetime.now(timezone.utc) - created_time).total_seconds()

                    if diff <= 1800:
                        sample = {
                            "status": "active",
                            "source": "remote_iot_station",
                            "timestamp": created_at,
                            "temperature": float(f.get("field1", 0)),
                            "humidity": float(f.get("field2", 0)),
                            "pressure": float(f.get("field3", 0)),
                            "rain": float(f.get("field4", 0)),
                            "wind": float(f.get("field5", 0)),
                        }

                        x = np.array([
                            sample["temperature"],
                            sample["humidity"],
                            sample["pressure"],
                            sample["rain"],
                            sample["wind"],
                        ])

                        pred, score = model.predict_one(x)
                        sample["anomaly"] = pred == -1
                        sample["anomaly_score"] = round(score, 3)

                        #  TRIGGER NOTIFICATION
                        trigger_notification(sample)

                        return sample

    except Exception as e:
        print(f"[ThingSpeak] Connection error: {e}")

    # ================= SIMULATION MODE =================

    last = _live_buffer[-1] if _live_buffer else None
    sim = simulate_weather(last)

    x = np.array([
        sim["temperature"],
        sim["humidity"],
        sim["pressure"],
        sim["rain"],
        sim["wind"],
    ])

    pred, score = model.predict_one(x)

    sample = {
        "status": "simulated",
        "source": "simulation_engine",
        "inference_mode": "simulated",
        "message": "Remote IoT sensor offline — simulated data",
        "timestamp": datetime.now(timezone.utc).isoformat(),

        **sim,

        "anomaly": True if pred == -1 else False,
        "anomaly_score": round(score, 3)
    }

    # TRIGGER NOTIFICATION
    trigger_notification(sample)

    return sample


# ================= LOOP =================

async def live_data_loop():
    global _running
    _running = True

    while _running:
        sample = await fetch_from_thingspeak()
        if sample:
            _live_buffer.append(sample)
        await asyncio.sleep(REFRESH_INTERVAL)


def start_dummy_live_feed():
    import threading

    async def starter():
        await initialize_model()
        await live_data_loop()

    def runner():
        asyncio.run(starter())

    t = threading.Thread(target=runner, daemon=True)
    t.start()


# ================= API HELPERS =================

def get_latest():
    if not _live_buffer:
        return {}
    return _live_buffer[-1]


def get_history(limit=100):
    return list(_live_buffer)[-limit:]


def retrain_with_history():
    data = [
        [
            r["temperature"],
            r["humidity"],
            r["pressure"],
            r["rain"],
            r["wind"],
        ]
        for r in _live_buffer
        if r.get("status") in ("active", "simulated")
    ]

    if not data:
        return False

    try:
        model.fit(np.array(data))
        return True
    except Exception:
        return False