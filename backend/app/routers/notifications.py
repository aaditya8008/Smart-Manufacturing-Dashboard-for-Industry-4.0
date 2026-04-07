from fastapi import APIRouter, HTTPException
from app.services.notification_service import send_otp, verify_otp
from app.models.notification_store import add_number, remove_number, get_all

router = APIRouter()


@router.get("/notifications")
def get_numbers():
    return {"numbers": get_all()}


# SEND OTP (used for BOTH add & remove)
@router.post("/notifications/send-otp")
def send_otp_api(phone: str):
    try:
        send_otp(phone)
        return {"status": "otp_sent"}
    except Exception as e:
        print("OTP SEND ERROR:", e)
        raise HTTPException(status_code=500, detail="Failed to send OTP")


# VERIFY & ADD NUMBER
@router.post("/notifications/verify-add")
def verify_add(phone: str, code: str):
    try:
        res = verify_otp(phone, code)

        if res.status == "approved":
            add_number(phone)
            return {"status": "added"}

        return {"status": "failed", "message": "Invalid OTP"}

    except Exception as e:
        print("VERIFY ADD ERROR:", e)
        raise HTTPException(status_code=500, detail="Verification failed")


# VERIFY & REMOVE NUMBER
@router.post("/notifications/verify-remove")
def verify_remove(phone: str, code: str):
    try:
        res = verify_otp(phone, code)

        if res.status == "approved":
            remove_number(phone)
            return {"status": "removed"}

        return {"status": "failed", "message": "Invalid OTP"}

    except Exception as e:
        print("VERIFY REMOVE ERROR:", e)
        raise HTTPException(status_code=500, detail="Remove failed")