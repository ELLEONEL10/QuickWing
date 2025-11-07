import httpx
from app.core.config import settings

BASE_URL = "https://api.aviationstack.com/v1/flights"   # example vendor URL

async def fetch_flights(*, origin: str | None = None,
                             destination: str | None = None,
                             date: str | None = None) -> list[dict]:
    """Hit the external API, return a list of flight dicts."""
    params = {"access_key": settings.FLIGHTS_API_KEY}
    if origin:       params["dep_iata"]  = origin.upper()
    if destination:  params["arr_iata"]  = destination.upper()
    if date:         params["flight_date"] = date   # YYYY-MM-DD

    async with httpx.AsyncClient(timeout=15) as client:
        r = await client.get(BASE_URL, params=params)
        r.raise_for_status()
        return r.json().get("data", [])
