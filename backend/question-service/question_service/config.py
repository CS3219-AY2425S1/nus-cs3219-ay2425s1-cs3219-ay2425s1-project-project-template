"""
Global config object
    ie DB Connection strings etc
"""

import os


class Config:
    origins = ["http://localhost"]
    db = os.getenv("QUESTION_MONGO_URL", "http://localhost:27017")
