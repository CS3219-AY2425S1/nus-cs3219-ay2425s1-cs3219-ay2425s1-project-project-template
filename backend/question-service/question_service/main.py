from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from structlog import get_logger

from .api import main_router
from .config import Config

logger = get_logger()

app = FastAPI(title="Question Service Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=Config.origins,
    allow_credentials=True,
    allow_methods=["*"],
    # To update if after auth
    allow_headers=["*"],
)
app.include_router(main_router)

logger.info("📚 Question service started")
