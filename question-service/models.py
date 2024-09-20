from enum import Enum
from pydantic import BaseModel

class ComplexityEnum(str, Enum):
    easy = "easy"
    medium = "medium"
    hard = "hard"

class QuestionModel(BaseModel):
    title: str
    description: str
    category: str
    complexity: ComplexityEnum

class QuestionCollection(BaseModel):
    questions: list[QuestionModel]