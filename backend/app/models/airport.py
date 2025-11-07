from sqlalchemy import Column, Integer, String
from app.core.database import Base

class Airport(Base):
    __tablename__ = "airports"

    id   = Column(Integer, primary_key=True, index=True)
    iata = Column(String(3), unique=True, index=True, nullable=False)
    name = Column(String, nullable=False)
    city = Column(String, nullable=False)
    country = Column(String, nullable=False)
