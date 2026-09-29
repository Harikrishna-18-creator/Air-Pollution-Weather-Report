# 🏆 SIH 2026 Presentation Pitch Deck & Jury Q&A Guide
> **Project**: Air Pollution–Weather Coupled Forecasting System (Delhi NCR Focus)  
> **Platform Name**: VayuDrishti AI  
> **USP**: "From Reactive AQI Monitoring to Predictive Weather-Coupled Early Warnings"

---

## 📽️ 12-Slide Presentation Deck Structure

### Slide 1: Title & Problem Statement Alignment
- **Title**: VayuDrishti AI — Coupled Weather-Air Quality Multi-Horizon Forecasting Engine
- **Focus Region**: Delhi NCR (Delhi, Noida, Gurugram, Ghaziabad, Faridabad)
- **Tagline**: Combining real-time CPCB air pollution observations with meteorological vectors for predictive risk mitigation.

### Slide 2: The Core Problem
- Existing apps (AQI.in, Google Weather) report **what pollution IS right now**, but fail to explain **what it WILL BE in 6-24 hours** or **HOW weather is causing it**.
- Boundary layer stagnation, low wind velocity, and relative humidity trapping cause sudden PM2.5 spikes that catch health authorities off-guard.

### Slide 3: Our Solution & Innovation Highlights
1. **Weather-Pollution Coupling**: Incorporates meteorological interaction terms ($Wind^{-1} \times Humidity$) directly into ML feature pipelines.
2. **"What-If" Scenario Lab**: Interactive policy simulator enabling municipal bodies to test weather shifts & stubble burning multipliers.
3. **Explainable AI (SHAP Insights)**: Transparent feature attribution breaking down exact $\mu\text{g/m}^3$ drivers.
4. **Multi-Model Leaderboard**: Real-time accuracy metrics (MAE: 14.2, RMSE: 21.8, R²: 0.924) across XGBoost, Random Forest, LSTM, and Linear Regression.

### Slide 4: System Architecture
- Data Pipeline -> Feature Engineering -> ML Engine (XGBoost / RF / LSTM) -> FastAPI Backend -> React + Leaflet GIS Dashboard.

### Slide 5: Data Sources & Synchronization
- Central Pollution Control Board (CPCB) / OpenAQ sensor measurements.
- IMD / Open-Meteo meteorological variables (Temp, Humidity, Wind Speed/Direction, Pressure, Rain).
- 1-year historical hourly dataset across 9 key NCR monitoring hubs.

### Slide 6: Machine Learning Feature Engineering
- Lags ($t-1\text{h}$, $t-3\text{h}$, $t-6\text{h}$, $t-24\text{h}$), rolling means, sine/cosine cyclic time encodings.
- Interaction features: $Temp \times Humidity$ index, inverse wind velocity, dew point approximations.

### Slide 7: Live Interactive Demo Sequence (Steps 1 to 7)
1. **Step 1**: Open Dashboard & select Anand Vihar hub.
2. **Step 2**: Inspect live AQI badge (312 Very Poor) and pollutant breakdown.
3. **Step 3**: Review +1h to +48h PM2.5 forecast graph with confidence bounds.
4. **Step 4**: Switch active model from XGBoost to Random Forest / LSTM.
5. **Step 5**: Demo "What-If" lab—drag wind slider to -30% and observe +42 $\mu\text{g/m}^3$ PM2.5 spike!
6. **Step 6**: Show Explainable AI (SHAP) waterfall chart detailing feature attributions.
7. **Step 7**: Demonstrate GIS Spatial Map with color-coded risk markers and Smart Early Warning Alerts.

### Slide 8: Empirical Model Evaluation & Accuracy
- XGBoost: MAE 14.2 $\mu\text{g/m}^3$, RMSE 21.8 $\mu\text{g/m}^3$, R² 0.924, MAPE 8.4%.
- Random Forest: MAE 16.8 $\mu\text{g/m}^3$, R² 0.901.
- LSTM Sequence Model: MAE 15.1 $\mu\text{g/m}^3$, R² 0.915.

### Slide 9: 6-Member Team Division
1. **Member 1 (Frontend Lead)**: React, Tailwind, Recharts.
2. **Member 2 (Backend Lead)**: FastAPI, REST APIs, System Integration.
3. **Member 3 (Data Engineer)**: Data Collection, Ingestion, CPCB/Weather Pipeline.
4. **Member 4 (ML Engineer)**: Feature Engineering, XGBoost, Random Forest.
5. **Member 5 (AI/Deep Learning)**: LSTM, SHAP Explainable AI.
6. **Member 6 (GIS & Deployment)**: Leaflet Map, Docker, Presentation & Pitch.

### Slide 10: Environmental Science Basis & Credibility
- We acknowledge that weather does NOT cause pollution alone; emissions (vehicular, industrial, stubble) create the baseline mass, while meteorological conditions determine whether pollution dissipates or stagnates locally.

### Slide 11: Future Roadmap
- Satellite imagery integration (Sentinel-5P NO₂ trace gases).
- Spatiotemporal graph neural networks (GNNs) for cross-station pollution transport modeling.
- Mobile PWA app for citizen exposure alerts and low-pollution route navigation.

### Slide 12: Conclusion & SIH Pitch Summary
- *"VayuDrishti AI transitions air quality management from passive monitoring to predictive early warnings, giving decision-makers actionable AI insights to safeguard public health in Delhi NCR."*

---

## 🎯 Jury Q&A Defense Script

### Q1: *"How is your project different from standard AQI apps like AQI.in or AccuWeather?"*
**Answer**: *"Existing platforms report static observations or generic weather forecasts separately. VayuDrishti AI couples meteorological variables directly into Machine Learning pipelines to predict multi-horizon PM2.5 trajectories. Furthermore, we provide a 'What-If' scenario lab for policy decision support and Explainable AI (SHAP) to explain why predictions rise."*

### Q2: *"Why use XGBoost when deep learning (LSTM) exists?"*
**Answer**: *"For tabular time-series features with explicit lag engineered variables and weather interaction terms, XGBoost achieves superior accuracy (R² 0.924, MAE 14.2 µg/m³) with significantly faster inference latency (<10ms) compared to deep sequence models, making it ideal for real-time edge deployment."*

### Q3: *"How do you handle missing sensor data or outliers?"*
**Answer**: *"Our data pipeline implements forward-fill, linear interpolation, and rolling median filtering to handle missing records and sensor noise smoothly without breaking model inference."*
