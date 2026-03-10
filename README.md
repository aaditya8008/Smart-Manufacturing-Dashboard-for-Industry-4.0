# Smart-Manufacturing-Dashboard-for-Industry-4.0

A unified Industry 4.0 analytics platform designed for real-time equipment monitoring, predictive maintenance, supply chain risk analytics, and global manufacturing trend insights.

This dashboard combines live IoT data, machine learning models, and external data sources to enable intelligent decision-making in smart manufacturing environments.

## System Modules

The system focuses on three major modules:

### 1. Predictive Maintenance
Uses live IoT sensor data and unsupervised anomaly detection (Isolation Forest) to identify abnormal machine behavior and potential failures.

### 2. Supply Chain Risk Analytics
Uses a supervised machine learning model (Random Forest) to estimate operational risk levels and support supply chain decision-making.

### 3. Industry 4.0 Trends
Uses RSS feeds to deliver global manufacturing updates and emerging Industry 4.0 trends.


---

## Project Demo Video (Click Thumbnail to play)

[![Watch Video](https://github.com/aaditya8008/Smart-Manufacturing-Dashboard-for-Industry-4.0/blob/master/Screenshot%202025-11-24%20185843.png)](https://drive.google.com/file/d/1jpg7239VLSnmd8omnzy6J_0lhkgLzVti/preview)

---

## Team Members

- Aaditya – Team Lead, Frontend Development, Backend Integration, API Development
- Ankit Nath – Machine Learning Integration & API Development  
- Ishita Gautam – Frontend Web Developer  
- Rohit Kapoor – ML Model Development (Predictive Maintenance)  
- **Supervisor:** Dr. Ruchi Verma, Assistant Professor (CSE/IT)

---

## Technologies Used

### Frontend
- React.js (Vite)
- Tailwind CSS
- Chart.js (through react-chartjs-2)

### Backend
- FastAPI (Python)
- REST APIs
- httpx (for fetching IoT sensor data)

### Machine Learning
- **Predictive Maintenance:** Isolation Forest *(Unsupervised Anomaly Detection)*
- **Supply Chain Risk Prediction:** Random Forest *(Supervised Classification Model)*
- Scikit-learn
- Pandas
- NumPy

### External APIs
- ThingSpeak API (Live IoT Sensor Data)
- Google News RSS (Industry 4.0 Trends)

### Dataset
- **Supply Chain Risk Dataset:** Kaggle – Supply Chain Risk Data for SMEs

---

## Project Structure
```
Smart-Manufacturing-Dashboard-for-Industry-4.0/
├── .env.example
│
├── backend/
│   ├── app/
│   │   ├── config.py
│   │   ├── main.py
│   │   ├── models/
│   │   │   ├── live_anomaly_model.py
│   │   │   └── supply_model.py
│   │   ├── routers/
│   │   │   ├── live.py
│   │   │   ├── supply.py
│   │   │   └── trends.py
│   │   │── scripts/ 
│   │   │   └── train_supply_model.py
│   │   └── services/
│   │       └── predictive_service.py
│   ├── data/
│   │   └── supply_chain_risk_dataset.csv
│   ├── models/
│   │   ├── supply_preprocessor.pkl
│   │   └── supply_risk_model.pkl
│   └── requirements.txt
│
├── frontend/
│   ├── .gitignore
│   ├── eslint.config.js
│   ├── index.html
│   ├── package-lock.json
│   ├── package.json
│   ├── postcss.config.js
│   ├── public/
│   │   └── vite.svg
│   ├── src/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── assets/
│   │   │   └── react.svg
│   │   ├── components/
│   │   │   ├── ChartCard.jsx
│   │   │   ├── KPI.jsx
│   │   │   ├── NavBar.jsx
│   │   │   └── TrendCard.jsx
│   │   ├── index.css
│   │   ├── main.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── Predictive.jsx
│   │   │   ├── SupplyChain.jsx
│   │   │   └── Trends.jsx
│   │   └── services/
│   │       └── api.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
│
└── Screenshot 2025-11-24 185843.png
```


---

## Features

### **1. Predictive Maintenance**
- Live IoT data fetched via ThingSpeak API  
- Isolation Forest anomaly detection  
- Real-time anomaly score chart  
- Temperature & environmental trend charts  
- Sensor table with highlight indicators  
- Auto-refreshing monitoring system  

### **2. Supply Chain Risk Analytics**
- Machine learning model predicting supply chain risk levels  
- Random Forest classification model  
- Risk prediction categories: **Low / Medium / High**  
- Risk probability estimation  
- Feature importance analysis to identify key risk factors  
- Historical risk trend visualization  
- Custom user input prediction via API  

### **3. Industry 4.0 Trends**
- Fetches global manufacturing & Industry 4.0 news  
- Clean UI TrendCards  
- Auto-updating RSS system  

### **4. Unified Dashboard**
- KPI indicators for system health and operations  
- Real-time line charts for IoT sensor monitoring  
- Supply chain risk status visualization  
- Latest Industry 4.0 trends sidebar  
- System status indicators  

---

## Setup and Installation

### **Prerequisites**
- Node.js  
- Python 3.9+  
- pip  

---

## **Backend Setup**
```
cd backend
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at:
http://localhost:8000

---

## **Frontend Setup**
```
cd frontend
npm install
npm run dev
```

Frontend runs at:
http://localhost:5173

---

## License
This project is developed for **academic and research purposes**
