from fastapi import APIRouter
from app.models.schemas import SHAPResponse
from app.services.shap_service import shap_service

router = APIRouter()

@router.get("/explain/{station_id}", response_model=SHAPResponse)
def get_shap_explanation(station_id: str):
    return shap_service.get_explanation(station_id)
