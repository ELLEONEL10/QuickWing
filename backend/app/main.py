from fastapi import FastAPI

from app.core.database import Base, engine
from app.models import user, flight, booking  

from app.api.v1 import flights as flights_router

from app.api.v1 import external_flights  

from app.api.v1 import flights_search

from app.api.v1 import airports  

# Create DB tables on startup (SQLite/dev only; for prod use Alembic migrations)
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Fareko API")


app.include_router(flights_router.router, prefix="/api/v1")

app.include_router(external_flights.router, prefix="/api/v1")

app.include_router(flights_search.router, prefix="/api/v1")

app.include_router(airports.router, prefix="/api/v1")
