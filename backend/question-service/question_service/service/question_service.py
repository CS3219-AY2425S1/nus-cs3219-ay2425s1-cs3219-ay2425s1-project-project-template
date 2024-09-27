from typing import List
from beanie import init_beanie
import motor.motor_asyncio

from ..models.question_model import Question

question_collection = Question

async def init_db():
    client = motor.motor_asyncio.AsyncIOMotorClient(
        "mongodb://localhost:27017/questions_db"
    )

    await init_beanie(database=client.db_name, document_models=[Question])


async def create_question(new_question: Question) -> Question:
    question = await new_question.create()
    return question


async def get_questions() -> List[Question]:
    questions = await question_collection.all().to_list()
    return questions


async def get_question(title_slug: str) -> Question:
    question = await question_collection.find_one({"titleSlug": title_slug})
    return question


async def update_question(title_slug: str, updated_question: Question) -> Question:
    question = await question_collection.find_one_and_update(
        {"titleSlug": title_slug}, {"$set": updated_question.model_dump()}, return_document=True
    )
    return question


async def delete_question(title_slug: str) -> None:
    await question_collection.delete_one({"titleSlug": title_slug})
