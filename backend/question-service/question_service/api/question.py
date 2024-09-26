from fastapi import APIRouter, HTTPException, Response
from structlog import get_logger

from ..mock import mock_db
from ..schemas import UpdateQuestionModel

router = APIRouter()
logger = get_logger()


@router.get("/question/{titleSlug}")
async def get_question_by_title(titleSlug: str) -> dict:
    # validate params -> return 401 Bad request
    logger.info(f"Retrieving {titleSlug}")
    if not titleSlug:
        raise HTTPException(status_code=400, detail="Invalid title slug")

    question = mock_db.get_question_by_title(titleSlug)
    if question is None:
        raise HTTPException(status_code=404, detail="Question not found")
    return question


@router.delete("/question/{titleSlug}")
async def delete_question_by_title(titleSlug: str):
    if not titleSlug:
        raise HTTPException(status_code=400, detail="Invalid title slug")

    logger.info(f"Delete: {len(mock_db.db)}")
    mock_db.delete_question(titleSlug)
    logger.info(f"{len(mock_db.db)}")
    return Response(status_code=200)


@router.patch("/question/{titleSlug}")
async def update_question_by_title(titleSlug: str, req: UpdateQuestionModel):
    if not titleSlug:
        raise HTTPException(status_code=400, detail="Invalid title slug")
    question = mock_db.update_question(titleSlug, req.model_dump(exclude_unset=True))
    return question


@router.get("/question/")
async def get_all_questions() -> dict:
    logger.info("Retrieving all questions")

    questions = mock_db.get_questions()
    if questions is None:
        raise HTTPException(status_code=404, detail="There are no questions in question bank")
    return questions


@router.post("/question/")
async def create_question(question: dict):
    if not question:
        raise HTTPException(status_code=400, detail="Invalid question")
    question = mock_db.create_question(question)
    return question
