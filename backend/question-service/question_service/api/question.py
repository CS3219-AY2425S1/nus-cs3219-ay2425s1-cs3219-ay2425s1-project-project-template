from fastapi import APIRouter, HTTPException
from structlog import get_logger

from ..mock import mock_db

router = APIRouter()
logger = get_logger()


@router.get("/question/{titleSlug}")
async def get_question_by_title(titleSlug: str):
    # validate params -> return 401 Bad request
    logger.info(f"Retrieving {titleSlug}")
    if not titleSlug:
        raise HTTPException(status_code=400, detail="Invalid title slug")

    question = mock_db.get_question_by_title(titleSlug)
    if question is None:
        return HTTPException(status_code=404, detail="Question not found")
    return question
