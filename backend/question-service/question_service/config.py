"""
Global config object
    ie DB Connection strings etc
"""

import os


class Config:
    origins = ["http://localhost","http://localhost:3000"]
    db = os.getenv("QUESTION_MONGO_URL", "http://localhost:27017")
