from fastapi import APIRouter, Query
from app.services.external_flights import external_search

router = APIRouter(tags=["flights"])

@router.get("/flights/search")
async def search_flights(
    origin: str | None = Query(None, min_length=3, max_length=3),
    destination: str | None = Query(None, min_length=3, max_length=3),
    date: str | None = Query(None, regex=r"^\d{4}-\d{2}-\d{2}$"),
):
    return await external_search(origin=origin, destination=destination, date=date)
