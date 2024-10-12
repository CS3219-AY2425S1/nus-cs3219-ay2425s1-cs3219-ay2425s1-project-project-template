from fastapi import APIRouter, HTTPException
# from models.questions import CreateQuestionModel, UpdateQuestionModel, QuestionModel, QuestionCollection, MessageModel
from typing import List

router = APIRouter()

# Make a dummy endpoint to test the connection
@router.get("/")
async def test_connection():
    return {"message": "Connection successful"}