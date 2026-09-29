# 🌱 Air Pollution–Weather Coupled Forecasting System (Delhi NCR Focus)
> **SIH 2026 Innovation Platform** • From Monitoring to AI-Driven Early Warning & Decision Support

---

## 🎯 Executive Summary
Conventional Air Quality Index (AQI) dashboards only answer: *"What is the pollution level right now?"*

**VayuDrishti AI** transforms air quality management by answering:
1. **"What will the PM2.5 / AQI level be across Delhi NCR in the next 1h, 3h, 6h, 12h, 24h, and 48h?"**
2. **"How are meteorological factors (low wind speed, humidity, thermal boundary layer inversion) driving this pollution accumulation?"**
3. **"What if wind speed drops by 30% or stubble burning emissions double—how will forecasted risk levels change?"**
4. **"Why is the AI model predicting a spike?" (Explainable AI / SHAP Insights)**

---

## 🧠 Main Innovations & Special Features

### 1. 🌦️ Coupled Weather-Pollution Engine
Instead of displaying weather values in isolation, the system uses meteorological vectors ($Wind^{-1} \times Humidity \times PM2.5_{Lag}$) to predict atmospheric stagnation and boundary layer trapping of fine particulates ($PM_{2.5} / PM_{10}$).

### 2. 🔮 "What-If" Pollution Scenario Lab
Allows policymakers, municipal bodies, and citizens to interactively adjust weather parameters (Wind Speed %, Humidity %, Temp Delta, Stubble Burning Multiplier) and receive instant, real-time AI recalibration of PM2.5 trajectories.

### 3. 🧠 Explainable AI (SHAP Feature Attributions)
Deconstructs complex ML model predictions into transparent, human-readable waterfall charts showing exact contributions (+42 µg/m³ due to Low Wind Speed, +28 µg/m³ due to High Humidity, etc.).

### 4. 📊 Multi-Model Benchmarking Leaderboard
Evaluates and benchmarks **XGBoost**, **Random Forest**, **LSTM / Neural Sequence Predictor**, and **Linear Regression** on MAE, RMSE, R², and MAPE metrics.

### 5. 🗺️ Interactive Spatial GIS Grid (Delhi NCR Focus)
Color-coded interactive map covering key monitoring hubs across Delhi (Anand Vihar, RK Puram, Punjabi Bagh, ITO, IGI Airport) and NCR (Noida Sec-62, Gurugram Vikas Sadan, Ghaziabad Vasundhara, Faridabad Sec-16A).

---

## 🏗️ Technical Architecture

```
                 ┌──────────────────────┐
                 │ CPCB / OpenAQ Data   │
                 └──────────┬───────────┘
                            │
                 ┌──────────▼───────────┐
                 │ Weather Data (IMD)   │
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │ Data Feature Engine  │
                 │ (Lags, LBL, Wind⁻¹)  │
                 └──────────┬───────────┘
                            ▼
              ┌───────────────────────────┐
              │     ML FORECAST ENGINE    │
              │                           │
              │  RF → XGBoost → LSTM → LR │
              └─────────────┬─────────────┘
                            ▼
                 ┌──────────────────────┐
                 │   FastAPI Backend    │
                 │  (REST & Scenario API)│
                 └──────────┬───────────┘
                            │
                            ▼
                 ┌──────────────────────┐
                 │    React Frontend    │
                 │(Tailwind, Recharts,  │
                 │      Leaflet GIS)    │
                 └──────────────────────┘
```

---

## 💻 Tech Stack
- **Frontend**: React.js, Vite, Tailwind CSS, Leaflet / React-Leaflet, Recharts, Lucide Icons, Framer Motion
- **Backend**: Python 3, FastAPI, Uvicorn, Pydantic
- **Machine Learning**: Scikit-Learn, XGBoost, NumPy, Pandas, SHAP
- **Dataset**: Historical hourly Coupled Pollution & Meteorology dataset for Delhi NCR monitoring stations

---

## 🚀 Quick Start Guide

### 1. Backend Setup (FastAPI)
```bash
cd backend
pip install -r requirements.txt
python train_models.py
uvicorn app.main:app --reload --port 8000
```
API Documentation will be live at: `http://localhost:8000/docs`

### 2. Frontend Setup (React)
```bash
cd frontend
npm install
npm run dev
```
Dashboard will be live at: `http://localhost:3000`

---

## 🏆 SIH Pitch Quote
> *"Our proposed platform integrates real-time air-quality observations, meteorological conditions, historical pollution patterns, and spatial information to develop an AI-driven forecasting system for Delhi NCR. Unlike conventional monitoring platforms that primarily report current AQI, our system predicts future pollution levels across multiple time horizons, identifies weather-pollution relationships, provides explainable AI insights, and generates early warnings for anticipated pollution episodes."*
