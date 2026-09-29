import axios from 'axios';

const API_BASE = 'http://localhost:8000/api';

const client = axios.create({
  baseURL: API_BASE,
  timeout: 4000,
});

// Mock Fallback Data in case FastAPI backend server is offline
const MOCK_STATIONS = [
  { id: "delhi_anand_vihar", name: "Anand Vihar, Delhi", city: "Delhi", zone: "East Delhi", lat: 28.6469, lng: 77.3160, station_type: "Industrial / High-Traffic Bus Hub", current_aqi: 312, current_pm25: 188.5, risk_level: "Very Poor", risk_color: "#A855F7" },
  { id: "delhi_rk_puram", name: "RK Puram, Delhi", city: "Delhi", zone: "South Delhi", lat: 28.5632, lng: 77.1869, station_type: "Urban Residential", current_aqi: 245, current_pm25: 142.0, risk_level: "Poor", risk_color: "#EF4444" },
  { id: "delhi_punjabi_bagh", name: "Punjabi Bagh, Delhi", city: "Delhi", zone: "West Delhi", lat: 28.6683, lng: 77.1247, station_type: "Commercial / Mixed Transit", current_aqi: 278, current_pm25: 168.0, risk_level: "Poor", risk_color: "#EF4444" },
  { id: "delhi_ito", name: "ITO Junction, Central Delhi", city: "Delhi", zone: "Central Delhi", lat: 28.6286, lng: 77.2410, station_type: "Major Traffic Corridor", current_aqi: 295, current_pm25: 182.0, risk_level: "Poor", risk_color: "#EF4444" },
  { id: "delhi_igi_airport", name: "IGI Airport T3, Delhi", city: "Delhi", zone: "South West Delhi", lat: 28.5606, lng: 77.0934, station_type: "Aviation Zone", current_aqi: 195, current_pm25: 125.0, risk_level: "Moderate", risk_color: "#F59E0B" },
  { id: "noida_sec_62", name: "Sector 62, Noida", city: "Noida", zone: "Gautam Buddha Nagar", lat: 28.6244, lng: 77.3649, station_type: "Institutional / Commercial IT", current_aqi: 262, current_pm25: 155.0, risk_level: "Poor", risk_color: "#EF4444" },
  { id: "gurugram_vikas_sadan", name: "Vikas Sadan, Gurugram", city: "Gurugram", zone: "Haryana NCR", lat: 28.4595, lng: 77.0266, station_type: "Urban Administrative", current_aqi: 228, current_pm25: 138.0, risk_level: "Poor", risk_color: "#EF4444" },
  { id: "ghaziabad_vasundhara", name: "Vasundhara, Ghaziabad", city: "Ghaziabad", zone: "UP NCR", lat: 28.6609, lng: 77.3573, station_type: "High Density Residential / Highway", current_aqi: 318, current_pm25: 192.0, risk_level: "Very Poor", risk_color: "#A855F7" },
  { id: "faridabad_sec_16a", name: "Sector 16A, Faridabad", city: "Faridabad", zone: "Haryana NCR", lat: 28.4089, lng: 77.3178, station_type: "Industrial Zone", current_aqi: 270, current_pm25: 162.0, risk_level: "Poor", risk_color: "#EF4444" }
];

export const fetchStations = async () => {
  try {
    const res = await client.get('/stations');
    return res.data;
  } catch (err) {
    console.warn("Using offline mock stations data");
    return MOCK_STATIONS;
  }
};

export const fetchLiveAQI = async (stationId) => {
  try {
    const res = await client.get(`/live/${stationId}`);
    return res.data;
  } catch (err) {
    const st = MOCK_STATIONS.find(s => s.id === stationId) || MOCK_STATIONS[0];
    return {
      station_id: st.id,
      station_name: st.name,
      city: st.city,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      aqi: st.current_aqi,
      risk_level: st.risk_level,
      risk_color: st.risk_color,
      pm25: st.current_pm25,
      pm10: Math.round(st.current_pm25 * 1.8),
      no2: 64.5,
      so2: 17.2,
      co: 1.8,
      o3: 42.0,
      temperature: 22.4,
      humidity: 78.0,
      wind_speed: 3.5,
      wind_direction: 285.0,
      pressure: 1014.2,
      rainfall: 0.0,
      health_advisory: "Respiratory illness risk on prolonged exposure. Sensitive groups should stay indoors."
    };
  }
};

export const fetchForecast = async (stationId, model = 'XGBoost') => {
  try {
    const res = await client.get(`/forecast/${stationId}?model=${encodeURIComponent(model)}`);
    return res.data;
  } catch (err) {
    const st = MOCK_STATIONS.find(s => s.id === stationId) || MOCK_STATIONS[0];
    const base = st.current_pm25;
    
    const horizons = [
      { label: "1h", hrs: 1, mult: 1.04 },
      { label: "3h", hrs: 3, mult: 1.09 },
      { label: "6h", hrs: 6, mult: 1.18 },
      { label: "12h", hrs: 12, mult: 1.25 },
      { label: "24h", hrs: 24, mult: 1.12 },
      { label: "48h", hrs: 48, mult: 1.05 }
    ];

    const makeForecastList = (mMult) => horizons.map(h => {
      const predPm = Math.round(base * h.mult * mMult * 10) / 10;
      const predAqi = Math.round(predPm * 1.5);
      return {
        horizon: h.label,
        horizon_hours: h.hrs,
        forecast_timestamp: new Date(Date.now() + h.hrs * 3600000).toISOString().substring(0, 16).replace('T', ' '),
        predicted_pm25: predPm,
        predicted_aqi: predAqi,
        risk_level: predAqi > 300 ? "Very Poor" : (predAqi > 200 ? "Poor" : "Moderate"),
        risk_color: predAqi > 300 ? "#A855F7" : (predAqi > 200 ? "#EF4444" : "#F59E0B"),
        conf_low: Math.round((predPm * 0.92) * 10) / 10,
        conf_high: Math.round((predPm * 1.08) * 10) / 10
      };
    });

    return {
      station_id: st.id,
      station_name: st.name,
      model_used: model,
      current_pm25: base,
      forecasts: makeForecastList(1.0),
      model_comparison: {
        "XGBoost": makeForecastList(1.0),
        "Random Forest": makeForecastList(0.97),
        "LSTM / Neural Net": makeForecastList(1.02),
        "Linear Regression": makeForecastList(1.08)
      }
    };
  }
};

export const simulateWhatIf = async (payload) => {
  try {
    const res = await client.post('/what-if', payload);
    return res.data;
  } catch (err) {
    const basePm = 188.5;
    const windChange = payload.wind_speed_change_pct || 0;
    const humChange = payload.humidity_change_pct || 0;
    const stubbleMult = payload.stubble_burning_factor || 1.0;

    const windFactor = (4.0 + 1.0) / (Math.max(0.5, 4.0 * (1.0 + windChange / 100.0)) + 1.0);
    const humFactor = 1.0 + (humChange / 100.0) * 0.45;

    const simPm = Math.round(basePm * windFactor * humFactor * stubbleMult * 10) / 10;
    const deltaPm = Math.round((simPm - basePm) * 10) / 10;
    const deltaPct = Math.round((deltaPm / basePm) * 1000) / 10;
    const simAqi = Math.round(simPm * 1.5);

    return {
      station_id: payload.station_id || "delhi_anand_vihar",
      station_name: "Anand Vihar, Delhi",
      baseline_pm25: basePm,
      simulated_pm25: simPm,
      delta_pm25: deltaPm,
      delta_pct: deltaPct,
      baseline_aqi: 312,
      simulated_aqi: simAqi,
      baseline_risk: "Very Poor",
      simulated_risk: simAqi > 300 ? "Very Poor" : (simAqi > 400 ? "Severe" : "Poor"),
      simulated_forecast_6h: Math.round(simPm * 1.15 * 10) / 10,
      weather_explanation: `Under simulated parameters, PM2.5 changes by ${deltaPm > 0 ? '+' : ''}${deltaPm} µg/m³ (${deltaPct > 0 ? '+' : ''}${deltaPct}%), recalibrating forecasted AQI to ${simAqi}.`,
      contributing_factors: [
        windChange < 0 ? `🌬️ ${Math.abs(windChange)}% wind reduction curtails horizontal dispersion rate.` : `💨 Wind increase aids particulate dispersion.`,
        humChange > 0 ? `💧 ${humChange}% humidity elevation accelerates secondary particle formation.` : `Dry air assists particle settling.`
      ]
    };
  }
};

export const fetchSHAPExplanation = async (stationId) => {
  try {
    const res = await client.get(`/explain/${stationId}`);
    return res.data;
  } catch (err) {
    return {
      station_id: stationId,
      station_name: "Anand Vihar, Delhi",
      baseline_pm25: 80.0,
      predicted_pm25: 188.5,
      features: [
        { feature_name: "baseline_background", feature_label: "Regional Baseline PM2.5", value: "80.0 µg/m³", impact_pm25: 80.0, is_increasing: true },
        { feature_name: "wind_speed", feature_label: "Low Wind Speed (3.5 km/h)", value: "3.5 km/h", impact_pm25: 42.5, is_increasing: true },
        { feature_name: "humidity", feature_label: "High Relative Humidity (78%)", value: "78%", impact_pm25: 28.1, is_increasing: true },
        { feature_name: "pm25_lag_trend", feature_label: "PM2.5 Historical 6h Lag Persistence", value: "188.5 µg/m³", impact_pm25: 22.4, is_increasing: true },
        { feature_name: "temperature_inversion", feature_label: "Shallow Boundary Layer Inversion", value: "22.4°C", impact_pm25: 15.5, is_increasing: true }
      ],
      summary_text: "Model prediction of 188.5 µg/m³ is driven primarily by Low Wind Speed (+42.5 µg/m³), High Ambient Humidity (+28.1 µg/m³), and 6-Hour Lag Trend Persistence."
    };
  }
};

export const fetchModelPerformance = async () => {
  try {
    const res = await client.get('/model-performance');
    return res.data;
  } catch (err) {
    return [
      { model_name: "XGBoost", mae: 14.2, rmse: 21.8, r2: 0.924, mape: 8.4, description: "Gradient boosted decision trees optimized for complex non-linear feature interactions." },
      { model_name: "Random Forest", mae: 16.8, rmse: 24.5, r2: 0.901, mape: 9.8, description: "Ensemble of decision trees minimizing overfitting on tabular weather features." },
      { model_name: "LSTM / Neural Net", mae: 15.1, rmse: 22.9, r2: 0.915, mape: 8.9, description: "Deep Multi-Layer Perceptron / Recurrent Sequence model for time-series memory." },
      { model_name: "Linear Regression", mae: 28.4, rmse: 38.2, r2: 0.742, mape: 17.5, description: "Baseline statistical benchmark evaluating linear trend relationships." }
    ];
  }
};

export const fetchAlerts = async () => {
  try {
    const res = await client.get('/alerts');
    return res.data;
  } catch (err) {
    return [
      {
        id: "alert-1",
        station_id: "delhi_anand_vihar",
        station_name: "Anand Vihar, Delhi",
        severity: "Critical",
        severity_color: "#881337",
        title: "🚨 Severe PM2.5 Atmospheric Trapping Forecasted",
        message: "Coupled ML model detects -35% wind drop & 78% relative humidity trapping particulate pollution in East Delhi corridor over the next 6-12 hours.",
        forecast_horizon: "+6h to +12h",
        timestamp: new Date().toISOString().substring(0, 16).replace('T', ' '),
        suggested_actions: [
          "Deploy anti-smog guns and water sprinklers along Anand Vihar bus terminal.",
          "Issue public health alert restricting outdoor physical exertion.",
          "Restrict commercial diesel heavy vehicles from entry."
        ]
      },
      {
        id: "alert-2",
        station_id: "ghaziabad_vasundhara",
        station_name: "Vasundhara, Ghaziabad",
        severity: "High",
        severity_color: "#EF4444",
        title: "⚠️ High Pollution Spike in UP-NCR Hub",
        message: "PM2.5 predicted to cross 190 µg/m³ threshold with rising humidity trends.",
        forecast_horizon: "+6h",
        timestamp: new Date().toISOString().substring(0, 16).replace('T', ' '),
        suggested_actions: [
          "Advise sensitive demographics (children, elderly) to remain indoors.",
          "Enforce strict dust suppression guidelines at nearby construction zones."
        ]
      }
    ];
  }
};
