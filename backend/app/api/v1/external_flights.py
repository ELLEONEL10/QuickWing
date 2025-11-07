from fastapi import APIRouter, Query, Depends
from fastapi.responses import JSONResponse
from app.services.flights_external import fetch_flights

router = APIRouter(tags=["flights"])

@router.get("/flights/search")
async def search_flights(
    origin: str | None = Query(None, min_length=3, max_length=3, description="IATA code"),
    destination: str | None = Query(None, min_length=3, max_length=3),
    date: str | None = Query(None, regex=r"^\d{4}-\d{2}-\d{2}$"),
):
    data = await fetch_flights(origin=origin, destination=destination, date=date)
    return JSONResponse(data)                # plain list of flights
