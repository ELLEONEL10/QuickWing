import httpx, asyncio
from typing import Any, Dict, List
from app.core.config import settings

BASE_URL = "https://api.aviationstack.com/v1/flights"   # vendor endpoint

async def external_search(
    origin: str | None = None,
    destination: str | None = None,
    date: str | None = None,            # "YYYY-MM-DD"
) -> List[Dict[str, Any]]:
    params = {"access_key": settings.FLIGHTS_API_KEY}
    if origin:      params["dep_iata"]   = origin.upper()
    if destination: params["arr_iata"]   = destination.upper()
    if date:        params["flight_date"] = date
    async with httpx.AsyncClient(timeout=20) as client:
        resp = await client.get(BASE_URL, params=params)
        resp.raise_for_status()
        return resp.json().get("data", [])
