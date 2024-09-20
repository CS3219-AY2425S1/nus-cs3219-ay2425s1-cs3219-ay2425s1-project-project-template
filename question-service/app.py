import os
from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException


from pydantic.functional_validators import BeforeValidator
from models import QuestionModel, QuestionCollection

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

@app.post("/questions/",
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
async def create_question(question: QuestionModel):
    # check if question with title already exists
    existing_question = await question_collection.find_one({"title": question.title})
    if existing_question:
        raise HTTPException(status_code=409, detail="Question with this title already exists.")
    new_question = await question_collection.insert_one(question.model_dump())
    created_question = await question_collection.find_one({"_id": new_question.inserted_id})
    return created_question

@app.get("/questions/",
        response_description="Get all questions",
        response_model=QuestionCollection)
async def get_questions():
    return QuestionCollection(questions=await question_collection.find().to_list(1000))