from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from structlog import get_logger
from pydantic import BaseModel
from redis import Redis
from typing import List

from .config import settings
from matching_service.common import MatchRequest

logger = get_logger()

# Initialize FastAPI app
app = FastAPI(
    title="Matching Service Backend",
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define the Redis client
redis_client = Redis.from_url(settings.redis_url)

def request_match(publisher: Redis, user: MatchRequest):
    channel = RedisSettings.Channels.REQUESTS.value
    publisher.publish(channel, user.model_dump_json())
    logger.info(f"CLIENT: User {user.user} requested match for {user.topic}, {user.difficulty}")



# Define the request model
class User(BaseModel):
    user: str
    topic: str
    difficulty: str


# @app.get("/match", response_model=dict)
# async def get_match(user: User):
#     """
#     Example GET endpoint for basic testing.
#     """
#     return {"message": "Hello from matching service"}


@app.post("/match", response_model=dict)
async def create_match(user: User):
    """
    Create a match request for a user. This will publish the match request to the Redis channel.
    """
    try:
        # Create a MatchRequest object from the incoming User data
        match_request = MatchRequest(user=user.user, topic=user.topic, difficulty=user.difficulty)

        # Publish the match request to the Redis channel using the request_match function
        request_match(redis_client, match_request)

        # Return a success response
        return {"message": f"Match request for {user.user} has been created successfully."}
    except Exception as e:
        logger.error(f"Error while creating match: {e}")
        raise HTTPException(status_code=500, detail="An error occurred while creating the match.")
