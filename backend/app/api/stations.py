from fastapi import APIRouter
from typing import List
from app.models.schemas import StationInfo, LiveAQIResponse
from app.services.dataset_service import dataset_service

router = APIRouter()

@router.get("/stations", response_model=List[StationInfo])
def get_stations():
    return dataset_service.get_all_stations()

@router.get("/live/{station_id}", response_model=LiveAQIResponse)
def get_live_aqi(station_id: str):
    return dataset_service.get_live_aqi(station_id)
