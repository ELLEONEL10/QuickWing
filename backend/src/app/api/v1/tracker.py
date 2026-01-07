from typing import Any
from fastapi import APIRouter, Query
from ...services.tracker_service import tracker_service

router = APIRouter(tags=["tracker"])

@router.get("/tracker/status")
async def track_flight(
    flight_iata: str = Query(..., description="Flight IATA code (e.g., AA100)"),
) -> Any:
    """
    Get real-time status of a flight.
    """
    data = await tracker_service.get_flight_status(flight_iata=flight_iata)
    return {"data": data}