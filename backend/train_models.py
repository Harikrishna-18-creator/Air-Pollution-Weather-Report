import json
import math
import os
import pickle
import numpy as np
import pandas as pd
from datetime import datetime, timedelta

# Import ML models
from sklearn.ensemble import RandomForestRegressor, GradientBoostingRegressor
from sklearn.linear_model import LinearRegression
from sklearn.neural_network import MLPRegressor
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score
from sklearn.preprocessing import StandardScaler

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "app", "data")
os.makedirs(DATA_DIR, exist_ok=True)

# Try importing XGBoost if available
try:
    import xgboost as xgb
    HAS_XGBOOST = True
except ImportError:
    HAS_XGBOOST = False

def calculate_cpcb_aqi(pm25, pm10, no2, so2, co, o3):
    """Calculates official Indian CPCB AQI based on sub-index values."""
    def pm25_subindex(p):
        if p <= 30: return p * (50/30)
        elif p <= 60: return 50 + (p-30)*(50/30)
        elif p <= 90: return 100 + (p-60)*(100/30)
        elif p <= 120: return 200 + (p-90)*(100/30)
        elif p <= 250: return 300 + (p-120)*(100/130)
        else: return 400 + (p-250)*(100/150)

    def pm10_subindex(p):
        if p <= 50: return p
        elif p <= 100: return p
        elif p <= 250: return 100 + (p-100)*(100/150)
        elif p <= 350: return 200 + (p-250)*(100/100)
        elif p <= 430: return 300 + (p-350)*(100/80)
        else: return 400 + (p-430)*(100/70)

    sub_indices = [
        pm25_subindex(max(0, pm25)),
        pm10_subindex(max(0, pm10)),
        min(500, no2 * 1.25),
        min(500, so2 * 1.1),
        min(500, co * 50),
        min(500, o3 * 1.5)
    ]
    return int(round(max(sub_indices)))

def generate_delhi_ncr_dataset(num_days=120):
    """Generates synthetic hourly Coupled Air Quality & Weather Dataset for Delhi NCR."""
    print(f"🌱 Generating {num_days} days of hourly Coupled Pollution & Weather dataset...")
    
    stations_path = os.path.join(DATA_DIR, "delhi_ncr_stations.json")
    with open(stations_path, "r") as f:
        stations = json.load(f)

    start_date = datetime(2025, 1, 1, 0, 0, 0)
    total_hours = num_days * 24
    records = []

    np.random.seed(42)

    for h in range(total_hours):
        curr_time = start_date + timedelta(hours=h)
        month = curr_time.month
        hour = curr_time.hour
        day_of_year = curr_time.timetuple().tm_yday

        # Seasonal Temperature (°C)
        is_winter = month in [11, 12, 1, 2]
        is_summer = month in [5, 6, 7]
        base_temp = 14.0 if is_winter else (38.0 if is_summer else 26.0)
        temp = base_temp + 6.0 * math.cos((hour - 15) * math.pi / 12) + np.random.normal(0, 1.5)

        # Humidity (%)
        humidity = max(20.0, min(98.0, 75.0 - 0.8 * temp + 15.0 * math.sin(hour * math.pi / 12) + np.random.normal(0, 3.0)))

        # Wind Speed (km/h) - Inversely related to humidity and nighttime boundary layer
        base_wind = 4.0 if is_winter else 12.0
        wind_speed = max(0.5, base_wind + 4.0 * math.sin((hour - 12) * math.pi / 12) + np.random.normal(0, 1.2))

        # Wind Direction (Degrees)
        wind_direction = (290 + 30 * math.sin(h / 24.0) + np.random.normal(0, 15)) % 360

        # Pressure (hPa)
        pressure = 1015.0 - 0.15 * temp + np.random.normal(0, 1.0)

        # Rainfall (mm)
        rain_prob = 0.25 if month in [7, 8] else 0.03
        rainfall = round(max(0.0, np.random.exponential(4.0)), 1) if np.random.rand() < rain_prob else 0.0

        # Stubble burning effect (Spike in Oct-Nov)
        stubble_factor = 2.4 if (month == 11 or (month == 10 and curr_time.day > 20)) else 1.0

        for st in stations:
            base_pm25 = st["baseline_pm25"]
            
            # Atmospheric Dispersion Mechanics:
            # Low Wind Speed + High Humidity + Low Temp + Stubble Factor = Pollution Trap
            inversion_mult = (1.0 + max(0, (8.0 - wind_speed)) * 0.14) * (1.0 + (humidity / 100.0) * 0.35)
            diurnal_mult = 1.35 if (hour in [7, 8, 9, 10, 19, 20, 21, 22]) else 0.85
            seasonal_mult = 1.8 if is_winter else 0.7

            pm25 = base_pm25 * inversion_mult * diurnal_mult * seasonal_mult * stubble_factor * np.random.uniform(0.85, 1.15)
            if rainfall > 2.0:
                pm25 *= max(0.2, 1.0 - (rainfall * 0.12)) # Rain wash-out effect

            pm25 = round(max(10.0, pm25), 1)
            pm10 = round(pm25 * np.random.uniform(1.6, 2.1), 1)
            no2 = round(st["baseline_no2"] * diurnal_mult * np.random.uniform(0.8, 1.2), 1)
            so2 = round(st["baseline_so2"] * np.random.uniform(0.85, 1.15), 1)
            co = round(st["baseline_co"] * diurnal_mult * np.random.uniform(0.85, 1.15), 2)
            o3 = round(st["baseline_o3"] * max(0.2, math.sin((hour - 6) * math.pi / 12)) * np.random.uniform(0.8, 1.2), 1)
            aqi = calculate_cpcb_aqi(pm25, pm10, no2, so2, co, o3)

            records.append({
                "timestamp": curr_time.strftime("%Y-%m-%d %H:%00:%00"),
                "station_id": st["id"],
                "station_name": st["name"],
                "city": st["city"],
                "pm25": pm25,
                "pm10": pm10,
                "no2": no2,
                "so2": so2,
                "co": co,
                "o3": o3,
                "aqi": aqi,
                "temperature": round(temp, 1),
                "humidity": round(humidity, 1),
                "wind_speed": round(wind_speed, 1),
                "wind_direction": round(wind_direction, 1),
                "pressure": round(pressure, 1),
                "rainfall": rainfall
            })

    df = pd.DataFrame(records)
    csv_path = os.path.join(DATA_DIR, "delhi_historical_aqi_weather.csv")
    df.to_csv(csv_path, index=False)
    print(f"✅ Generated dataset with {len(df)} rows saved to {csv_path}")
    return df

def train_and_export_models():
    """Trains forecasting models, builds feature engineered variables & exports trained pipelines."""
    csv_path = os.path.join(DATA_DIR, "delhi_historical_aqi_weather.csv")
    if not os.path.exists(csv_path):
        df = generate_delhi_ncr_dataset(num_days=90)
    else:
        df = pd.read_csv(csv_path)

    df['timestamp'] = pd.to_datetime(df['timestamp'])
    df = df.sort_values(['station_id', 'timestamp']).reset_index(drop=True)

    print("⚡ Engineering Features & Time Lags...")
    # Lags per station
    df['pm25_lag_1h'] = df.groupby('station_id')['pm25'].shift(1)
    df['pm25_lag_3h'] = df.groupby('station_id')['pm25'].shift(3)
    df['pm25_lag_6h'] = df.groupby('station_id')['pm25'].shift(6)
    df['pm25_lag_24h'] = df.groupby('station_id')['pm25'].shift(24)

    df['pm25_roll_mean_3h'] = df.groupby('station_id')['pm25'].transform(lambda x: x.rolling(3, min_periods=1).mean())
    df['pm25_roll_mean_24h'] = df.groupby('station_id')['pm25'].transform(lambda x: x.rolling(24, min_periods=1).mean())

    # Weather coupling interaction terms
    df['wind_inv'] = 1.0 / (df['wind_speed'] + 0.5)
    df['temp_humidity_idx'] = (df['temperature'] * df['humidity']) / 100.0
    df['stubble_idx'] = df['timestamp'].dt.month.apply(lambda m: 2.2 if m in [10, 11] else 1.0)

    # Time encoding
    df['hour'] = df['timestamp'].dt.hour
    df['sin_hour'] = np.sin(2 * np.pi * df['hour'] / 24.0)
    df['cos_hour'] = np.cos(2 * np.pi * df['hour'] / 24.0)

    # Future Targets: +6h PM2.5 prediction horizon
    df['target_pm25_6h'] = df.groupby('station_id')['pm25'].shift(-6)

    # Clean missing values resulting from shifts
    df_clean = df.dropna().copy()

    feature_cols = [
        'pm25', 'pm10', 'no2', 'so2', 'co', 'temperature', 'humidity', 
        'wind_speed', 'pressure', 'rainfall', 'pm25_lag_1h', 'pm25_lag_3h', 
        'pm25_lag_6h', 'pm25_lag_24h', 'pm25_roll_mean_3h', 'pm25_roll_mean_24h', 
        'wind_inv', 'temp_humidity_idx', 'sin_hour', 'cos_hour'
    ]

    X = df_clean[feature_cols]
    y = df_clean['target_pm25_6h']

    # Train / Test Split (Time-based split)
    split_idx = int(len(X) * 0.8)
    X_train, X_test = X.iloc[:split_idx], X.iloc[split_idx:]
    y_train, y_test = y.iloc[:split_idx], y.iloc[split_idx:]

    scaler = StandardScaler()
    X_train_scaled = scaler.fit_transform(X_train)
    X_test_scaled = scaler.transform(X_test)

    print("🤖 Training Forecasting Models...")
    
    # Model 1: Random Forest
    rf_model = RandomForestRegressor(n_estimators=60, max_depth=12, random_state=42, n_jobs=-1)
    rf_model.fit(X_train, y_train)
    rf_preds = rf_model.predict(X_test)

    # Model 2: XGBoost or GradientBoosting
    if HAS_XGBOOST:
        xgb_model = xgb.XGBRegressor(n_estimators=100, learning_rate=0.08, max_depth=6, random_state=42)
        xgb_model.fit(X_train, y_train)
        xgb_preds = xgb_model.predict(X_test)
        print("  ✓ XGBoost trained successfully")
    else:
        xgb_model = GradientBoostingRegressor(n_estimators=100, learning_rate=0.08, max_depth=5, random_state=42)
        xgb_model.fit(X_train, y_train)
        xgb_preds = xgb_model.predict(X_test)
        print("  ✓ GradientBoosting (XGBoost fallback) trained")

    # Model 3: Neural Sequence Predictor (MLP Deep Network)
    mlp_model = MLPRegressor(hidden_layer_sizes=(64, 32), max_iter=150, random_state=42)
    mlp_model.fit(X_train_scaled, y_train)
    mlp_preds = mlp_model.predict(X_test_scaled)
    print("  ✓ Neural Network (LSTM/MLP sequence proxy) trained")

    # Model 4: Linear Regression
    lr_model = LinearRegression()
    lr_model.fit(X_train_scaled, y_train)
    lr_preds = lr_model.predict(X_test_scaled)
    print("  ✓ Linear Regression baseline trained")

    # Compute Benchmarks
    def eval_metrics(y_true, y_pred):
        mae = mean_absolute_error(y_true, y_pred)
        rmse = np.sqrt(mean_squared_error(y_true, y_pred))
        r2 = r2_score(y_true, y_pred)
        mape = np.mean(np.abs((y_true - y_pred) / np.maximum(y_true, 1.0))) * 100
        return {"mae": round(mae, 2), "rmse": round(rmse, 2), "r2": round(r2, 3), "mape": round(mape, 2)}

    metrics = {
        "XGBoost": eval_metrics(y_test, xgb_preds),
        "Random Forest": eval_metrics(y_test, rf_preds),
        "LSTM / Neural Net": eval_metrics(y_test, mlp_preds),
        "Linear Regression": eval_metrics(y_test, lr_preds)
    }

    print("\n📊 Model Benchmark Summary (+6h PM2.5 Forecast):")
    for name, m in metrics.items():
        print(f"  • {name:20s} -> MAE: {m['mae']} | RMSE: {m['rmse']} | R²: {m['r2']} | MAPE: {m['mape']}%")

    # Save model artifacts & scalar
    artifacts = {
        "rf": rf_model,
        "xgb": xgb_model,
        "mlp": mlp_model,
        "lr": lr_model,
        "scaler": scaler,
        "feature_cols": feature_cols,
        "metrics": metrics,
        "feature_importances": dict(zip(feature_cols, rf_model.feature_importances_))
    }

    model_pkl_path = os.path.join(DATA_DIR, "trained_models.pkl")
    with open(model_pkl_path, "wb") as f:
        pickle.dump(artifacts, f)

    print(f"\n💾 Saved trained models and benchmarks to {model_pkl_path}")

if __name__ == "__main__":
    generate_delhi_ncr_dataset(num_days=90)
    train_and_export_models()
