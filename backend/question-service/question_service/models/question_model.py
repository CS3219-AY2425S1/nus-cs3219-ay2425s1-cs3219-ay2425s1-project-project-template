from beanie import Document


class Question(Document):
    title: str
    titleSlug: str
    difficulty: str
    description: str
    topic: str

    class Config:
        json_schema_extra = {
            "example": {
                "title": "Two Sum",
                "titleSlug": "two-sum",
                "difficulty": "easy",
                "description": "Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.",
                "topic": "Array",
            }
        }
