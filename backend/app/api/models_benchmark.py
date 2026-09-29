from fastapi import APIRouter
from typing import List
from app.models.schemas import ModelBenchmarkItem
from app.services.ml_service import ml_service

router = APIRouter()

@router.get("/model-performance", response_model=List[ModelBenchmarkItem])
def get_model_benchmarks():
    return ml_service.get_benchmarks()
