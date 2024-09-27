"""
Global config object
    ie DB Connection strings etc
"""

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file="../.env",
        env_ignore_empty=True,
        extra="ignore",
    )

    QUESTION_DB_URL: str = "mongodb://localhost:27017"
    DB_NAME: str = "questions_db"
    COLLECTION_NAME: str = "questions"
    ORIGINS: list[str] = ["http://localhost", "http://localhost:3000"]


settings = Settings()
