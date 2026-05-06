# Smart-Manufacturing-Dashboard-for-Industry-4.0

A unified Industry 4.0 analytics platform designed for real-time equipment monitoring, predictive maintenance, supply chain risk analytics, and global manufacturing trend insights.

This dashboard combines live IoT data, machine learning models, external APIs, and cloud deployment to enable intelligent decision-making in smart manufacturing environments.

---

## System Modules

The system focuses on three major modules:

### 1. Predictive Maintenance
Uses live IoT sensor data and unsupervised anomaly detection (Isolation Forest) to identify abnormal machine behavior and potential failures.

### Features
- Real-time IoT sensor monitoring
- Isolation Forest–based anomaly detection
- Historical sensor trend visualization
- Dynamic anomaly score generation
- Automatic simulation fallback during API downtime
- Real-time SMS alerts using Twilio API

---

### 2. Supply Chain Risk Analytics
Uses a supervised machine learning model (Random Forest) to estimate operational risk levels and support supply chain decision-making.

### Features
- Risk prediction categories:
  - Low
  - Medium
  - High
- Risk probability estimation
- Feature importance analysis
- Historical risk trend visualization
- Custom API-based prediction support
- Preprocessing with scaling and categorical encoding

---

### 3. Industry 4.0 Trends
Uses RSS feeds to deliver global manufacturing updates and emerging Industry 4.0 trends.

### Features
- Google News RSS parsing
- Auto-updating Industry 4.0 news
- Article summaries and timestamps
- TrendCards UI integration
- Keyword-based trend filtering

---

## Project Demo Video (Click Thumbnail to play)

[![Watch Video](https://github.com/aaditya8008/Smart-Manufacturing-Dashboard-for-Industry-4.0/blob/master/Screenshot%202025-11-24%20185843.png)](https://drive.google.com/file/d/1jpg7239VLSnmd8omnzy6J_0lhkgLzVti/preview)

---

## Team Members

- Aaditya – Team Lead, Frontend Development, Backend Integration, API Development, Twilio Integration & Deployment
- Ankit Nath – Machine Learning Integration & API Development  
- Ishita Gautam – Frontend Web Developer & Industry 4.0 Trends Module
- Rohit Kapoor – ML Model Development (Predictive Maintenance)  

### Supervisor
**Dr. Ruchi Verma**  
Assistant Professor (SG), Department of CSE/IT  
Jaypee University of Information Technology

---

## System Architecture

The system architecture consists of five major layers:

1. Data Source Layer  
2. Data Ingestion Layer  
3. Backend Processing Layer  
4. Machine Learning Layer  
5. Frontend Visualization Layer  



---

## Technologies Used

### Frontend
- React.js (Vite)
- Tailwind CSS
- Chart.js (through react-chartjs-2)
- Axios

### Backend
- FastAPI (Python)
- REST APIs
- httpx
- Async processing

### Machine Learning
- Isolation Forest (Unsupervised Anomaly Detection)
- Random Forest (Supervised Classification)
- Scikit-learn
- Pandas
- NumPy
- Joblib

### External APIs & Services
- ThingSpeak API (Live IoT Sensor Data)
- Google News RSS
- Twilio Verify API

### Deployment
- Render (Backend Deployment)
- Vercel (Frontend Deployment)

### Development Tools
- VS Code
- Git & GitHub
- Postman

---

## Machine Learning Models

### Predictive Maintenance Model
The anomaly detection system uses Isolation Forest for unsupervised anomaly detection on live IoT sensor streams.

#### Input Features
```python
[
 temperature,
 humidity,
 pressure,
 rain,
 wind
]
```

#### Capabilities
- Real-time anomaly detection
- Dynamic anomaly scoring
- Batch and single prediction support
- Millisecond-level inference
- Continuous live monitoring

---

### Supply Chain Risk Prediction Model
The supply chain risk module uses a supervised Random Forest classification model.

#### Training Pipeline
- Missing value handling
- Numerical scaling
- Categorical encoding
- Feature alignment
- Model persistence using Joblib

#### Output
- Risk Label
- Risk Probability
- Feature Importance

#### Achieved Accuracy
- Approximately 92% classification accuracy

---

## Notification System

The project integrates Twilio Verify API and SMS alert notifications.

### Features
- OTP verification
- Phone number registration
- Real-time anomaly alerts
- Anti-spam cooldown mechanism
- Notification persistence using JSON storage

### Alert Conditions
SMS alerts are triggered whenever:
- An anomaly is detected
- Sensor values become abnormal
- Critical environmental thresholds are exceeded

---

## API Endpoints

### Live Monitoring APIs

| Endpoint | Method | Description |
|---|---|---|
| `/api/live_data` | GET | Get latest live sensor data |
| `/api/history` | GET | Get historical sensor data |

---

### Trends APIs

| Endpoint | Method | Description |
|---|---|---|
| `/api/trends` | GET | Fetch Industry 4.0 news |

---

### Supply Chain APIs

| Endpoint | Method | Description |
|---|---|---|
| `/api/supply/risk` | GET | Get latest supply chain risk |
| `/api/supply/predict` | POST | Predict custom supply risk |
| `/api/supply/retrain` | POST | Retrain supply model |

---

### Notification APIs

| Endpoint | Method | Description |
|---|---|---|
| `/api/notifications` | GET | Get registered numbers |
| `/api/notifications/send-otp` | POST | Send OTP |
| `/api/notifications/verify-add` | POST | Verify & add number |
| `/api/notifications/verify-remove` | POST | Verify & remove number |

---

## Features

### 1. Predictive Maintenance
- Live IoT data retrieved using ThingSpeak API
- Isolation Forest–based anomaly detection
- Real-time anomaly score visualization
- Environmental trend charts
- Auto-refreshing monitoring system
- SMS-based anomaly alerts

---

### 2. Supply Chain Risk Analytics
- Machine learning–based supply risk prediction
- Random Forest classification model
- Low / Medium / High risk classification
- Risk probability estimation
- Feature importance analysis
- Historical risk trends
- API-based custom prediction support

---

### 3. Industry 4.0 Trends
- Fetches global manufacturing news
- RSS-based live updates
- Clean TrendCards UI
- Auto-updating trend system

---

### 4. Unified Dashboard
- KPI indicators
- Live IoT visualization
- Real-time charts
- System status indicators
- Industry 4.0 trends sidebar
- Supply chain analytics integration

---

## Project Structure

```text
Smart-Manufacturing-Dashboard-for-Industry-4.0/
├── .env.example
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
│   │   ├── supply_preprocessor.pkl
│   │   └── supply_risk_model.pkl
│   │
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ChartCard.jsx
│   │   │   ├── KPI.jsx
│   │   │   ├── NavBar.jsx
│   │   │   └── TrendCard.jsx
│   │   │
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Predictive.jsx
│   │   │   ├── SupplyChain.jsx
│   │   │   ├── Trends.jsx
│   │   │   └── Notifications.jsx
│   │   │
│   │   ├── services/
│   │   │   └── api.js
│   │   │
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   │
│   └── package.json
│
├── README.md
│
└── Screenshot 2025-11-24 185843.png
```

---

## Setup and Installation

### Prerequisites
- Node.js
- Python 3.9+
- pip

---

## Backend Setup

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

## Frontend Setup

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

## Environment Variables

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

## Deployment

### Backend Deployment
- Platform: Render
- Framework: FastAPI
- Live API: https://smart-manufacturing-dashboard-for.onrender.com

### Frontend Deployment
- Platform: Vercel
- Framework: React + Vite
- Live Website: https://your-vercel-link.vercel.app

---

## Experimental Results

### Predictive Maintenance
- Real-time anomaly detection achieved successfully
- Stable live monitoring performance
- Millisecond-level ML predictions
- Automatic simulation fallback during API downtime

### Supply Chain Risk
- Approximately 92% model accuracy
- Successful Low / Medium / High classification
- Feature importance analysis generated correctly

### Performance
- API Response Time: 200–300 ms
- Dashboard Load Time: 1–2 seconds
- ML Prediction Time: <10 ms

---

## Future Improvements

- Deep learning–based anomaly detection
- Additional IoT sensor integration
- Email-based notification support
- Enhanced cybersecurity mechanisms
- Demand forecasting integration
- Industrial-scale optimization

---

## GitHub Repository

https://github.com/aaditya8008/Smart-Manufacturing-Dashboard-for-Industry-4.0

---

## License

This project is developed for academic and research purposes only.
