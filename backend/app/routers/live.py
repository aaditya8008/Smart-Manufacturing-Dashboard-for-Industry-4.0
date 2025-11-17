from fastapi import APIRouter
from app.services.predictive_service import start_dummy_live_feed, get_latest, get_history

router = APIRouter()

# Start live feed
start_dummy_live_feed()

@router.get("/live_data")
def live_data():
    latest = get_latest()
    return {"status": "ok", "data": latest}

@router.get("/history")
def history(limit: int = 100):
    hist = get_history(limit)
    return {"status": "ok", "count": len(hist), "series": hist}
