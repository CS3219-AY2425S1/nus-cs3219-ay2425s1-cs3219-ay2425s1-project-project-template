from fastapi import APIRouter, HTTPException
from app.models.questions import CreateQuestionModel, QuestionModel, QuestionCollection
from app.crud.questions import create_question, get_all_questions

router = APIRouter()

@router.post("/",
            response_description="Create new question",
            response_model=QuestionModel,
            responses={
                409: {
                    "content": {
                        "application/json": {
                            "example": {
                                "detail": "A question with this title already exists."
                            }
                        }
                    },
                }
                ,
            })
async def create(question: CreateQuestionModel):
    existing_question = await create_question(question)
    if existing_question is None:
        raise HTTPException(status_code=409, detail="Question with this title already exists.")
    return existing_question

@router.get("/", response_description="Get all questions", response_model=QuestionCollection)
async def get_all():
    return await get_all_questions()
