# app/core/database_session.py

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.core.config import settings

# Database connection URL from the settings
SQLALCHEMY_DATABASE_URL = settings.DATABASE_URL

# Create the engine
engine = create_engine(SQLALCHEMY_DATABASE_URL)

# Session maker
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
