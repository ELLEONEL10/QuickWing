from sqlalchemy.orm import Session
from app.models.flight import Flight
from app.schemas.flight_schema import FlightCreate

def create_flight(db: Session, flight: FlightCreate):
    db_flight = Flight(**flight.dict())
    db.add(db_flight)
    db.commit()
    db.refresh(db_flight)
    return db_flight
