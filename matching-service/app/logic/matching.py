from typing import Union

from models.match import MatchModel, MessageModel
from utils.redis import get_redis, acquire_lock, release_lock
from utils.socketmanager import manager

async def find_match_else_enqueue(
    user_id: str,
    topic: str,
    difficulty: str
) -> Union[MessageModel, MatchModel]:
    redis_client = await get_redis()
    queue_key = _build_queue_key(topic, difficulty)

    result = None

    # ACQUIRE LOCK
    islocked = await acquire_lock(redis_client, queue_key)

    if not islocked:
        raise Exception("Could not acquire lock")

    # Check if the user is already in the queue
    user_in_queue = await redis_client.lrange(queue_key, 0, -1)
    if user_id in user_in_queue:
        result = MessageModel(
            message=f"User {user_id} is already in the queue, waiting for a match"
        )
    else:
        queue_length = await redis_client.llen(queue_key)
        if queue_length > 0:
            matched_user = await redis_client.rpop(queue_key)
            result = MatchModel(
                user1=user_id,
                user2=matched_user,
                topic=topic,
                difficulty=difficulty,
            )
            await manager.broadcast(matched_user, topic, difficulty, result.json())
            # await manager.disconnect(matched_user, topic, difficulty)
        else:
            await redis_client.lpush(queue_key, user_id)
            result = MessageModel(
                message=f"User {user_id} enqueued, waiting for a match"
            )

    # RELEASE LOCK
    await release_lock(redis_client, queue_key)
    return result

async def remove_user_from_queue(
    user_id: str,
    topic: str,
    difficulty: str
) -> MessageModel:
    redis_client = await get_redis()
    queue_key = _build_queue_key(topic, difficulty)

    # ACQUIRE LOCK
    islocked = await acquire_lock(redis_client, queue_key)

    if not islocked:
        raise Exception("Could not acquire lock")

    # Check if the user is already in the queue
    user_in_queue = await redis_client.lrange(queue_key, 0, -1)
    if user_id in user_in_queue:
        await redis_client.lrem(queue_key, 0, user_id)
        result = MessageModel(message=f"User {user_id} removed from the queue")
    else:
        result = MessageModel(message=f"User {user_id} is not in the queue")

    # RELEASE LOCK
    await release_lock(redis_client, queue_key)
    return result

'''
Helper functions for matching.
'''
# Builds a queue key based on topic and difficulty
def _build_queue_key(topic: str, difficulty: str):
    return f"{topic}:{difficulty}"
