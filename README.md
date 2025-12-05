# Smart-Manufacturing-Dashboard-for-Industry-4.0

A unified Industry 4.0 analytics platform providing real-time equipment monitoring, predictive maintenance, and manufacturing trend insights.  
The system integrates IoT data acquisition, anomaly detection using Isolation Forest, and a responsive web dashboard for continuous industrial monitoring.

## Project Demo Video (Click to Play)

[![Watch Video](https://raw.githubusercontent.com/aaditya8008/Smart-Manufacturing-Dashboard-for-Industry-4.0/master/Screenshot%202025-11-24%20185843.png)](https://drive.google.com/file/d/1jpg7239VLSnmd8omnzy6J_0lhkgLzVti/preview)

## Team Members

- Aaditya – Team Lead, Frontend Development, Backend Integration, API Development  
- Ankit Nath – Machine Learning Integration and Backend API Development  
- Ishita Gautam – Frontend Development  
- Rohit Kapoor – ML Model Development (Predictive Maintenance)  
- Supervisor: Dr. Ruchi Verma, Assistant Professor (CSE/IT)

## Technologies Used

### Frontend
- React.js (Vite)
- Tailwind CSS
- Chart.js (react-chartjs-2)

### Backend
- FastAPI (Python)
- REST APIs
- httpx (IoT sensor data fetching)

### Machine Learning
- Isolation Forest (Unsupervised Anomaly Detection)
- Scikit-learn  
- NumPy  
- Pandas  

### External APIs
- ThingSpeak API (Live IoT Sensor Data)
- Google News RSS (Industry 4.0 Trends)

## Project Structure

Smart-Manufacturing-Dashboard-for-Industry-4.0/
├── .env.example
│
├── backend/
│   ├── app/
│   │   ├── config.py
│   │   ├── main.py
│   │   ├── models/
│   │   │   └── live_anomaly_model.py
│   │   ├── routers/
│   │   │   ├── live.py
│   │   │   └── trends.py
│   │   └── services/
│   │       └── predictive_service.py
│   └── requirements.txt
│
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── postcss.config.js
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── App.jsx
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ChartCard.jsx
│   │   │   ├── KPI.jsx
│   │   │   ├── NavBar.jsx
│   │   │   └── TrendCard.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Predictive.jsx
│   │   │   └── Trends.jsx
│   │   └── services/
│   │       └── api.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md

## Features

### 1. Predictive Maintenance
- Real-time IoT data ingestion via ThingSpeak  
- Isolation Forest anomaly detection  
- Live anomaly scoring  
- Sensor trend visualization  
- Temperature, humidity, vibration, and environmental metrics  
- Auto-refreshing monitoring system  

### 2. Industry 4.0 Trends
- Automated global news extraction using RSS feeds  
- Structured and clean visualization  
- Continuous background updates  

### 3. Unified Dashboard
- Modern responsive UI  
- Real-time line charts  
- KPI summaries  
- Trends sidebar and system indicators  

## Setup and Installation

### Prerequisites
- Python 3.9+  
- Node.js  
- pip  

## Backend Setup

cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload

Backend runs at:  
http://localhost:8000

## Frontend Setup

cd frontend
npm install
npm run dev

Frontend runs at:  
http://localhost:3000

## License

This project is developed for academic and research purposes under the Smart Manufacturing and Industry 4.0 domain.
