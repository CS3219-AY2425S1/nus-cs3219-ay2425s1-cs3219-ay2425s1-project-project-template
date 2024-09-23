from app.models.questions import CreateQuestionModel, QuestionCollection, QuestionModel
from dotenv import load_dotenv
import motor.motor_asyncio
import os

# Load env variables
load_dotenv()

DB_CLOUD_URI = os.getenv("DB_CLOUD_URI")

# Setup MongoDB client
client = motor.motor_asyncio.AsyncIOMotorClient(DB_CLOUD_URI)
db = client.get_database("question_service")
question_collection = db.get_collection("questions")

async def create_question(question: CreateQuestionModel):
    existing_question = await question_collection.find_one({"title": question.title})
    if existing_question:
        return None
    new_question = await question_collection.insert_one(question.model_dump())
    return await question_collection.find_one({"_id": new_question.inserted_id})

async def get_all_questions() -> QuestionCollection:
    questions = await question_collection.find().to_list(1000)
    return QuestionCollection(questions=questions)
