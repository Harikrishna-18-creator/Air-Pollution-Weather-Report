from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.stations import router as stations_router
from app.api.forecast import router as forecast_router
from app.api.what_if import router as what_if_router
from app.api.explainable_ai import router as explain_router
from app.api.models_benchmark import router as benchmark_router
from app.api.alerts import router as alerts_router

app = FastAPI(
    title="Air Pollution–Weather Coupled Forecasting API (Delhi NCR)",
    description="SIH 2026 AI Engine for multi-horizon pollution prediction, What-If simulation, and Explainable AI (SHAP)",
    version="1.0.0"
)

# Enable CORS for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(stations_router, prefix="/api", tags=["Stations & Live AQI"])
app.include_router(forecast_router, prefix="/api", tags=["Multi-Horizon Forecast"])
app.include_router(what_if_router, prefix="/api", tags=["What-If Simulator"])
app.include_router(explain_router, prefix="/api", tags=["Explainable AI (SHAP)"])
app.include_router(benchmark_router, prefix="/api", tags=["Model Performance"])
app.include_router(alerts_router, prefix="/api", tags=["Early Warning Alerts"])

@app.get("/")
def root():
    return {
        "status": "online",
        "system": "Air Pollution-Weather Coupled Forecasting Engine (Delhi NCR Focus)",
        "version": "1.0.0",
        "docs": "/docs"
    }
