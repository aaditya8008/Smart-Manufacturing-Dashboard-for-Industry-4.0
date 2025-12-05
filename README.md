# Smart-Manufacturing-Dashboard-for-Industry-4.0

A unified Industry 4.0 analytics platform providing real-time equipment monitoring, predictive maintenance, and global manufacturing trend insights.  
This dashboard focuses on Predictive Maintenance and Industry 4.0 Trends, using live IoT data and unsupervised anomaly detection.

---

## Project Demo Video (Click to play)

[![Watch Video](https://github.com/aaditya8008/Smart-Manufacturing-Dashboard-for-Industry-4.0/blob/master/Screenshot%202025-11-24%20185843.png)](https://drive.google.com/file/d/1jpg7239VLSnmd8omnzy6J_0lhkgLzVti/preview)




---

## Team Members

- Aaditya – Team Lead, Frontend, Backend Integration, API Development  
- Ankit Nath – ML Integration & API Development  
- Ishita Gautam – Frontend Web Developer  
- Rohit Kapoor – ML Model Development (Predictive Maintenance)  
- **Supervisor:** Dr. Ruchi Verma, Assistant Professor (CSE/IT)

---


## Technologies Used

### **Frontend**
- React.js (Vite)
- Tailwind CSS
- Chart.js (via react-chartjs-2)

### **Backend**
- FastAPI (Python)
- REST APIs
- httpx (IoT sensor fetching)

### **Machine Learning**
- **Predictive Maintenance:** Isolation Forest *(Unsupervised Anomaly Detection)*  
- Scikit-learn, Pandas, NumPy

### **External APIs**
- ThingSpeak API (Live IoT Sensor Data)
- Google News RSS (Industry 4.0 Trends)

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
│   │   │   └── live_anomaly_model.py
│   │   ├── routers/
│   │   │   ├── live.py
│   │   │   └── trends.py
│   │   └── services/
│   │       └── predictive_service.py
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
│   ├── README.md
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
│   │   │   └── Trends.jsx
│   │   └── services/
│   │       └── api.js
│   ├── tailwind.config.js
│   └── vite.config.js
│
└── README.md
```

---

## Features

### **1. Predictive Maintenance**
- Live IoT data fetched via ThingSpeak API  
- Isolation Forest anomaly detection  
- Real‑time anomaly score chart  
- Temperature & vibration trend charts  
- Sensor table with highlight indicators  
- Auto-refreshing monitoring system  

### **2. Industry 4.0 Trends**
- Fetches global manufacturing & Industry 4.0 news  
- Clean UI TrendCards  
- Auto-updating RSS system  

### **3. Unified Dashboard**
- KPIs  
- Real-time line charts  
- Latest trends sidebar  
- Status indicators  

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
http://localhost:3000

---

## License
This project is developed for **academic and research purposes** under the Smart Manufacturing & Industry 4.0 domain.
