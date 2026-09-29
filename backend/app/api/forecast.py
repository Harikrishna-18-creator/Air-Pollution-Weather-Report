from fastapi import APIRouter, Query
from app.models.schemas import ForecastResponse
from app.services.ml_service import ml_service

router = APIRouter()

@router.get("/forecast/{station_id}", response_model=ForecastResponse)
def get_forecast(station_id: str, model: str = Query("XGBoost", description="Model name: XGBoost, Random Forest, LSTM / Neural Net, Linear Regression")):
    return ml_service.get_forecasts(station_id=station_id, model_name=model)
