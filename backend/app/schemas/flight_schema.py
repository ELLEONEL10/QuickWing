from pydantic import BaseModel

class FlightCreate(BaseModel):
    departure: str
    arrival: str
    price: float
    seats_available: int

class FlightOut(FlightCreate):
    id: int

    class Config:
        orm_mode = True
