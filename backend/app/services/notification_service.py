from twilio.rest import Client
from app.config import (
    TWILIO_ACCOUNT_SID,
    TWILIO_AUTH_TOKEN,
    TWILIO_VERIFY_SERVICE_SID,
    TWILIO_PHONE_NUMBER
)
from app.models.notification_store import get_all, should_send, update_last_sent

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

# SEND OTP
def send_otp(phone):
    return client.verify.v2.services(TWILIO_VERIFY_SERVICE_SID) \
        .verifications.create(to=phone, channel="sms")

# VERIFY OTP
def verify_otp(phone, code):
    return client.verify.v2.services(TWILIO_VERIFY_SERVICE_SID) \
        .verification_checks.create(to=phone, code=code)

# SEND ALERT
def send_anomaly_alert(message):
    numbers = get_all()

    for phone in numbers:
        if should_send(phone):
            client.messages.create(
                body=message,
                from_=TWILIO_PHONE_NUMBER,
                to=phone
            )
            update_last_sent(phone)