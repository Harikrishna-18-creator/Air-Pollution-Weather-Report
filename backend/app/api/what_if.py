from fastapi import APIRouter
from app.models.schemas import WhatIfRequest, WhatIfResponse
from app.services.what_if_engine import what_if_engine

router = APIRouter()

@router.post("/what-if", response_model=WhatIfResponse)
def simulate_what_if(req: WhatIfRequest):
    return what_if_engine.simulate_scenario(req)
