from pydantic import BaseModel

class MatchModel(BaseModel):
    user1: str
    user2: str
    topic: str
    difficulty: str
    room_id: str

class MessageModel(BaseModel):
    message: str
