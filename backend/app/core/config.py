
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./dev.db"
    CORS_ORIGINS: list[str] = ["http://localhost:3000"]
    FLIGHTS_API_KEY: str

    class Config:
        env_file = ".env"          # overload defaults via environment
        env_file_encoding = "utf-8"

settings = Settings()
