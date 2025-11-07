from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.flight import Flight  # your SQLAlchemy model
from app.schemas.flight_schema import FlightOut  # Pydantic schema

router = APIRouter(tags=["flights"])

@router.get("/flights", response_model=list[FlightOut])
def list_flights(db: Session = Depends(get_db)):
    return db.query(Flight).all()
