from sqlalchemy.orm import Session
from sqlalchemy import select
from app.models.airport import Airport

def search_airports(db: Session, q: str, limit: int = 10):
    pattern = f"{q.upper()}%"
    stmt = (
        select(Airport)
        .where(Airport.iata.like(pattern) | Airport.name.ilike(f"%{q}%"))
        .limit(limit)
    )
    return db.execute(stmt).scalars().all()
