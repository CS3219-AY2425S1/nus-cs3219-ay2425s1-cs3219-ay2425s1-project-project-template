"""
Loading env vars from .env files for FastAPI
https://fastapi.tiangolo.com/advanced/settings/

If env vars are not supplied by a .env file,
default values defined in the class are used

Defining env vars with `export` in terminal overrides
env file values
"""

import os
from enum import Enum
from pathlib import Path

from dotenv import load_dotenv
from pydantic_settings import BaseSettings

from .common import Difficulty

load_dotenv()
this_file = os.path.abspath(os.path.dirname(__file__))
PROJECT_ROOT = os.path.abspath(os.path.join(this_file, os.pardir))
ENV_PATH = Path(PROJECT_ROOT) / ".env"


class Settings(BaseSettings):
    # Env vars
    REDIS_URL: str = "redis://localhost:6379"
    ORIGINS: list[str] = ["http://localhost", "http://localhost:3000"]

    # Match expiry
    MATCH_TIMEOUT: int = 30

    class Config:
        env_file = ENV_PATH
        env_ignore_empty = (True,)
        extra = "ignore"


settings = Settings()


class RedisSettings:
    class Channels(Enum):
        EASY: str = "easy_chan"
        MED: str = "med_chan"
        HARD: str = "hard_chan"
        MATCHES: str = "matches"

    db_map = {Difficulty.Easy: 0, Difficulty.Medium: 1, Difficulty.Hard: 2, Channels.MATCHES: 3}

    @staticmethod
    def redis_url(db: Difficulty | Channels) -> str:
        if db not in RedisSettings.db_map:
            raise ValueError("No such Redis DB")
        return f"{settings.REDIS_URL}/{RedisSettings.db_map[db]}"
