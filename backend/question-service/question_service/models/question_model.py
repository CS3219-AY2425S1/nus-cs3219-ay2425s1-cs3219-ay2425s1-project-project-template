from pydantic import BaseModel, Field

class QuestionModel(BaseModel):
    title: str = Field(min_length=1, max_length=20, pattern=r"^[a-zA-Z0-9 ]+$")
    titleSlug: str = Field(min_length=1, max_length=20, pattern=r"^[a-zA-Z0-9 ]+$")
    description: str = Field(min_length=10)
    difficulty: str
    topic: str = Field(min_length=1, max_length=30)