from sqlalchemy import Column, Integer, String, Float
from app.core.database import Base

class Flight(Base):
    __tablename__ = "flights"
    
    id = Column(Integer, primary_key=True, index=True)
    departure = Column(String, index=True)
    arrival = Column(String, index=True)
    price = Column(Float)
    seats_available = Column(Integer)
