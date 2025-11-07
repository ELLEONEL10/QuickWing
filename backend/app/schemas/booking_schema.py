from pydantic import BaseModel

class BookingCreate(BaseModel):
    user_id: int
    flight_id: int

class BookingOut(BookingCreate):
    id: int

    class Config:
        orm_mode = True
