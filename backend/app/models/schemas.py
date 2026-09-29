from pydantic import BaseModel
from typing import List, Optional, Dict

class StationInfo(BaseModel):
    id: str
    name: str
    city: str
    zone: str
    lat: float
    lng: float
    station_type: str
    current_aqi: int
    current_pm25: float
    risk_level: str
    risk_color: str

class LiveAQIResponse(BaseModel):
    station_id: str
    station_name: str
    city: str
    timestamp: str
    aqi: int
    risk_level: str
    risk_color: str
    pm25: float
    pm10: float
    no2: float
    so2: float
    co: float
    o3: float
    temperature: float
    humidity: float
    wind_speed: float
    wind_direction: float
    pressure: float
    rainfall: float
    health_advisory: str

class ForecastItem(BaseModel):
    horizon: str  # "1h", "3h", "6h", "12h", "24h", "48h"
    horizon_hours: int
    forecast_timestamp: str
    predicted_pm25: float
    predicted_aqi: int
    risk_level: str
    risk_color: str
    conf_low: float
    conf_high: float

class ForecastResponse(BaseModel):
    station_id: str
    station_name: str
    model_used: str
    current_pm25: float
    forecasts: List[ForecastItem]
    model_comparison: Dict[str, List[ForecastItem]]

class WhatIfRequest(BaseModel):
    station_id: str = "delhi_anand_vihar"
    wind_speed_change_pct: float = 0.0  # e.g., -30.0 for 30% decrease
    humidity_change_pct: float = 0.0    # e.g., +20.0 for 20% increase
    temp_change_deg: float = 0.0        # e.g., -4.0 for 4 deg drop
    stubble_burning_factor: float = 1.0 # 1.0 (Normal) to 3.0 (Severe)

class WhatIfResponse(BaseModel):
    station_id: str
    station_name: str
    baseline_pm25: float
    simulated_pm25: float
    delta_pm25: float
    delta_pct: float
    baseline_aqi: int
    simulated_aqi: int
    baseline_risk: str
    simulated_risk: str
    simulated_forecast_6h: float
    weather_explanation: str
    contributing_factors: List[str]

class SHAPFeature(BaseModel):
    feature_name: str
    feature_label: str
    value: str
    impact_pm25: float
    is_increasing: bool

class SHAPResponse(BaseModel):
    station_id: str
    station_name: str
    baseline_pm25: float
    predicted_pm25: float
    features: List[SHAPFeature]
    summary_text: str

class ModelBenchmarkItem(BaseModel):
    model_name: str
    mae: float
    rmse: float
    r2: float
    mape: float
    description: str

class AlertItem(BaseModel):
    id: str
    station_id: str
    station_name: str
    severity: str  # "Moderate", "High", "Critical"
    severity_color: str
    title: str
    message: str
    forecast_horizon: str
    timestamp: str
    suggested_actions: List[str]
