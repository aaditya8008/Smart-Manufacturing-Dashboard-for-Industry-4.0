# Smart Manufacturing Dashboard for Industry 4.0

An Industry 4.0–based intelligent analytics platform for real-time IoT monitoring, predictive maintenance, supply chain risk analysis, and Industry 4.0 trend tracking using Machine Learning, FastAPI, ReactJS, and cloud deployment.

The platform integrates live IoT sensor streams, machine learning models, external APIs, and interactive dashboards to support intelligent industrial monitoring and decision-making.

---

# Project Overview

The Smart Manufacturing Dashboard provides:

- Real-time IoT sensor monitoring
- Predictive maintenance using anomaly detection
- Supply chain risk prediction
- Industry 4.0 trends and news updates
- Real-time SMS alert notifications
- Cloud-based deployment and accessibility

The system continuously retrieves live environmental sensor data from ThingSpeak and processes it using machine learning models to detect abnormal conditions and generate intelligent insights.

---

# System Modules

## 1. Predictive Maintenance

The Predictive Maintenance module uses live IoT sensor data and Isolation Forest anomaly detection to identify abnormal machine or environmental conditions.

### Features
- Real-time IoT sensor monitoring
- Isolation Forest–based anomaly detection
- Live anomaly scoring
- Historical sensor trend visualization
- Automatic simulation fallback during API downtime
- Real-time SMS alerts using Twilio

### Sensor Parameters
- Temperature
- Humidity
- Pressure
- Rainfall
- Wind Speed

---

## 2. Supply Chain Risk Analytics

The Supply Chain module predicts operational risk levels using a Random Forest classification model trained on supply chain datasets.

### Features
- Risk classification:
  - Low
  - Medium
  - High
- Risk probability estimation
- Feature importance analysis
- Historical risk trend charts
- Custom prediction API support
- Dataset preprocessing and scaling

### Input Parameters
- Inventory Level
- Pending Orders
- Supplier Lead Time
- Supplier Reliability
- Supplier Quality Score
- Fuel Price Index
- Port Delay Days
- Weather Disruption Score
- Market Demand Index

---

## 3. Industry 4.0 Trends

This module fetches and parses Industry 4.0–related news and manufacturing updates using RSS feeds.

### Features
- Live RSS feed integration
- Google News RSS parsing
- Auto-updating trends section
- Article summaries and timestamps
- Industry-related keyword filtering

---

# Project Demo Video

## Click Thumbnail to Watch

[![Watch Video](https://github.com/aaditya8008/Smart-Manufacturing-Dashboard-for-Industry-4.0/blob/master/Screenshot%202025-11-24%20185843.png)](https://drive.google.com/file/d/1jpg7239VLSnmd8omnzy6J_0lhkgLzVti/preview)

---

# System Architecture

The system architecture contains five major layers:

1. Data Source Layer  
2. Data Ingestion Layer  
3. Backend Processing Layer  
4. Machine Learning Layer  
5. Frontend Visualization Layer  

## Workflow

```text
IoT Sensors → ThingSpeak Cloud → FastAPI Backend
→ Machine Learning Models
→ React Dashboard
→ SMS Alerts & Analytics
```

---

# Technologies Used

## Frontend
- React.js (Vite)
- Tailwind CSS
- Chart.js
- React-ChartJS-2
- Axios

## Backend
- FastAPI
- Python
- REST APIs
- httpx
- Async Processing

## Machine Learning
- Scikit-learn
- Isolation Forest
- Random Forest Classifier
- Pandas
- NumPy
- Joblib

## APIs & External Services
- ThingSpeak API
- Google News RSS
- Twilio API

## Deployment
- Render (Backend)
- Vercel (Frontend)

## Development Tools
- VS Code
- Git & GitHub
- Postman

---

# Machine Learning Models

## Isolation Forest (Predictive Maintenance)

The anomaly detection system uses Isolation Forest for unsupervised anomaly detection on live IoT sensor streams.

### Model Features
- Real-time anomaly prediction
- Multi-sensor anomaly analysis
- Batch and single prediction support
- Dynamic anomaly scoring
- Millisecond-level inference

### Input Vector

```python
[
 temperature,
 humidity,
 pressure,
 rain,
 wind
]
```

---

## Random Forest (Supply Chain Risk)

The supply chain risk module uses a supervised Random Forest classification model.

### Training Pipeline
- Missing value handling
- Numerical scaling
- Categorical encoding
- Feature alignment
- Model persistence using Joblib

### Output
- Risk Label
- Risk Probability
- Feature Importance

### Achieved Accuracy
- Approximately 92% classification accuracy

---

# Notification System

The project integrates Twilio Verify API and SMS alerts.

## Features
- OTP verification
- Phone number registration
- Real-time anomaly alerts
- Anti-spam cooldown mechanism
- Notification persistence

## Alert Conditions

SMS alerts are triggered whenever:
- An anomaly is detected
- Sensor conditions become abnormal
- Critical environmental thresholds are exceeded

---

# API Endpoints

## Live Monitoring APIs

| Endpoint | Method | Description |
|---|---|---|
| `/api/live_data` | GET | Get latest sensor data |
| `/api/history` | GET | Get historical sensor data |

---

## Trends APIs

| Endpoint | Method | Description |
|---|---|---|
| `/api/trends` | GET | Get Industry 4.0 news |

---

## Supply Chain APIs

| Endpoint | Method | Description |
|---|---|---|
| `/api/supply/risk` | GET | Get latest supply chain risk |
| `/api/supply/predict` | POST | Predict custom supply risk |
| `/api/supply/retrain` | POST | Retrain supply model |

---

## Notification APIs

| Endpoint | Method | Description |
|---|---|---|
| `/api/notifications` | GET | Get registered numbers |
| `/api/notifications/send-otp` | POST | Send OTP |
| `/api/notifications/verify-add` | POST | Verify & add number |
| `/api/notifications/verify-remove` | POST | Verify & remove number |

---

# Frontend Features

## Dashboard
- KPI Cards
- Live Charts
- Real-time Monitoring
- Industry 4.0 News
- System Status Indicators

## Predictive Maintenance Page
- Live anomaly visualization
- Sensor history
- Real-time anomaly score chart
- Alert indicators

## Supply Chain Dashboard
- Risk probability graphs
- Feature importance analysis
- Risk classification results
- Trend visualization

## Trends Page
- RSS-based Industry 4.0 updates
- News summaries
- Auto-refreshing trend cards

---

# Project Structure

```text
Smart-Manufacturing-Dashboard-for-Industry-4.0/
│
├── backend/
│   ├── app/
│   │   ├── config.py
│   │   ├── main.py
│   │   │
│   │   ├── models/
│   │   │   ├── live_anomaly_model.py
│   │   │   ├── supply_model.py
│   │   │   └── notification_store.py
│   │   │
│   │   ├── routers/
│   │   │   ├── live.py
│   │   │   ├── supply.py
│   │   │   ├── trends.py
│   │   │   └── notifications.py
│   │   │
│   │   ├── services/
│   │   │   ├── predictive_service.py
│   │   │   └── notification_service.py
│   │   │
│   │   └── scripts/
│   │       └── train_supply_model.py
│   │
│   ├── data/
│   │   └── supply_chain_risk_dataset.csv
│   │
│   ├── models/
│   │   ├── supply_risk_model.pkl
│   │   └── supply_preprocessor.pkl
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   └── package.json
│
├── README.md
│
└── Screenshot 2025-11-24 185843.png
```

---

# Setup and Installation

## Prerequisites
- Node.js
- Python 3.9+
- pip

---

# Backend Setup

```bash
cd backend

python -m venv venv

venv\Scripts\activate

pip install -r requirements.txt

uvicorn app.main:app --reload
```

Backend runs at:

```text
http://localhost:8000
```

---

# Frontend Setup

```bash
cd frontend

npm install

npm run dev
```

Frontend runs at:

```text
http://localhost:5173
```

---

# Environment Variables

Create a `.env` file inside the backend directory.

```env
THINGSPEAK_CHANNEL=

THINGSPEAK_API_KEY=

TWILIO_ACCOUNT_SID=

TWILIO_AUTH_TOKEN=

TWILIO_VERIFY_SERVICE_SID=

TWILIO_PHONE_NUMBER=

RETRAIN_SECRET=
```

---

# Deployment

## Backend Deployment
- Platform: Render
- Framework: FastAPI

## Frontend Deployment
- Platform: Vercel
- Framework: React + Vite

---

# Experimental Results

## Predictive Maintenance
- Real-time anomaly detection achieved successfully
- Stable live monitoring performance
- Millisecond-level ML predictions
- Automatic simulation fallback during API downtime

## Supply Chain Risk
- Approximate model accuracy: 92%
- Successful classification of Low / Medium / High risk
- Feature importance analysis generated correctly

## Performance
- API Response Time: 200–300 ms
- Dashboard Load Time: 1–2 seconds
- ML Prediction Time: <10 ms

---

# Future Improvements

- Deep learning–based anomaly detection
- More IoT sensor integration
- Email-based notification support
- Enhanced cybersecurity
- Demand forecasting integration
- Industrial-scale deployment optimization

---

# Team Members

- Aaditya  
  Team Lead, Frontend Development, Backend Integration, API Development, Deployment, Twilio Integration

- Ankit Nath  
  Machine Learning Integration & Backend Support

- Ishita Gautam  
  Frontend Development & Trends Module

- Rohit Kapoor  
  Predictive Maintenance & ML Integration

---

# Supervisor

Dr. Ruchi Verma  
Assistant Professor (SG)  
Department of CSE & IT  
Jaypee University of Information Technology

---

# GitHub Repository

https://github.com/aaditya8008/Smart-Manufacturing-Dashboard-for-Industry-4.0

---

# License

This project is developed for academic and research purposes only.
