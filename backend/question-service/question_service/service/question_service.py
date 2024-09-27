from typing import List
from models.question_model import Question

question_collection = Question

async def create_question(new_question: Question) -> Question:
    question = await new_question.create()
    return question

async def get_questions() -> List[Question]:
    questions = await question_collection.all().to_list()
    return questions     
    
async def get_question_by_title(title_slug: str) -> Question:
    question = await question_collection.find_one({"title_slug": title_slug})
    return question

async def update_question(title_slug: str, updated_question: Question) -> Question:
    question = await question_collection.find_one_and_update(
        {"title_slug": title_slug},
        {"$set": updated_question.model_dump()},
        return_document=True
    )
    return question

async def delete_question(title_slug: str) -> None:
    await question_collection.delete_one({"title_slug": title_slug})