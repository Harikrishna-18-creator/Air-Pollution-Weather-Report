import json
import os
import pandas as pd
from datetime import datetime
from app.models.schemas import StationInfo, LiveAQIResponse

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA_DIR = os.path.join(BASE_DIR, "data")

def get_risk_category(aqi: int):
    if aqi <= 50:
        return "Good", "#10B981"         # Emerald
    elif aqi <= 100:
        return "Satisfactory", "#84CC16" # Lime
    elif aqi <= 200:
        return "Moderate", "#F59E0B"     # Amber
    elif aqi <= 300:
        return "Poor", "#EF4444"         # Red
    elif aqi <= 400:
        return "Very Poor", "#A855F7"    # Purple
    else:
        return "Severe", "#881337"       # Dark Maroon

def get_health_advisory(risk_level: str):
    advisories = {
        "Good": "Air quality is favorable. Ideal for all outdoor activities and exercise.",
        "Satisfactory": "Air quality is acceptable; minor discomfort for sensitive individuals.",
        "Moderate": "Breathing discomfort possible for children, elderly, and people with respiratory conditions.",
        "Poor": "Breathing discomfort to most people on prolonged exposure. Avoid strenuous outdoor activity.",
        "Very Poor": "Respiratory illness risk on prolonged exposure. Sensitive groups should stay indoors.",
        "Severe": "Emergency alert! High health impact on everyone. Wear N95 masks and restrict outdoor exposure."
    }
    return advisories.get(risk_level, "Exercise caution.")

class DatasetService:
    def __init__(self):
        self.stations_path = os.path.join(DATA_DIR, "delhi_ncr_stations.json")
        self.csv_path = os.path.join(DATA_DIR, "delhi_historical_aqi_weather.csv")
        self.stations_data = self._load_stations()

    def _load_stations(self):
        if os.path.exists(self.stations_path):
            with open(self.stations_path, "r") as f:
                return json.load(f)
        return []

    def get_all_stations(self):
        result = []
        df = self.get_latest_dataframe()
        
        for st in self.stations_data:
            st_id = st["id"]
            if df is not None and not df.empty:
                st_df = df[df["station_id"] == st_id]
                if not st_df.empty:
                    latest = st_df.iloc[-1]
                    aqi = int(latest["aqi"])
                    pm25 = float(latest["pm25"])
                else:
                    aqi = int(st["baseline_pm25"] * 1.5)
                    pm25 = st["baseline_pm25"]
            else:
                aqi = int(st["baseline_pm25"] * 1.5)
                pm25 = st["baseline_pm25"]

            risk_level, risk_color = get_risk_category(aqi)
            
            result.append(StationInfo(
                id=st_id,
                name=st["name"],
                city=st["city"],
                zone=st["zone"],
                lat=st["lat"],
                lng=st["lng"],
                station_type=st["station_type"],
                current_aqi=aqi,
                current_pm25=pm25,
                risk_level=risk_level,
                risk_color=risk_color
            ))
        return result

    def get_latest_dataframe(self):
        if os.path.exists(self.csv_path):
            return pd.read_csv(self.csv_path)
        return None

    def get_live_aqi(self, station_id: str) -> LiveAQIResponse:
        df = self.get_latest_dataframe()
        station_info = next((s for s in self.stations_data if s["id"] == station_id), self.stations_data[0])

        if df is not None and not df.empty:
            st_df = df[df["station_id"] == station_id]
            if not st_df.empty:
                row = st_df.iloc[-1]
                aqi = int(row["aqi"])
                risk_level, risk_color = get_risk_category(aqi)
                return LiveAQIResponse(
                    station_id=station_id,
                    station_name=station_info["name"],
                    city=station_info["city"],
                    timestamp=str(row["timestamp"]),
                    aqi=aqi,
                    risk_level=risk_level,
                    risk_color=risk_color,
                    pm25=float(row["pm25"]),
                    pm10=float(row["pm10"]),
                    no2=float(row["no2"]),
                    so2=float(row["so2"]),
                    co=float(row["co"]),
                    o3=float(row["o3"]),
                    temperature=float(row["temperature"]),
                    humidity=float(row["humidity"]),
                    wind_speed=float(row["wind_speed"]),
                    wind_direction=float(row["wind_direction"]),
                    pressure=float(row["pressure"]),
                    rainfall=float(row["rainfall"]),
                    health_advisory=get_health_advisory(risk_level)
                )

        # Fallback default values
        pm25 = station_info["baseline_pm25"]
        aqi = int(pm25 * 1.5)
        risk_level, risk_color = get_risk_category(aqi)
        return LiveAQIResponse(
            station_id=station_id,
            station_name=station_info["name"],
            city=station_info["city"],
            timestamp=datetime.now().strftime("%Y-%m-%d %H:00:00"),
            aqi=aqi,
            risk_level=risk_level,
            risk_color=risk_color,
            pm25=pm25,
            pm10=station_info["baseline_pm10"],
            no2=station_info["baseline_no2"],
            so2=station_info["baseline_so2"],
            co=station_info["baseline_co"],
            o3=station_info["baseline_o3"],
            temperature=22.5,
            humidity=68.0,
            wind_speed=4.2,
            wind_direction=285.0,
            pressure=1014.2,
            rainfall=0.0,
            health_advisory=get_health_advisory(risk_level)
        )

dataset_service = DatasetService()
