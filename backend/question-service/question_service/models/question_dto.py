from typing import Optional

from pydantic import BaseModel, Field, computed_field, field_validator


class TitleSlug(BaseModel):
    title_slug: str = Field(min_length=1, max_length=20, pattern=r"^[a-zA-Z0-9]+(-[a-zA-Z0-9]+)*$")


class UpdateQuestionModel(BaseModel):
    description: Optional[str] = Field(default=None, min_length=10, max_length=140)
    difficulty: Optional[str] = None
    topic: Optional[str] = None

    class Config:
        require_by_default = False
        json_schema_extra = {
            "example": {
                "description": "New description of the question",
                "difficulty": "Medium",
                "topic": "dynamic-programming",
            }
        }


class CreateQuestionModel(BaseModel):
    title: str = Field(min_length=1, max_length=20, pattern=r"^[a-zA-Z0-9 ]+$")
    description: str = Field(min_length=10, max_length=140)
    difficulty: str
    topic: str

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Two Sum",
                "description": "Two Sum problem description",
                "difficulty": "Easy",
                "topic": "array",
            }
        }

    @field_validator("title")
    @classmethod
    def validate_title(cls, v: str) -> str:
        stripped_title = v.strip()
        if len(stripped_title) == 0:
            raise ValueError("Title cannot be empty")
        return stripped_title

    @computed_field
    @property
    def titleSlug(self) -> TitleSlug:
        slugified = "-".join(self.title.lower().split())
        return TitleSlug(title_slug=slugified)
