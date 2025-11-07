from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.services.airport_service import search_airports

router = APIRouter(tags=["airports"])

@router.get("/airports/search")
def airport_autocomplete(
    q: str = Query(..., min_length=1),
    db: Session = Depends(get_db)
):
    results = search_airports(db, q)
    return [
        {
            "id": a.id,
            "iata": a.iata,
            "name": a.name,
            "city": a.city,
            "country": a.country,
        }
        for a in results
    ]
