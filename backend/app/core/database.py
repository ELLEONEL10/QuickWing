# app/core/database.py
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# 1) Connection string — keep or replace with your own
SQLALCHEMY_DATABASE_URL = "sqlite:///./dev.db"

# 2) Engine (talks to the database)
engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},  # needed only for SQLite
)

# 3) Session factory
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# 4) Declarative base class for your models
Base = declarative_base()

# 5) Dependency you’ll use in FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
