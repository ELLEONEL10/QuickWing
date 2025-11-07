# app/api/v1/auth.py

from fastapi import APIRouter, Depends
from app.schemas.user_schema import UserCreate, UserOut
from app.services.auth_service import create_access_token, get_password_hash
from app.core.database import get_db  # Importing get_db function here
from sqlalchemy.orm import Session
from backend.app.models.user import User

router = APIRouter()

@router.post("/register", response_model=UserOut)
def register(user: UserCreate, db: Session = Depends(get_db)):
    hashed_password = get_password_hash(user.password)
    db_user = User(email=user.email, hashed_password=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user
