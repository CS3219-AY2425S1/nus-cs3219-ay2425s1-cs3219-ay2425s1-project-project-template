import os
from dotenv import load_dotenv
from fastapi import FastAPI

from enum import Enum
from pydantic import BaseModel, Field
from pydantic.functional_validators import BeforeValidator

from typing_extensions import Annotated
import motor.motor_asyncio

# load env variables
load_dotenv()

DB_CLOUD_URI = os.getenv("DB_CLOUD_URI")

app = FastAPI(title="Question Service API")
client = motor.motor_asyncio.AsyncIOMotorClient(DB_CLOUD_URI)
db = client.get_database("question_service")
question_collection = db.get_collection("questions")

PyObjectId = Annotated[str, BeforeValidator(str)]

class ComplexityEnum(str, Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"

class QuestionModel(BaseModel):
    id: PyObjectId | None = Field(alias="_id", default=None)
    title: str
    description: str
    category: str
    complexity: ComplexityEnum

class QuestionCollection(BaseModel):
    questions: list[QuestionModel]

@app.post("/questions/",
            response_description="Create new question",
            response_model=QuestionModel)
async def create_question(question: QuestionModel):
    new_question = await question_collection.insert_one(question.model_dump(by_alias=True, exclude=["id"]))
    created_question = await question_collection.find_one({"_id": new_question.inserted_id})
    return created_question

@app.get("/questions/",
        response_description="Get all questions",
        response_model=QuestionCollection)
async def get_questions():
    return QuestionCollection(questions=await question_collection.find().to_list(1000))